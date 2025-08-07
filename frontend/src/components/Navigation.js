import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {  BookOpen, BarChart3, Home, Menu, X } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: Home,
    },
    {
      name: 'My Bookings',
      path: '/my-bookings',
      icon: BookOpen,
    },
    {
      name: 'Statistics',
      path: '/statistics',
      icon: BarChart3,
    },
  ];

  const NavLink = ({ item, isMobile }) => {
    const { name, path, icon: Icon } = item;
    const isActive = location.pathname === path;
    const baseClasses = "flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300";
    const mobileClasses = isMobile ? "text-lg" : "text-base";
    const activeClasses = isActive 
      ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg transform scale-105" 
      : "text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-600 hover:scale-105";
    
    return (
      <Link to={path} className={`${baseClasses} ${mobileClasses} ${activeClasses}`} onClick={() => setIsOpen(false)}>
        <Icon className="h-5 w-5" />
        <span>{name}</span>
      </Link>
    );
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
                            <div className="p-2 bg-gradient-to-r from-green-600 to-green-500 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <img src="/logo.png" alt="logo"  />
            </div>
          </Link>

          <div className="hidden md:flex space-x-2">
            {navItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div>

          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg shadow-xl border-b
         border-white/20 fade-in z-50">
          <div className="px-4 pt-4 pb-6 space-y-3">
            {navItems.map((item) => (
              <NavLink key={item.name} item={item} isMobile />
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;