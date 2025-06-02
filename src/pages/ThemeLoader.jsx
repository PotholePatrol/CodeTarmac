import { useEffect } from 'react';
import { useTheme } from './ThemeContext';

const ThemeLoader = () => {
  const { darkMode } = useTheme();

  useEffect(() => {
    const existing = document.getElementById('prime-theme');
    if (existing) existing.remove();

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = darkMode
      ? 'https://unpkg.com/primereact/resources/themes/lara-dark-blue/theme.css'
      : 'https://unpkg.com/primereact/resources/themes/lara-light-blue/theme.css';
    link.id = 'prime-theme';

    document.head.appendChild(link);
  }, [darkMode]);

  return null;
};

export default ThemeLoader;
