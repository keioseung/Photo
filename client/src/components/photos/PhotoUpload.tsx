import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient } from 'react-query';
import { X, Upload, Image, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface PhotoUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ isOpen, onClose, onSuccess }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation(
    (files: File[]) => api.uploadPhotos(files, (progress) => setUploadProgress(progress)),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        setUploadedFiles([]);
        setUploadProgress(0);
        onSuccess?.();
        queryClient.invalidateQueries('stats');
      },
      onError: (error: any) => {
        const message = error.response?.data?.error || '업로드에 실패했습니다.';
        toast.error(message);
        setUploadProgress(0);
      },
    }
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: true,
    maxFiles: 10,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const handleUpload = () => {
    if (uploadedFiles.length === 0) {
      toast.error('업로드할 파일을 선택해주세요.');
      return;
    }
    uploadMutation.mutate(uploadedFiles);
  };

  const handleClose = () => {
    if (!uploadMutation.isLoading) {
      setUploadedFiles([]);
      setUploadProgress(0);
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={handleClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">사진 업로드</h3>
                <button
                  onClick={handleClose}
                  disabled={uploadMutation.isLoading}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Upload Area */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-primary-600 font-medium">파일을 여기에 놓으세요</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">
                      파일을 드래그하거나 <span className="text-primary-500">클릭</span>하여 선택하세요
                    </p>
                    <p className="text-sm text-gray-500">
                      최대 10개 파일, 각 파일 50MB 이하
                    </p>
                  </div>
                )}
              </div>

              {/* Selected Files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    선택된 파일 ({uploadedFiles.length}개)
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                        <Image className="w-4 h-4 text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {uploadMutation.isLoading && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">업로드 중...</span>
                    <span className="text-sm text-gray-500">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error Display */}
              {uploadMutation.error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-700">
                      업로드 중 오류가 발생했습니다.
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={handleClose}
                  disabled={uploadMutation.isLoading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploadedFiles.length === 0 || uploadMutation.isLoading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-500 border border-transparent rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {uploadMutation.isLoading ? '업로드 중...' : '업로드'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}; 