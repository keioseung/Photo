import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Grid, List, Search, Filter, Plus, Image as ImageIcon } from 'lucide-react';
import { PhotoUpload } from '../components/photos/PhotoUpload.tsx';

export const PhotosPage: React.FC = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 더미 사진 데이터
  const dummyPhotos = [
    { id: 1, name: 'IMG_001.jpg', size: '2.3 MB', date: '2024-01-15', url: 'https://via.placeholder.com/300x200' },
    { id: 2, name: 'IMG_002.jpg', size: '1.8 MB', date: '2024-01-14', url: 'https://via.placeholder.com/300x200' },
    { id: 3, name: 'IMG_003.jpg', size: '3.1 MB', date: '2024-01-13', url: 'https://via.placeholder.com/300x200' },
    { id: 4, name: 'IMG_004.jpg', size: '2.7 MB', date: '2024-01-12', url: 'https://via.placeholder.com/300x200' },
    { id: 5, name: 'IMG_005.jpg', size: '1.5 MB', date: '2024-01-11', url: 'https://via.placeholder.com/300x200' },
    { id: 6, name: 'IMG_006.jpg', size: '2.9 MB', date: '2024-01-10', url: 'https://via.placeholder.com/300x200' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="w-full">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-white/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">전체 사진</h1>
              <p className="text-gray-600 text-sm">총 {dummyPhotos.length}개의 사진</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUpload(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>업로드</span>
            </motion.button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 bg-white/60 backdrop-blur-sm border-b border-white/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="사진 검색..."
                  className="pl-10 pr-4 py-2 bg-white/80 rounded-xl border border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 bg-white/80 rounded-xl border border-white/50 hover:bg-white transition-colors">
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 rounded-xl p-1 border border-white/50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Photo Grid/List */}
        <div className="p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {dummyPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-200 cursor-pointer group"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{photo.name}</p>
                    <p className="text-xs text-gray-500">{photo.size}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {dummyPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-200 cursor-pointer group"
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
                      <p className="text-sm text-gray-500">{photo.size} • {photo.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <ImageIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <PhotoUpload
            isOpen={showUpload}
            onClose={() => setShowUpload(false)}
            onSuccess={() => {
              setShowUpload(false);
              // 여기서 사진 목록을 새로고침할 수 있습니다
            }}
          />
        )}
      </div>
    </div>
  );
}; 