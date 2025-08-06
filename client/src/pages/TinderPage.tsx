import React, { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Heart, X, RotateCcw, Download, Trash2, Check } from 'lucide-react';

export const TinderPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  // 더미 사진 데이터
  const dummyPhotos = [
    { id: 1, name: 'IMG_001.jpg', url: 'https://via.placeholder.com/400x600', isDuplicate: false, isBlurry: false },
    { id: 2, name: 'IMG_002.jpg', url: 'https://via.placeholder.com/400x600', isDuplicate: true, isBlurry: false },
    { id: 3, name: 'IMG_003.jpg', url: 'https://via.placeholder.com/400x600', isDuplicate: false, isBlurry: true },
    { id: 4, name: 'IMG_004.jpg', url: 'https://via.placeholder.com/400x600', isDuplicate: false, isBlurry: false },
    { id: 5, name: 'IMG_005.jpg', url: 'https://via.placeholder.com/400x600', isDuplicate: true, isBlurry: false },
  ];

  const handleSwipe = (direction: 'left' | 'right') => {
    setDirection(direction);
    setTimeout(() => {
      setCurrentIndex(prev => Math.min(prev + 1, dummyPhotos.length - 1));
      setDirection(null);
    }, 300);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 100;
    if (info.offset.x > swipeThreshold) {
      handleSwipe('right');
    } else if (info.offset.x < -swipeThreshold) {
      handleSwipe('left');
    }
  };

  const currentPhoto = dummyPhotos[currentIndex];

  if (currentIndex >= dummyPhotos.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-12 h-12 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">정리 완료!</h2>
          <p className="text-gray-600 mb-6">모든 사진을 검토했습니다.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentIndex(0)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 mx-auto hover:shadow-lg transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>다시 시작</span>
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="w-full">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-white/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">스와이프 정리</h1>
              <p className="text-gray-600 text-sm">
                {currentIndex + 1} / {dummyPhotos.length} • {currentPhoto.name}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-white/80 rounded-xl border border-white/50 hover:bg-white transition-colors">
                <RotateCcw className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-2 bg-white/60 backdrop-blur-sm border-b border-white/50">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / dummyPhotos.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Photo Card */}
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            key={currentPhoto.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: direction ? 0.8 : 1, 
              opacity: direction ? 0 : 1,
              x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
              rotate: direction === 'left' ? -15 : direction === 'right' ? 15 : 0
            }}
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="relative w-full max-w-sm cursor-grab active:cursor-grabbing"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              {/* Photo */}
              <div className="relative aspect-[3/4] bg-gray-100">
                <img
                  src={currentPhoto.url}
                  alt={currentPhoto.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay Info */}
                <div className="absolute top-4 left-4 right-4">
                  <div className="flex items-center space-x-2">
                    {currentPhoto.isDuplicate && (
                      <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        중복
                      </span>
                    )}
                    {currentPhoto.isBlurry && (
                      <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        흐림
                      </span>
                    )}
                  </div>
                </div>

                {/* Swipe Indicators */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-red-500 text-white px-3 py-2 rounded-full text-sm font-medium"
                    >
                      삭제
                    </motion.div>
                  </div>
                  <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-green-500 text-white px-3 py-2 rounded-full text-sm font-medium"
                    >
                      보관
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Photo Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{currentPhoto.name}</h3>
                <p className="text-sm text-gray-600">2.3 MB • 2024-01-15</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-6 bg-white/80 backdrop-blur-sm border-t border-white/50">
          <div className="flex items-center justify-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSwipe('left')}
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <X className="w-8 h-8 text-white" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSwipe('right')}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Heart className="w-8 h-8 text-white" />
            </motion.button>
          </div>

          <div className="flex items-center justify-center space-x-8 mt-6">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors">
              <Download className="w-4 h-4" />
              <span className="text-sm">다운로드</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors">
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">휴지통으로</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 