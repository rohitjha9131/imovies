import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Film,
  Building2,
  CalendarDays,
  Ticket,
  Shield,
  Sparkles,
} from 'lucide-react';

const AdminLayout = () => {
  return (
    <div className="admin-layout py-4">
      <div className="container">
        {/* Admin Header */}
        <div className="glass-panel p-3 px-4 mb-4 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: 40,
                height: 40,
                background: 'var(--border-glow)',
                color: 'var(--cinema-red)',
              }}
            >
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-white fw-bold m-0 fs-4" style={{ fontFamily: 'var(--font-heading)' }}>
                Cinema Control Center
              </h2>
              <p className="text-secondary small m-0">Platform administrative operations & analytics</p>
            </div>
          </div>
          <span
            className="badge px-3 py-2 fw-bold text-uppercase rounded-pill align-self-start align-self-sm-auto"
            style={{
              background: 'rgba(255, 184, 0, 0.15)',
              color: 'var(--cinema-gold)',
              border: '1px solid rgba(255, 184, 0, 0.3)',
            }}
          >
            Admin Privileges Active
          </span>
        </div>

        {/* Repositioned Modern Tab Navigation */}
        <div className="d-inline-flex p-1 bg-black bg-opacity-40 rounded-pill border border-white border-opacity-10 mb-4 overflow-x-auto max-w-100">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `btn btn-sm d-flex align-items-center gap-2 px-3 py-1 rounded-pill text-nowrap transition-all ${
                isActive ? 'btn-cinema shadow-sm' : 'text-secondary border-0 bg-transparent'
              }`
            }
          >
            <LayoutDashboard size={15} /> Dashboard
          </NavLink>

          <NavLink
            to="/admin/movies"
            className={({ isActive }) =>
              `btn btn-sm d-flex align-items-center gap-2 px-3 py-1 rounded-pill text-nowrap transition-all ${
                isActive ? 'btn-cinema shadow-sm' : 'text-secondary border-0 bg-transparent'
              }`
            }
          >
            <Film size={15} /> Movies Catalogue
          </NavLink>

          <NavLink
            to="/admin/theatres"
            className={({ isActive }) =>
              `btn btn-sm d-flex align-items-center gap-2 px-3 py-1 rounded-pill text-nowrap transition-all ${
                isActive ? 'btn-cinema shadow-sm' : 'text-secondary border-0 bg-transparent'
              }`
            }
          >
            <Building2 size={15} /> Theatres & Screens
          </NavLink>

          <NavLink
            to="/admin/shows"
            className={({ isActive }) =>
              `btn btn-sm d-flex align-items-center gap-2 px-3 py-1 rounded-pill text-nowrap transition-all ${
                isActive ? 'btn-cinema shadow-sm' : 'text-secondary border-0 bg-transparent'
              }`
            }
          >
            <CalendarDays size={15} /> Shows & Schedules
          </NavLink>

          <NavLink
            to="/admin/bookings"
            className={({ isActive }) =>
              `btn btn-sm d-flex align-items-center gap-2 px-3 py-1 rounded-pill text-nowrap transition-all ${
                isActive ? 'btn-cinema shadow-sm' : 'text-secondary border-0 bg-transparent'
              }`
            }
          >
            <Ticket size={15} /> Global Ledger
          </NavLink>
        </div>

        {/* Child Admin Pages */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
