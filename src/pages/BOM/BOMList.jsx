import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/solid';

const BOMList = () => {
  const [bomData, setBomData] = useState([]);
  const [pendingJobs, setPendingJobs] = useState([]);
  const baseUrl = 'https://api-assignment.inveesync.in';
  const navigate = useNavigate();

  const fetchBoms = async () => {
    try {
      const response = await axios.get(`${baseUrl}/bom`);
      const completed = [];
      const pending = [];

      response.data.forEach((bom) => {
        if (bom.item_id && bom.component_id && bom.quantity) {
          completed.push(bom);
        } else {
          pending.push(bom);
        }
      });

      setBomData(completed);
      setPendingJobs(pending);
    } catch (error) {
      console.error('Error fetching BOM data:', error);
    }
  };

  const deleteBom = async (id) => {
    try {
      await axios.delete(`${baseUrl}/bom/${id}`);
      alert('BOM entry deleted successfully!');
      fetchBoms();
    } catch (error) {
      console.error('Error deleting BOM entry:', error);
    }
  };

  useEffect(() => {
    fetchBoms();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-semibold text-gray-800">Bill of Materials (BOM)</h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md"
          onClick={() => navigate('/bom/new')}
        >
          <PlusCircleIcon className="h-6 w-6 mr-2" />
          Add New BOM
        </button>
      </div>

      <div className="mb-10">
        <h3 className="text-2xl font-medium mb-4 text-gray-700">Completed BOMs</h3>
        <table className="w-full text-sm bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              {['Item ID', 'Component ID', 'Quantity', 'Created By', 'Last Updated By', 'Actions'].map((header) => (
                <th key={header} className="p-4 text-gray-600">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bomData.map((bom) => (
              <tr key={bom.id} className="hover:bg-gray-50 border-b">
                <td className="p-4">{bom.item_id}</td>
                <td className="p-4">{bom.component_id}</td>
                <td className="p-4">{bom.quantity}</td>
                <td className="p-4">{bom.created_by}</td>
                <td className="p-4">{bom.last_updated_by}</td>
                <td className="p-4 flex space-x-4">
                  <Link
                    to={`/bom/edit/${bom.id}`}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <PencilIcon className="h-5 w-5 mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteBom(bom.id)}
                    className="text-red-600 hover:text-red-800 flex items-center"
                  >
                    <TrashIcon className="h-5 w-5 mr-1" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-2xl font-medium mb-4 text-gray-700">Pending Jobs</h3>
        <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
          <ul className="list-disc pl-6 space-y-2">
            {pendingJobs.length > 0 ? (
              pendingJobs.map((job) => (
                <li key={job.id} className="text-gray-700">
                  Pending for Item ID: <span className="font-medium">{job.item_id || 'N/A'}</span>, Component ID:{' '}
                  <span className="font-medium">{job.component_id || 'N/A'}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-600">No pending jobs available.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BOMList;