import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, RotateCcw, Download, Delete, Eye, Calendar, HardDrive } from 'lucide-react';

export const TrashPage: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // 더미 삭제된 사진 데이터
  const dummyTrashPhotos = [
    { id: 1, name: 'IMG_001.jpg', size: '2.3 MB', deletedDate: '2024-01-15', originalDate: '2024-01-10', url: 'https://via.placeholder.com/300x200' },
    { id: 2, name: 'IMG_002.jpg', size: '1.8 MB', deletedDate: '2024-01-14', originalDate: '2024-01-09', url: 'https://via.placeholder.com/300x200' },
    { id: 3, name: 'IMG_003.jpg', size: '3.1 MB', deletedDate: '2024-01-13', originalDate: '2024-01-08', url: 'https://via.placeholder.com/300x200' },
    { id: 4, name: 'IMG_004.jpg', size: '2.7 MB', deletedDate: '2024-01-12', originalDate: '2024-01-07', url: 'https://via.placeholder.com/300x200' },
  ];

  const handleSelectItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === dummyTrashPhotos.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(dummyTrashPhotos.map(item => item.id));
    }
  };

  const handleRestore = () => {
    // 복원 로직
    setSelectedItems([]);
  };

  const handleDeletePermanently = () => {
    // 영구 삭제 로직
    setSelectedItems([]);
  };

  const totalSize = dummyTrashPhotos.reduce((acc, photo) => {
    const size = parseFloat(photo.size.split(' ')[0]);
    return acc + size;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="w-full">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-white/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">휴지통</h1>
              <p className="text-gray-600 text-sm">
                {dummyTrashPhotos.length}개 파일 • {totalSize.toFixed(1)} MB
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSelectAll}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:shadow-lg transition-all duration-200"
              >
                {selectedItems.length === dummyTrashPhotos.length ? '선택 해제' : '전체 선택'}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-6 py-4 bg-white/60 backdrop-blur-sm border-b border-white/50">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-white/50">
              <div className="flex items-center space-x-2">
                <Trash2 className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-gray-700">삭제된 파일</span>
              </div>
              <p className="text-lg font-bold text-gray-900 mt-1">{dummyTrashPhotos.length}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-white/50">
              <div className="flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">사용 공간</span>
              </div>
              <p className="text-lg font-bold text-gray-900 mt-1">{totalSize.toFixed(1)} MB</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-white/50">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">보관 기간</span>
              </div>
              <p className="text-lg font-bold text-gray-900 mt-1">30일</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {selectedItems.length > 0 && (
          <div className="px-6 py-3 bg-white/80 backdrop-blur-sm border-b border-white/50">
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRestore}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                <span>복원 ({selectedItems.length})</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeletePermanently}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-200"
              >
                <Delete className="w-4 h-4" />
                <span>영구 삭제 ({selectedItems.length})</span>
              </motion.button>
            </div>
          </div>
        )}

        {/* Trash Items */}
        <div className="p-6">
          <div className="space-y-3">
            {dummyTrashPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-200 cursor-pointer group ${
                  selectedItems.includes(photo.id) ? 'ring-2 ring-blue-500 bg-blue-50/80' : ''
                }`}
                onClick={() => handleSelectItem(photo.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{photo.name}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span>{photo.size}</span>
                      <span>•</span>
                      <span>삭제: {photo.deletedDate}</span>
                      <span>•</span>
                      <span>촬영: {photo.originalDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // 미리보기 로직
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // 다운로드 로직
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 