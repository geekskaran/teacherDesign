import React from 'react';
import Layout from '../components/Layout';

const ClassesPage = () => {
  return (
    <Layout currentPage="Classes">
      <div className="flex items-center justify-center h-full">
        <h1 className="text-2xl font-bold text-gray-800">Hello Classes</h1>
      </div>
    </Layout>
  );
};

export default ClassesPage;