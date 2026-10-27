import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Film, Ticket, User as UserIcon, Shield, LogOut, Compass, Sparkles, ChevronDown, Palette } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, setTheme, currentTheme, themes } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="glass-nav-container">
      <div className="container">
        <header className="glass-nav-pill d-flex align-items-center justify-content-between">
          {/* Brand Logo & Name */}
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--brand-gradient)',
                boxShadow: 'var(--shadow-glow-red)',
              }}
            >
              <Film size={18} color="#ffffff" />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.45rem',
                fontWeight: 800,
                letterSpacing: '-0.5px',
              }}
            >
              <span className="text-white">I</span>
              <span style={{ color: 'var(--cinema-red)' }}>Movies</span>
            </span>
          </Link>

          {/* Centered Navigation Pills */}
          <nav className="d-none d-md-flex align-items-center gap-1 bg-black bg-opacity-40 p-1 rounded-pill border border-white border-opacity-10">
            <Link
              to="/"
              className={`nav-link-cinema ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/movies"
              className={`nav-link-cinema ${isActive('/movies') ? 'active' : ''}`}
            >
              <Compass size={14} />
              Explore Shows
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className={`nav-link-cinema ${isActive('/admin') ? 'active text-warning' : 'text-warning'}`}
              >
                <Shield size={14} />
                Admin
              </Link>
            )}
          </nav>

          {/* User Profile, Theme Switcher & Auth Actions */}
          <div className="d-flex align-items-center gap-2">
            {/* Theme Color Switcher Dropdown */}
            <div className="dropdown">
              <button
                className="theme-switcher-btn dropdown-toggle border-0"
                type="button"
                id="themeDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title="Change UI Theme Color"
              >
                <Palette size={14} style={{ color: 'var(--cinema-red)' }} />
                <span
                  className="theme-swatch-circle"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.primaryColor} 0%, ${currentTheme.secondaryColor} 100%)`,
                    width: 12,
                    height: 12,
                  }}
                />
                <span className="d-none d-sm-inline">{currentTheme.name}</span>
                <ChevronDown size={12} className="text-secondary" />
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end theme-palette-dropdown mt-2"
                aria-labelledby="themeDropdown"
              >
                <li
                  className="px-3 py-2 small fw-bold text-uppercase"
                  style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', letterSpacing: '0.05em' }}
                >
                  Select Interface Color
                </li>
                {themes.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      className={`theme-option-item w-100 bg-transparent border-0 text-start ${
                        theme === t.id ? 'active' : ''
                      }`}
                      onClick={() => setTheme(t.id)}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="theme-swatch-circle"
                          style={{
                            background: `linear-gradient(135deg, ${t.primaryColor} 0%, ${t.secondaryColor} 100%)`,
                          }}
                        />
                        <div>
                          <div className="fw-bold small" style={{ color: 'var(--text-primary)' }}>
                            {t.name}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                            {t.subtitle}
                          </div>
                        </div>
                      </div>
                      {theme === t.id && (
                        <span
                          className="badge rounded-pill"
                          style={{ background: t.primaryColor, color: '#fff', fontSize: '0.62rem' }}
                        >
                          Active
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-cinema-outline btn-cinema-pill dropdown-toggle d-flex align-items-center gap-2 border-0 bg-white bg-opacity-10 py-1 px-3"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                    style={{
                      width: 26,
                      height: 26,
                      background: 'linear-gradient(135deg, #a78bfa 0%, #6d28d9 100%)',
                      fontSize: '0.75rem',
                    }}
                  >
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="fw-semibold text-white small d-none d-sm-inline">{user?.name}</span>
                  {isAdmin && (
                    <span className="badge bg-danger ms-1" style={{ fontSize: '0.6rem' }}>
                      ADMIN
                    </span>
                  )}
                  <ChevronDown size={13} className="text-secondary" />
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end shadow-lg py-2 mt-2"
                  aria-labelledby="userDropdown"
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 16,
                    minWidth: 210,
                  }}
                >
                  <li>
                    <Link
                      to="/my-bookings"
                      className="dropdown-item d-flex align-items-center gap-2 text-white py-2"
                      style={{ fontSize: '0.9rem' }}
                    >
                      <Ticket size={16} color="var(--cinema-red)" />
                      My Bookings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="dropdown-item d-flex align-items-center gap-2 text-white py-2"
                      style={{ fontSize: '0.9rem' }}
                    >
                      <UserIcon size={16} color="var(--cinema-gold)" />
                      Profile Settings
                    </Link>
                  </li>
                  {isAdmin && (
                    <>
                      <li><hr className="dropdown-divider border-secondary opacity-25" /></li>
                      <li>
                        <Link
                          to="/admin"
                          className="dropdown-item d-flex align-items-center gap-2 text-warning py-2"
                          style={{ fontSize: '0.9rem' }}
                        >
                          <Shield size={16} />
                          Admin Console
                        </Link>
                      </li>
                    </>
                  )}
                  <li><hr className="dropdown-divider border-secondary opacity-25" /></li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item d-flex align-items-center gap-2 text-danger py-2 w-100 border-0 bg-transparent"
                      style={{ fontSize: '0.9rem' }}
                    >
                      <LogOut size={16} />
                      Log Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-cinema-outline btn-cinema-pill py-1 px-3 small">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-cinema btn-cinema-pill py-1 px-3 small shadow-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </header>
      </div>
    </div>
  );
};

export default Navbar;
