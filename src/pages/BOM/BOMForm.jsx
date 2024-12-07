import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const BOMForm = () => {
  const { id } = useParams(); // For editing a specific BOM
  const [formData, setFormData] = useState({
    item_id: '',
    component_id: '',
    quantity: '',
    created_by: '',
    last_updated_by: '',
  });
  const navigate = useNavigate();
  const baseUrl = 'https://api-assignment.inveesync.in';

  useEffect(() => {
    if (id) {
      fetchBom();
    }
  }, [id]);

  const fetchBom = async () => {
    try {
      const response = await axios.get(`${baseUrl}/bom`);
      const bom = response.data.find((bom) => bom.id === parseInt(id));
      setFormData(bom);
    } catch (error) {
      console.error('Error fetching BOM:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      if (id) {
        await axios.put(`${baseUrl}/bom/${id}`, formData);
        alert('BOM updated successfully!');
      } else {
        await axios.post(`${baseUrl}/bom`, formData);
        alert('BOM created successfully!');
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving BOM:', error);
    }
  };

  const validateForm = () => {
    const { item_id, component_id, quantity } = formData;
    if (!item_id || !component_id) {
      return 'Item ID and Component ID are mandatory.';
    }
    if (item_id === component_id) {
      return 'Item ID and Component ID must be unique.';
    }
    if (quantity < 1 || quantity > 100) {
      return 'Quantity must be between 1 and 100.';
    }
    return null;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{id ? 'Edit BOM' : 'Create BOM'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Item ID</label>
          <input
            type="number"
            name="item_id"
            value={formData.item_id}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700">Component ID</label>
          <input
            type="number"
            name="component_id"
            value={formData.component_id}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700">Created By</label>
          <input
            type="text"
            name="created_by"
            value={formData.created_by}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700">Last Updated By</label>
          <input
            type="text"
            name="last_updated_by"
            value={formData.last_updated_by}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">
          {id ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default BOMForm;