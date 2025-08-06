import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Search, 
  Eye, 
  Heart, 
  Trash2, 
  Settings,
  Camera,
  BarChart3,
  Sparkles,
  HardDrive
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api.ts';
import { StatsSummary } from '../types/index.ts';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.tsx';
import { PhotoUpload } from '../components/photos/PhotoUpload.tsx';
import { Layout } from '../components/layout/Layout.tsx';

export const DashboardPage: React.FC = () => {
  const [showUpload, setShowUpload] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useQuery<StatsSummary>(
    'stats',
    api.getStats,
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  // Mutations
  const findDuplicatesMutation = useMutation(api.findDuplicates, {
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries('stats');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || '중복 사진 검색에 실패했습니다.');
    },
  });

  const findBlurryMutation = useMutation(api.findBlurryPhotos, {
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries('stats');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || '흐릿한 사진 검색에 실패했습니다.');
    },
  });

  const findScreenshotsMutation = useMutation(api.findScreenshots, {
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries('stats');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || '스크린샷 검색에 실패했습니다.');
    },
  });

  const handleFindDuplicates = () => {
    findDuplicatesMutation.mutate();
  };

  const handleFindBlurry = () => {
    findBlurryMutation.mutate();
  };

  const handleFindScreenshots = () => {
    findScreenshotsMutation.mutate();
  };

  const formatStorage = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getStorageColor = (percentage: number) => {
    if (percentage < 70) return 'text-success-500';
    if (percentage < 90) return 'text-yellow-500';
    return 'text-danger-500';
  };

  const quickActions = [
    {
      title: '사진 업로드',
      description: '새로운 사진을 업로드하세요',
      icon: Upload,
      color: 'bg-primary-500',
      onClick: () => setShowUpload(true),
    },
    {
      title: '전체 사진',
      description: '모든 사진을 확인하세요',
      icon: Camera,
      color: 'bg-blue-500',
      onClick: () => navigate('/photos'),
    },
    {
      title: '스와이프 정리',
      description: '직관적으로 사진을 정리하세요',
      icon: Sparkles,
      color: 'bg-purple-500',
      onClick: () => navigate('/tinder'),
    },
    {
      title: '휴지통',
      description: '삭제된 사진을 관리하세요',
      icon: Trash2,
      color: 'bg-gray-500',
      onClick: () => navigate('/trash'),
    },
  ];

  const analysisActions = [
    {
      title: '중복 사진 찾기',
      description: '동일한 사진들을 찾아보세요',
      icon: Search,
      color: 'bg-orange-500',
      onClick: handleFindDuplicates,
      loading: findDuplicatesMutation.isLoading,
    },
    {
      title: '흐릿한 사진 찾기',
      description: '품질이 낮은 사진들을 찾아보세요',
      icon: Eye,
      color: 'bg-yellow-500',
      onClick: handleFindBlurry,
      loading: findBlurryMutation.isLoading,
    },
    {
      title: '스크린샷 찾기',
      description: '스크린샷들을 분류해보세요',
      icon: BarChart3,
      color: 'bg-green-500',
      onClick: handleFindScreenshots,
      loading: findScreenshotsMutation.isLoading,
    },
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
            <p className="text-gray-600 mt-1">사진 현황과 주요 기능에 빠르게 접근하세요</p>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Settings className="w-6 h-6" />
          </button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <LoadingSpinner size="md" />
              </div>
            ))
          ) : (
            <>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">전체 사진</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalPhotos || 0}</p>
                  </div>
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <Camera className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">중복 사진</p>
                    <p className="text-2xl font-bold text-orange-600">{stats?.duplicatePhotos || 0}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Search className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">흐릿한 사진</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats?.blurryPhotos || 0}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Eye className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">저장 공간</p>
                    <p className={`text-2xl font-bold ${getStorageColor(stats?.storagePercentage || 0)}`}>
                      {formatStorage(stats?.storageUsed || 0)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {stats?.storagePercentage.toFixed(1)}% 사용됨
                    </p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <HardDrive className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">빠른 액션</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={action.onClick}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 text-left group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Analysis Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">분석 도구</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysisActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={action.onClick}
                disabled={action.loading}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 text-left group disabled:opacity-50"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {action.loading ? (
                    <LoadingSpinner size="sm" color="white" />
                  ) : (
                    <action.icon className="w-6 h-6 text-white" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">최근 활동</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">즐겨찾기 사진</p>
                <p className="text-xs text-gray-500">{stats?.favoritePhotos || 0}개</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">스크린샷</p>
                <p className="text-xs text-gray-500">{stats?.screenshotPhotos || 0}개</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <PhotoUpload
          isOpen={showUpload}
          onClose={() => setShowUpload(false)}
          onSuccess={() => {
            setShowUpload(false);
            queryClient.invalidateQueries('stats');
          }}
        />
      )}
    </Layout>
  );
}; 