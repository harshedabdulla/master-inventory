import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadType, setUploadType] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [error, setError] = useState(null);

  const baseUrl = 'https://api-assignment.inveesync.in';

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFile(selectedFile);
      setError(null);
      setValidationErrors([]); // Clear previous errors
    } else {
      setError('Please upload a valid XLSX file');
    }
  };

  // Parse the XLSX file and prepare data
  const parseFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(sheet);
          resolve(rows);
        } catch (err) {
          reject('Error reading file');
        }
      };
      reader.onerror = () => reject('Error reading file');
      reader.readAsBinaryString(file);
    });
  };

  // Validate BOM data
  const validateBOMData = (bomData, existingItems) => {
    const errors = [];
    const validData = [];

    bomData.forEach((row, index) => {
      const { item_id, component_id, quantity } = row;
      const rowErrors = [];
      const item = existingItems.find((item) => item.id === item_id);

      if (item?.type === 'sell' && component_id) rowErrors.push('Sell item cannot be a component in BOM');
      if (item?.type === 'purchase') rowErrors.push('Purchase item cannot be item_id in BOM');
      if (bomData.some((r, i) => i !== index && r.item_id === item_id && r.component_id === component_id))
        rowErrors.push('Item ID + Component ID should be unique');
      if (quantity < 1 || quantity > 100) rowErrors.push('Quantity should be between 1 to 100');
      if (!existingItems.some((item) => item.id === item_id)) rowErrors.push('Item ID does not exist in the Item Master');

      if (rowErrors.length) {
        errors.push({ row: index + 1, errors: rowErrors });
      } else {
        validData.push(row);
      }
    });

    return { validData, errors };
  };

  // Validate Item data
  const validateItemData = (itemData) => {
    const errors = [];
    const validData = [];

    itemData.forEach((row, index) => {
      const rowErrors = [];
      const { internal_item_name, tenant_id, type, uom, max_buffer, min_buffer, avg_weight_needed, scrap_type } = row;

      if (!internal_item_name) rowErrors.push('Missing internal_item_name');
      if (!tenant_id) rowErrors.push('Missing tenant_id');
      if (!['sell', 'purchase', 'component'].includes(type)) rowErrors.push('Invalid type value');
      if (!['kgs', 'nos'].includes(uom)) rowErrors.push('Invalid UoM value');
      if (type === 'sell' && !scrap_type) rowErrors.push('Missing scrap_type for sell item');
      if (max_buffer < min_buffer) rowErrors.push('max_buffer less than min_buffer');
      if (typeof avg_weight_needed !== 'boolean') rowErrors.push('avg_weight_needed not boolean');
      if (typeof max_buffer !== 'number' || typeof min_buffer !== 'number') rowErrors.push('Buffer values must be numbers');

      if (rowErrors.length) {
        errors.push({ row: index + 1, errors: rowErrors });
      } else {
        validData.push(row);
      }
    });

    return { validData, errors };
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file || !uploadType) {
      toast.error('Please select a file and upload type');
      return;
    }

    setLoading(true);
    setValidationErrors([]);

    try {
      const parsedData = await parseFile(file);

      if (uploadType === 'bom') {
        const itemsResponse = await axios.get(`${baseUrl}/items`);
        const { validData, errors } = validateBOMData(parsedData, itemsResponse.data);

        if (errors.length) {
          setValidationErrors(errors);
          toast.error('Validation errors found for BOM.');
          setLoading(false);
          return;
        }

        for (const row of validData) {
          await axios.post(`${baseUrl}/bom`, row);
        }
      } else if (uploadType === 'items') {
        const { validData, errors } = validateItemData(parsedData);

        if (errors.length) {
          setValidationErrors(errors);
          toast.error('Validation errors found for Items.');
          setLoading(false);
          return;
        }

        for (const row of validData) {
          await axios.post(`${baseUrl}/items`, row);
        }
      }

      toast.success(`${uploadType.toUpperCase()} entries uploaded successfully`);
      setFile(null);
      setUploadType('');
    } catch (err) {
      console.error(err);
      toast.error(`Error uploading ${uploadType.toUpperCase()} entries`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Upload Data</h2>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex flex-col space-y-4">
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="p-3 border border-gray-300 rounded-lg"
        />

        <div className="flex space-x-4">
          <button
            onClick={() => setUploadType('bom')}
            className={`px-4 py-2 rounded-lg ${uploadType === 'bom' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Upload BOM
          </button>
          <button
            onClick={() => setUploadType('items')}
            className={`px-4 py-2 rounded-lg ${uploadType === 'items' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Upload Items
          </button>
        </div>

        <button
          onClick={handleUpload}
          className="px-6 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50"
          disabled={loading || !file || !uploadType}
        >
          {loading ? 'Uploading...' : `Upload ${uploadType.toUpperCase()} Data`}
        </button>
      </div>

      {validationErrors.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-red-500">Validation Errors</h3>
          <table className="min-w-full mt-4 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Row</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Errors</th>
              </tr>
            </thead>
            <tbody>
              {validationErrors.map((error, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{error.row}</td>
                  <td className="border border-gray-300 px-4 py-2">{error.errors.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Upload;