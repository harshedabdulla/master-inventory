import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-100 p-3">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-500">Inventory System</h1>
        <div className="space-x-6 hidden md:flex">
          <Link to="/" className="text-gray-500 hover:text-gray-700 transition duration-200">Dashboard</Link>
          <Link to="/items" className="text-gray-500 hover:text-gray-700 transition duration-200">Items</Link>
          <Link to="/bom" className="text-gray-500 hover:text-gray-700 transition duration-200">BOM</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;