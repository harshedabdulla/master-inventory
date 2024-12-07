import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UsersIcon, ClipboardListIcon, CubeIcon } from '@heroicons/react/solid';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [counts, setCounts] = useState({
    totalItems: 0,
    totalBom: 0,
    totalUsers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = 'https://api-assignment.inveesync.in';

  const fetchCounts = async () => {
    try {
      const [itemsResponse, bomResponse, usersResponse] = await Promise.all([
        axios.get(`${baseUrl}/items`),
        axios.get(`${baseUrl}/bom`),
      ]);

      setCounts({
        totalItems: itemsResponse.data.length,
        totalBom: bomResponse.data.length,
      });

      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard data.');
      toast.error('Error fetching dashboard counts!');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const cardsData = [
    { title: 'Total Items', count: counts.totalItems, icon: CubeIcon, color: 'text-blue-500' },
    { title: 'Total BOM', count: counts.totalBom, icon: ClipboardListIcon, color: 'text-green-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardsData.map((card, index) => (
          <div
            key={index}
            className="flex items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
          >
            <div className={`p-4 rounded-full bg-gray-100 ${card.color} mr-4`}>
              <card.icon className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-1">{card.title}</h3>
              <p className="text-3xl font-bold">{card.count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;