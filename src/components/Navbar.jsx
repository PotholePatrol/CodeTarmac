import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaRoad,
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaHome,
  FaInfoCircle,
  FaSignInAlt,
  FaUserPlus
} from 'react-icons/fa';
import { useTheme } from '../pages/ThemeContext';
import logoLight from '../assets/pothole-logo.png';
import logoDark from '../assets/pothole-logo.png';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (activeDropdown) setActiveDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { path: '/', name: 'Home', icon: <FaHome /> },
    { path: '/about', name: 'About', icon: <FaInfoCircle /> },
    {
      name: 'Services',
      icon: <FaRoad />,
      subItems: [
        { path: '/services/1', name: 'service 1' },
        { path: '/services/2', name: 'service 2' },
        { path: '/services/3', name: 'service 3' }
      ]
    },
    { path: '/login', name: 'Login', icon: <FaSignInAlt />, cta: true },
  ];

  return (
    <nav className={`sticky top-0 w-full z-50 bg-gray-900/90 transition-all duration-300 mb-[50px]${scrolled
        ? darkMode
          ? 'bg-gray-900/95 backdrop-blur-sm shadow-xl'
          : 'bg-gray-400/95 backdrop-blur-sm shadow-xl'
        : darkMode
          ? 'bg-gray-900/80 backdrop-blur-sm'
          : 'bg-blue-900/80 backdrop-blur-sm'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-2">
              <img
                className="h-12 w-auto"
                src={darkMode ? logoDark : logoLight}
                alt="Company Logo"
              />

            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <React.Fragment key={item.name}>
                {item.path ? (
                  <NavLink
                    to={item.path}
                    icon={item.icon}
                    isActive={location.pathname === item.path}
                    isCta={item.cta}
                    darkMode={darkMode}
                  >
                    {item.name}
                  </NavLink>
                ) : (
                  <div className="relative" key={item.name}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === item.name ? null : item.name);
                      }}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${activeDropdown === item.name
                          ? darkMode
                            ? 'bg-gray-700 text-white'
                            : 'bg-blue-100 text-blue-800'
                          : darkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-white hover:bg-blue-800'
                        }`}
                    >
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                    </button>

                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className={`absolute left-0 mt-2 w-56 rounded-md shadow-lg z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'
                            }`}
                        >
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className={`block px-4 py-3 text-sm ${darkMode
                                  ? 'text-gray-300 hover:bg-gray-700'
                                  : 'text-gray-700 hover:bg-blue-50'
                                }`}
                              onClick={() => setActiveDropdown(null)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </React.Fragment>
            ))}

            <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
              aria-label="Open menu"
            >
              {isOpen ? (
                <FaTimes className={`h-6 w-6 ${darkMode ? 'text-white' : 'text-white'}`} />
              ) : (
                <FaBars className={`h-6 w-6 ${darkMode ? 'text-white' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`md:hidden overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-blue-800'}`}
          >
            <div className="px-2 pt-2 pb-4 space-y-1">
              {navItems.map((item) => (
                <React.Fragment key={item.name}>
                  {item.path ? (
                    <MobileNavLink
                      to={item.path}
                      icon={item.icon}
                      isActive={location.pathname === item.path}
                      onClick={() => setIsOpen(false)}
                      isCta={item.cta}
                      darkMode={darkMode}
                    >
                      {item.name}
                    </MobileNavLink>
                  ) : (
                    <div key={item.name} className="space-y-1">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                        className={`flex w-full items-center px-3 py-2 rounded-md text-base font-medium ${darkMode ? 'text-gray-300' : 'text-white'
                          }`}
                      >
                        {item.icon}
                        <span className="ml-3">{item.name}</span>
                      </button>
                      {activeDropdown === item.name && (
                        <div className="pl-8 space-y-1">
                          {item.subItems.map((subItem) => (
                            <MobileNavLink
                              key={subItem.path}
                              to={subItem.path}
                              isActive={location.pathname === subItem.path}
                              onClick={() => {
                                setIsOpen(false);
                                setActiveDropdown(null);
                              }}
                              darkMode={darkMode}
                            >
                              {subItem.name}
                            </MobileNavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Reusable NavLink component for desktop
const NavLink = ({ to, children, icon, isActive, isCta = false, darkMode }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Link
      to={to}
      className={`flex items-center px-4 py-2 rounded-md text-sm font-semibold tracking-wide transition-all
    ${isActive
              ? darkMode
                ? 'bg-gray-700 text-white'
                : 'bg-blue-700 text-white'
              : darkMode
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-white hover:bg-blue-800'
            }
    ${isCta ? (darkMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-amber-500 hover:bg-amber-600') : ''}`}

    >
      {icon}
      <span className="ml-2">{children}</span>
    </Link>
  </motion.div>
);

// Reusable NavLink component for mobile
const MobileNavLink = ({ to, children, icon, isActive, onClick, isCta = false, darkMode }) => (
  <motion.div
    whileTap={{ scale: 0.95 }}
    className={isCta ? 'mt-4' : ''}
  >
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center px-3 py-3 rounded-md text-base font-medium ${isActive
          ? darkMode
            ? 'bg-gray-700 text-white'
            : 'bg-blue-700 text-white'
          : darkMode
            ? 'text-gray-300 hover:bg-gray-700'
            : 'text-white hover:bg-blue-700'
        } ${isCta ? (darkMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-amber-500 hover:bg-amber-600') : ''}`}
    >
      {icon && <span className="mr-3">{icon}</span>}
      {children}
    </Link>
  </motion.div>
);

// Dark mode toggle component
const DarkModeToggle = ({ darkMode, toggleDarkMode }) => (
  <motion.button
    onClick={toggleDarkMode}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="p-2 rounded-full focus:outline-none"
    aria-label="Toggle dark mode"
  >
    {darkMode ? (
      <FaSun className="text-yellow-300 h-5 w-5" />
    ) : (
      <FaMoon className="text-white h-5 w-5" />
    )}
  </motion.button>
);

export default Navbar;