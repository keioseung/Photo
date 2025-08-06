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
  HardDrive,
  Plus,
  ArrowRight,
  TrendingUp,
  Shield,
  Zap
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
    if (percentage < 70) return 'text-emerald-500';
    if (percentage < 90) return 'text-amber-500';
    return 'text-red-500';
  };

  const getStorageBgColor = (percentage: number) => {
    if (percentage < 70) return 'bg-emerald-500';
    if (percentage < 90) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const quickActions = [
    {
      title: '사진 업로드',
      description: '새로운 사진을 업로드하세요',
      icon: Upload,
      gradient: 'from-blue-500 to-blue-600',
      onClick: () => setShowUpload(true),
    },
    {
      title: '전체 사진',
      description: '모든 사진을 확인하세요',
      icon: Camera,
      gradient: 'from-purple-500 to-purple-600',
      onClick: () => navigate('/photos'),
    },
    {
      title: '스와이프 정리',
      description: '직관적으로 사진을 정리하세요',
      icon: Sparkles,
      gradient: 'from-pink-500 to-pink-600',
      onClick: () => navigate('/tinder'),
    },
    {
      title: '휴지통',
      description: '삭제된 사진을 관리하세요',
      icon: Trash2,
      gradient: 'from-gray-500 to-gray-600',
      onClick: () => navigate('/trash'),
    },
  ];

  const analysisActions = [
    {
      title: '중복 사진 찾기',
      description: '동일한 사진들을 찾아보세요',
      icon: Search,
      gradient: 'from-orange-500 to-orange-600',
      onClick: handleFindDuplicates,
      loading: findDuplicatesMutation.isLoading,
    },
    {
      title: '흐릿한 사진 찾기',
      description: '품질이 낮은 사진들을 찾아보세요',
      icon: Eye,
      gradient: 'from-amber-500 to-amber-600',
      onClick: handleFindBlurry,
      loading: findBlurryMutation.isLoading,
    },
    {
      title: '스크린샷 찾기',
      description: '스크린샷들을 분류해보세요',
      icon: BarChart3,
      gradient: 'from-emerald-500 to-emerald-600',
      onClick: handleFindScreenshots,
      loading: findScreenshotsMutation.isLoading,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Layout>
        <div className="w-full">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-8 md:py-12"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Cleanup Pro
                </h1>
                <p className="text-blue-100 text-sm md:text-base">
                  스마트한 사진 정리 & 관리
                </p>
              </div>
              <button
                onClick={() => navigate('/settings')}
                className="p-2 text-white/80 hover:text-white transition-colors"
              >
                <Settings className="w-6 h-6" />
              </button>
            </div>
            
            {/* Upload Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowUpload(true)}
              className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-4 flex items-center justify-center space-x-3 text-white hover:bg-white/30 transition-all duration-200"
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold">사진 업로드</p>
                <p className="text-sm text-blue-100">새로운 사진을 추가하세요</p>
              </div>
              <ArrowRight className="w-5 h-5 ml-auto" />
            </motion.button>
          </div>
        </motion.div>

        <div className="px-6 py-6 space-y-6">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {statsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <LoadingSpinner size="sm" />
                </div>
              ))
            ) : (
              <>
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Camera className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">전체 사진</p>
                      <p className="text-lg font-bold text-gray-900">{stats?.totalPhotos || 0}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -2 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Search className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">중복 사진</p>
                      <p className="text-lg font-bold text-orange-600">{stats?.duplicatePhotos || 0}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -2 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Eye className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">흐릿한 사진</p>
                      <p className="text-lg font-bold text-amber-600">{stats?.blurryPhotos || 0}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -2 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <HardDrive className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">저장 공간</p>
                      <p className={`text-lg font-bold ${getStorageColor(stats?.storagePercentage || 0)}`}>
                        {formatStorage(stats?.storageUsed || 0)}
                      </p>
                    </div>
                  </div>
                  {/* Storage Progress Bar */}
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${getStorageBgColor(stats?.storagePercentage || 0)}`}
                      style={{ width: `${Math.min(stats?.storagePercentage || 0, 100)}%` }}
                    ></div>
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">빠른 액션</h2>
              <Zap className="w-5 h-5 text-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.onClick}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 text-left group hover:shadow-xl transition-all duration-200"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{action.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{action.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Analysis Tools */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">분석 도구</h2>
              <Shield className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="space-y-3">
              {analysisActions.map((action, index) => (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.onClick}
                  disabled={action.loading}
                  className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 text-left group hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {action.loading ? (
                        <LoadingSpinner size="sm" color="white" />
                      ) : (
                        <action.icon className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">최근 활동</h2>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">즐겨찾기 사진</p>
                  <p className="text-xs text-gray-600">{stats?.favoritePhotos || 0}개</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-600 font-medium">+12%</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">스크린샷</p>
                  <p className="text-xs text-gray-600">{stats?.screenshotPhotos || 0}개</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-emerald-600 font-medium">+8%</p>
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
      </div>
      </Layout>
    </div>
  );
}; 