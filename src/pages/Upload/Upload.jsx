import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadType, setUploadType] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [error, setError] = useState(null);

  const baseUrl = 'https://api-assignment.inveesync.in'; // Replace with your backend URL

  // Handle file selection
  const handleFileChange = (e) => {
    console.log("File selected:", e.target.files[0]);
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFile(selectedFile);
      setError(null);
      setValidationErrors([]); // Clear previous errors
    } else {
      setError('Please upload a valid XLSX file');
      console.error("Invalid file type:", selectedFile?.type);
    }
  };

  // Parse the XLSX file and prepare data
  const parseFile = (file) => {
    return new Promise((resolve, reject) => {
      console.log("Parsing file:", file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(sheet);
          console.log("Parsed data:", rows);
          resolve(rows);
        } catch (err) {
          console.error("Error reading file:", err);
          reject('Error reading file');
        }
      };
      reader.onerror = () => {
        console.error("File reader error:", reader.error);
        reject('Error reading file');
      };
      reader.readAsBinaryString(file);
    });
  };

  const transformBOMData = (row) => {
  return {
    item_id: Number(row.item_id), // Ensure it is a number
    component_id: Number(row.component_id), // Ensure it is a number
    quantity: Number(row.quantity), // Ensure it is a number
    created_by: row.created_by || "system_user",
    last_updated_by: row.last_updated_by || "system_user",
    createdAt: new Date().toISOString(), // Use current timestamp if not provided
    updatedAt: new Date().toISOString()  // Use current timestamp if not provided
  };
};

  // Validate BOM data
  const validateBOMData = (bomData, existingItems) => {
    console.log("Validating BOM data:", bomData);
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
      //if (!existingItems.some((item) => item.id === item_id)) rowErrors.push('Item ID does not exist in the Item Master');

      if (rowErrors.length) {
        errors.push({ row: index + 1, errors: rowErrors });
      } else {
        validData.push(row);
      }
    });

    console.log("Validation complete. Errors:", errors, "Valid data:", validData);
    return { validData, errors };
  };

  // Validate Item data
  const validateItemData = (itemData) => {
    console.log("Validating Item data:", itemData);
    const errors = [];
    const validData = [];

    itemData.forEach((row, index) => {
      const rowErrors = [];
      const { internal_item_name, tenant_id, type, uom, max_buffer, min_buffer } = row;

      if (!internal_item_name) rowErrors.push('Missing internal_item_name');
      if (!tenant_id) rowErrors.push('Missing tenant_id');
      if (!['sell', 'purchase', 'component'].includes(type)) rowErrors.push('Invalid type value');
      if (!['kgs', 'nos'].includes(uom)) rowErrors.push('Invalid UoM value');
      const maxBufferNum = Number(max_buffer);
      const minBufferNum = Number(min_buffer);
      if (maxBufferNum < minBufferNum) rowErrors.push('max_buffer less than min_buffer');
      if (isNaN(maxBufferNum) || isNaN(minBufferNum)) rowErrors.push('Buffer values must be numbers');

      if (rowErrors.length) {
        errors.push({ row: index + 1, errors: rowErrors });
      } else {
        validData.push(row);
      }
    });

    console.log("Validation complete. Errors:", errors, "Valid data:", validData);
    return { validData, errors };
  };

const handleUpload = async () => {
  if (!file || !uploadType) {
    toast.error('Please select a file and upload type');
    return;
  }

  setLoading(true);
  setValidationErrors([]);

  try {
    const parsedData = await parseFile(file);

    if (uploadType === 'items') {
      const { validData, errors } = validateItemData(parsedData);

      if (errors.length) {
        setValidationErrors(errors);
        toast.error('Validation errors found for Items.');
        return;
      }

      for (const row of validData) {
        // Transform data to match API requirements
        const formattedRow = {
          internal_item_name: row.internal_item_name,
          tenant_id: Number(row.tenant_id),
          item_description: row.item_description || '',
          uom: row.uom,
          type: row.type,
          max_buffer: Number(row.max_buffer),
          min_buffer: Number(row.min_buffer),
          customer_item_name: row.customer_item_name || '',
          is_deleted: row.is_deleted === 'true' || false,
          created_by: 'system_user',
          last_updated_by: 'system_user',
          createdAt: row.createdAt || new Date().toISOString(),
          updatedAt: row.updatedAt || new Date().toISOString(),
          additional_attributes: {
            drawing_revision_number: Number(row.additional_attributes__drawing_revision_number || 0),
            drawing_revision_date: row.additional_attributes__drawing_revision_date || '',
            avg_weight_needed: row.additional_attributes__avg_weight_needed === 'true',
            scrap_type: row.additional_attributes__scrap_type || '',
            shelf_floor_alternate_name: row.additional_attributes__shelf_floor_alternate_name || '',
          },
        };

        console.log('Posting Item row:', formattedRow);

        await axios.post(`${baseUrl}/items`, formattedRow);
      }
    } else if (uploadType === 'bom') {
      const itemsResponse = await axios.get(`${baseUrl}/items`);
      const { validData, errors } = validateBOMData(parsedData, itemsResponse.data);

      if (errors.length) {
        setValidationErrors(errors);
        toast.error('Validation errors found for BOM.');
        return;
      }

      for (const row of validData) {
        // const formattedRow = {
        //   item_id: Number(row.item_id),
        //   component_id: Number(row.component_id),
        //   quantity: Number(row.quantity),
        //   created_by: 'system_user',
        //   last_updated_by: 'system_user',
        //   createdAt: row.createdAt || new Date().toISOString(),
        //   updatedAt: row.updatedAt || new Date().toISOString(),
        // };
        const requestData = transformBOMData(row);

        console.log('Posting BOM row:', requestData);

        await axios.post(`${baseUrl}/bom`, requestData);
      }
    }

    toast.success(`${uploadType.toUpperCase()} entries uploaded successfully`);
  } catch (err) {
    console.error('Error during upload:', err);
    toast.error('Error uploading data');
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