import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BOMEdit = () => {
  const { id } = useParams(); // Get the BOM entry ID from the URL
  const navigate = useNavigate();
  const baseUrl = 'https://api-assignment.inveesync.in';

  const [bomData, setBomData] = useState({
    item_id: '',
    component_id: '',
    quantity: 1,
    created_by: '',
    last_updated_by: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  // Fetch the existing BOM entry details
  const fetchBomData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/bom/`);
      if (response.status === 200) {  // Check for successful response
        const item = response.data.find(item => item.id == id); // Find item by ID
        if (item) {
          setBomData(item);  // Set the data if found
        } else {
          console.error(`Item with ID ${id} not found.`);
          setError(`Item with ID ${id} not found.`);
        }
      }
    } catch (err) {
      console.error('Error fetching BOM data:', err);
      setError('Error fetching BOM data');
    } finally {
      setLoading(false); // Always set loading to false
    }
  };

  fetchBomData();
}, [id, baseUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBomData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${baseUrl}/bom/${id}`, {
        ...bomData,
        updatedAt: new Date().toISOString(),
      });
      alert('BOM updated successfully!');
      navigate('/bom');
    } catch (err) {
      alert('Error updating BOM');
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit BOM Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Item ID</label>
          <input
            type="number"
            name="item_id"
            value={bomData.item_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Component ID</label>
          <input
            type="number"
            name="component_id"
            value={bomData.component_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={bomData.quantity}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="1"
            max="100"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Last Updated By</label>
          <input
            type="text"
            name="last_updated_by"
            value={bomData.last_updated_by}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={() => navigate('/bom')}
          className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default BOMEdit;