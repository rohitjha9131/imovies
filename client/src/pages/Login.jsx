import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, Lock, Mail, AlertCircle, Shield, User, ArrowRight, Zap } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    login(demoEmail, demoPassword)
      .then(() => navigate(redirectPath, { replace: true }))
      .catch((err) => {
        setError(err.response?.data?.message || 'Quick login failed');
        setLoading(false);
      });
  };

  return (
    <div className="login-page py-5 my-auto">
      <div className="container" style={{ maxWidth: 460 }}>
        <div className="glass-panel p-4 p-md-5">
          {/* Header */}
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-3 shadow"
              style={{
                background: 'var(--brand-gradient)',
                boxShadow: 'var(--shadow-glow-red)',
              }}
            >
              <Film size={26} color="#ffffff" />
            </div>
            <h3 className="text-white fw-bold mb-1 fs-3">Welcome to IMovies</h3>
            <p className="text-secondary small">
              Sign in to reserve your seats and view your bookings.
            </p>
          </div>

          {/* Quick Demo Access Repositioned at Top for instant convenience */}
          <div className="p-3 rounded-4 bg-black bg-opacity-30 border border-white border-opacity-10 mb-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-secondary small fw-bold text-uppercase d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
                <Zap size={13} color="var(--cinema-gold)" /> Quick Demo Logins
              </span>
              <span className="badge bg-warning bg-opacity-10 text-warning" style={{ fontSize: '0.65rem' }}>1-Click</span>
            </div>
            <div className="row g-2">
              <div className="col-6">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('user@imovies.com', 'User@12345')}
                  className="btn btn-cinema-outline btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-1"
                  style={{ fontSize: '0.8rem' }}
                >
                  <User size={13} color="var(--cinema-cyan)" />
                  <span>Customer</span>
                </button>
              </div>
              <div className="col-6">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@imovies.com', 'Admin@12345')}
                  className="btn btn-cinema-outline btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-1"
                  style={{ fontSize: '0.8rem' }}
                >
                  <Shield size={13} color="var(--cinema-red)" />
                  <span>Admin</span>
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-3 small rounded-3" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-secondary small">Email Address</label>
              <div className="position-relative">
                <Mail size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
                <input
                  type="email"
                  className="form-control form-control-cinema ps-5"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-secondary small">Password</label>
              <div className="position-relative">
                <Lock size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
                <input
                  type="password"
                  className="form-control form-control-cinema ps-5"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-cinema w-100 py-3 mb-4 d-flex align-items-center justify-content-center gap-2"
            >
              {loading ? (
                <>
                  <div className="spinner-border spinner-border-sm" role="status"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-secondary small">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-danger fw-bold text-decoration-none">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
