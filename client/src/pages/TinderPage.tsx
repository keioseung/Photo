import React from 'react';
import { Layout } from '../components/layout/Layout.tsx';

export const TinderPage: React.FC = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">스와이프 정리</h1>
        <p className="text-gray-600">스와이프 정리 기능이 곧 추가됩니다.</p>
      </div>
    </Layout>
  );
}; 