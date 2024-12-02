import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // State to manage form data
  const [itemData, setItemData] = useState({
    internal_item_name: '',
    tenant_id: 123,
    item_description: '',
    uom: 'Kgs',
    created_by: 'user3',
    last_updated_by: 'user4',
    type: 'purchase',
    max_buffer: 20,
    min_buffer: 10,
    customer_item_name: '',
    is_deleted: false,
    createdAt: '2023-04-15T09:00:00Z',
    updatedAt: '2023-04-20T11:30:00Z',
    additional_attributes: {
      drawing_revision_number: 3,
      drawing_revision_date: '2023-04-10',
      avg_weight_needed: true,
      scrap_type: 'scrap_b',
      shelf_floor_alternate_name: 'shelf_3',
    },
  });

  // Fetch item data when component mounts
  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await axios.get('https://api-assignment.inveesync.in/items/');
        if (response.status === 200) {
          // Find the item with the specific ID dynamically
          const item = response.data.find(item => item.id == id);
          if (item) {
            setItemData(item);
          } else {
            console.error(`Item with ID ${id} not found`);
          }
        }
      } catch (error) {
        console.error('Error fetching item data:', error);
        alert('An unexpected error occurred.');
      }
    };

    fetchItemData();
  }, [id]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle the form submission to update the item
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://api-assignment.inveesync.in/items/${id}`, itemData);
      alert('Item updated successfully');
      navigate('/items'); // Redirect to items list page after successful update
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg ">
      <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">Edit Item</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600" htmlFor="internal_item_name">
            Internal Item Name
          </label>
          <input
            type="text"
            name="internal_item_name"
            id="internal_item_name"
            value={itemData.internal_item_name}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600" htmlFor="item_description">
            Item Description
          </label>
          <input
            type="text"
            name="item_description"
            id="item_description"
            value={itemData.item_description}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600" htmlFor="uom">
            UoM
          </label>
          <select
            name="uom"
            id="uom"
            value={itemData.uom}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Kgs">Kgs</option>
            <option value="Nos">Nos</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600" htmlFor="max_buffer">
            Max Buffer
          </label>
          <input
            type="number"
            name="max_buffer"
            id="max_buffer"
            value={itemData.max_buffer}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600" htmlFor="min_buffer">
            Min Buffer
          </label>
          <input
            type="number"
            name="min_buffer"
            id="min_buffer"
            value={itemData.min_buffer}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600" htmlFor="customer_item_name">
            Customer Item Name
          </label>
          <input
            type="text"
            name="customer_item_name"
            id="customer_item_name"
            value={itemData.customer_item_name}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-center mb-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditForm;