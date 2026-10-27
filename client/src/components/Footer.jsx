import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, ShieldCheck, Zap, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      className="mt-auto border-top border-white border-opacity-10 py-5"
      style={{ background: 'var(--bg-surface)' }}
    >
      <div className="container">
        <div className="row g-4 justify-content-between">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--brand-gradient)',
                  boxShadow: 'var(--shadow-glow-red)',
                }}
              >
                <Film size={17} color="#ffffff" />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.3rem',
                  fontWeight: 800,
                }}
              >
                <span className="text-white">I</span>
                <span style={{ color: 'var(--cinema-red)' }}>Movies</span>
              </span>
            </div>
            <p className="text-secondary small mb-3">
              Premier cinematic booking experience featuring atomic seat reservations,
              real-time countdown locks, and instant contactless QR boarding passes.
            </p>
            <div className="d-flex gap-2">
              <span className="badge bg-white bg-opacity-10 text-secondary">React 19</span>
              <span className="badge bg-white bg-opacity-10 text-secondary">Vite 8</span>
              <span className="badge bg-white bg-opacity-10 text-secondary">Node 24</span>
              <span className="badge bg-white bg-opacity-10 text-secondary">MongoDB 8</span>
            </div>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="text-white fw-bold mb-3">Explore</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2 mb-0">
              <li>
                <Link to="/" className="text-decoration-none text-secondary hover-white">
                  Home Premiere
                </Link>
              </li>
              <li>
                <Link
                  to="/movies?status=now_showing"
                  className="text-decoration-none text-secondary hover-white"
                >
                  Now Showing
                </Link>
              </li>
              <li>
                <Link
                  to="/movies?status=coming_soon"
                  className="text-decoration-none text-secondary hover-white"
                >
                  Coming Soon
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-decoration-none text-secondary hover-white">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-3 col-6">
            <h6 className="text-white fw-bold mb-3">Platform Guarantees</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2 mb-0">
              <li className="d-flex align-items-center gap-2">
                <ShieldCheck size={14} color="#10b981" /> Atomic Concurrency
              </li>
              <li className="d-flex align-items-center gap-2">
                <Zap size={14} color="var(--cinema-gold)" /> 5-Minute Seat Locks
              </li>
              <li className="d-flex align-items-center gap-2">
                <Award size={14} color="var(--cinema-cyan)" /> IMAX & Dolby Atmos
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4 border-white border-opacity-10" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-secondary small">
          <div>&copy; {new Date().getFullYear()} IMovies Cinema Systems. All rights reserved.</div>
          <div className="mt-2 mt-md-0 d-flex align-items-center gap-1">
            Engineered with <Heart size={13} color="var(--cinema-red)" fill="var(--cinema-red)" />{' '}
            for cinematic perfection.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
