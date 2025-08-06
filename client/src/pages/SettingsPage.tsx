import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Download, 
  Trash2, 
  Eye,
  EyeOff,
  Save,
  Camera,
  HardDrive,
  Globe
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const settingsSections = [
    {
      title: '계정 설정',
      icon: User,
      items: [
        {
          label: '이름',
          type: 'text',
          value: '테스트 사용자',
          placeholder: '이름을 입력하세요'
        },
        {
          label: '이메일',
          type: 'email',
          value: 'test@example.com',
          placeholder: '이메일을 입력하세요'
        },
        {
          label: '비밀번호',
          type: 'password',
          value: '••••••••',
          placeholder: '새 비밀번호를 입력하세요'
        }
      ]
    },
    {
      title: '앱 설정',
      icon: Settings,
      items: [
        {
          label: '다크 모드',
          type: 'toggle',
          value: darkMode,
          onChange: setDarkMode
        },
        {
          label: '알림',
          type: 'toggle',
          value: notifications,
          onChange: setNotifications
        },
        {
          label: '자동 백업',
          type: 'toggle',
          value: autoBackup,
          onChange: setAutoBackup
        }
      ]
    }
  ];

  const stats = [
    { label: '총 사진 수', value: '1,234', icon: Camera, color: 'text-blue-500' },
    { label: '저장 공간', value: '2.3 GB', icon: HardDrive, color: 'text-green-500' },
    { label: '언어', value: '한국어', icon: Globe, color: 'text-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="w-full">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-white/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">설정</h1>
              <p className="text-gray-600 text-sm">앱 설정을 관리하세요</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-200"
            >
              <Save className="w-4 h-4" />
              <span>저장</span>
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-6 py-4 bg-white/60 backdrop-blur-sm border-b border-white/50">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-white/50"
              >
                <div className="flex items-center space-x-2">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                </div>
                <p className="text-lg font-bold text-gray-900 mt-1">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Settings Sections */}
        <div className="p-6 space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
              </div>

              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <label className="text-sm font-medium text-gray-700">{item.label}</label>
                    
                    {item.type === 'toggle' ? (
                      <button
                        onClick={() => item.onChange?.(!item.value)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          item.value ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            item.value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    ) : item.type === 'password' ? (
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          defaultValue={item.value}
                          placeholder={item.placeholder}
                          className="pl-3 pr-10 py-2 bg-white/80 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    ) : (
                      <input
                        type={item.type}
                        defaultValue={item.value}
                        placeholder={item.placeholder}
                        className="px-3 py-2 bg-white/80 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Download className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">빠른 액션</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl flex items-center space-x-3 hover:shadow-lg transition-all duration-200"
              >
                <Download className="w-5 h-5" />
                <span className="text-sm font-medium">데이터 내보내기</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl flex items-center space-x-3 hover:shadow-lg transition-all duration-200"
              >
                <Trash2 className="w-5 h-5" />
                <span className="text-sm font-medium">계정 삭제</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 