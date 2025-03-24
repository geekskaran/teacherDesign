import React from 'react';
import Layout from '../components/Layout';

const SettingsPage = () => {
  return (
    <Layout currentPage="Settings">
      <div className="flex items-center justify-center h-full">
        <h1 className="text-2xl font-bold text-gray-800">Hello Settings</h1>
      </div>
    </Layout>
  );
};

export default SettingsPage;