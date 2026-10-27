import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = [
  {
    id: 'amethyst',
    name: 'Velvet Violet',
    subtitle: 'Royal Violet & Electric Magenta',
    primaryColor: '#8b5cf6',
    secondaryColor: '#ec4899',
    bgColor: '#090614',
    isDark: true,
  },
  {
    id: 'cyber',
    name: 'Ultraviolet Cyber',
    subtitle: 'Electric Violet & Cyan',
    primaryColor: '#a855f7',
    secondaryColor: '#00f2fe',
    bgColor: '#070914',
    isDark: true,
  },
  {
    id: 'emerald',
    name: 'Matrix Jade',
    subtitle: 'Abyss Green & Mint',
    primaryColor: '#10b981',
    secondaryColor: '#2dd4bf',
    bgColor: '#03100c',
    isDark: true,
  },
  {
    id: 'amber',
    name: 'Solar Amber',
    subtitle: 'Charcoal & Golden Flame',
    primaryColor: '#f59e0b',
    secondaryColor: '#f97316',
    bgColor: '#0e0a05',
    isDark: true,
  },
  {
    id: 'frost',
    name: 'Pearl Slate',
    subtitle: 'Crisp Light & Violet Accent',
    primaryColor: '#8b5cf6',
    secondaryColor: '#0284c7',
    bgColor: '#f8fafc',
    isDark: false,
  },
];

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('imovies-theme');
    // If previously saved as cyber or null, default to amethyst violet
    if (!saved || saved === 'cyber') {
      localStorage.setItem('imovies-theme', 'amethyst');
      return 'amethyst';
    }
    return saved;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('imovies-theme', theme);
  }, [theme]);

  const setTheme = (themeId) => {
    if (THEMES.some((t) => t.id === themeId)) {
      setThemeState(themeId);
    }
  };

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
