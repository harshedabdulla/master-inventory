import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchItems = async () => {
    try {
      const response = await axios.get('https://api-assignment.inveesync.in/items');
      setItems(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch items.');
      setLoading(false);
      toast.error('Error fetching items!');
    }
  };

  const deleteItem = async (id) => {
    setIsDeleting(true);
    try {
      await axios.delete(`https://api-assignment.inveesync.in/items/${id}`);
      setItems(items.filter(item => item.id !== id));
      toast.success('Item deleted successfully!');
      setDeleteId(null);
    } catch (error) {
      setError('Failed to delete item.');
      toast.error('Error deleting item!');
    }
    setIsDeleting(false);
  };

  const handleDeleteConfirm = (id) => {
    setDeleteId(id);
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl text-gray-600 font-semibold mb-6">Items List</h2>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Item Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Type</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">UoM</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Max Buffer</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Min Buffer</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-800">{item.internal_item_name}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{item.type}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{item.uom}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{item.max_buffer}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{item.min_buffer}</td>
                <td className="px-4 py-2 text-sm text-blue-600 space-x-2">
                  <Link to={`/items/${item.id}`} className="hover:text-blue-800">Edit</Link> | 
                  <button onClick={() => handleDeleteConfirm(item.id)} className="text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <p className="text-gray-700 mb-4">Are you sure you want to delete this item?</p>
            <div className="flex justify-between">
              <button 
                onClick={() => deleteItem(deleteId)} 
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes'}
              </button>
              <button 
                onClick={handleCancelDelete} 
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemsList;