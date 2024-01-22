import React from 'react';
import { motion } from 'framer-motion';
import { FaSignInAlt } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import Api from '../Api';
import Cookies from 'js-cookie';
const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation();

  const handleLogout = async () => {
        Cookies.remove('access_token');
        navigate('/');
  };
  const renderAuthButton = () => {
    if (location.pathname === '/login') {
      return (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center space-x-2"
          onClick={() => navigate('/')}
        >
          <FaSignInAlt size={20} />
          <span>Register</span>
        </motion.button>
      );
    } else if (location.pathname === '/chats') {
      // Handle Logout logic and return a button to log out
      return (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center space-x-2"
          onClick={handleLogout}
        >
          <FaSignInAlt size={20} />
          <span>Logout</span>
        </motion.button>
      );
    } else {
      return (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center space-x-2"
          onClick={() => navigate('/login')}
        >
          <FaSignInAlt size={20} />
          <span>Login</span>
        </motion.button>
      );
    }
  };
  return (
    <motion.nav
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=" bg-blue-500 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-semibold">Logo</div>

      {renderAuthButton()}
      </div>
    </motion.nav>
  );
};

export default Navbar;
