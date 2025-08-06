import React from 'react';
import { Layout } from '../components/layout/Layout.tsx';

export const TrashPage: React.FC = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">휴지통</h1>
        <p className="text-gray-600">휴지통 기능이 곧 추가됩니다.</p>
      </div>
    </Layout>
  );
}; 