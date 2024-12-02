import React from 'react';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dashboard Cards */}
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Total Items</h3>
          <p className="text-3xl font-bold text-blue-600">250</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Total BOM</h3>
          <p className="text-3xl font-bold text-blue-600">15</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">10</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;