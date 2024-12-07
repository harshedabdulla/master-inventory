import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon, XIcon } from '@heroicons/react/solid';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-700">Inventory System</h1>
        
        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          <Link 
            to="/" 
            className="text-gray-600 hover:text-blue-600 font-medium transition duration-200"
          >
            Dashboard
          </Link>
          <Link 
            to="/items" 
            className="text-gray-600 hover:text-blue-600 font-medium transition duration-200"
          >
            Items
          </Link>
          <Link 
            to="/bom" 
            className="text-gray-600 hover:text-blue-600 font-medium transition duration-200"
          >
            BOM
          </Link>
          <Link 
            to="/upload" 
            className="text-gray-600 hover:text-blue-600 font-medium transition duration-200"
          >
            Upload
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Links */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-50">
          <Link
            to="/"
            className="block px-4 py-2 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/items"
            className="block px-4 py-2 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Items
          </Link>
          <Link
            to="/bom"
            className="block px-4 py-2 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            BOM
          </Link>
          <Link
            to="/upload"
            className="block px-4 py-2 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Upload
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;