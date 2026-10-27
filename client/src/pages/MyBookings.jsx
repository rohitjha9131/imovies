import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../api/bookingApi';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [cancellingId, setCancellingId] = useState(null);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingApi.getMyBookings();
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const now = new Date();

  // Filter bookings into Upcoming vs Past/Cancelled
  const upcomingBookings = bookings.filter((b) => {
    if (b.status === 'cancelled') return false;
    const startTime = new Date(b.showId?.startTime);
    return startTime > now;
  });

  const pastBookings = bookings.filter((b) => {
    if (b.status === 'cancelled') return true;
    const startTime = new Date(b.showId?.startTime);
    return startTime <= now;
  });

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  // Handle cancellation
  const handleCancelBooking = async (bookingId) => {
    if (
      !window.confirm(
        'Are you sure you want to cancel this booking? This will immediately release your reserved seats.'
      )
    ) {
      return;
    }

    try {
      setCancellingId(bookingId);
      setActionError('');
      setActionSuccess('');

      const res = await bookingApi.cancelBooking(bookingId);
      if (res.success) {
        setActionSuccess('Booking cancelled successfully and seats have been released.');
        fetchBookings();
      }
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          'Failed to cancel booking. Notice: Bookings can only be cancelled up to 2 hours before showtime.'
      );
    } finally {
      setCancellingId(null);
    }
  };

  // Check if booking is cancelable (>= 2 hours before showtime)
  const isCancelable = (booking) => {
    if (booking.status === 'cancelled') return false;
    if (!booking.showId?.startTime) return false;
    const showTime = new Date(booking.showId.startTime).getTime();
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    return showTime - Date.now() >= twoHoursInMs;
  };

  return (
    <div className="my-bookings-page py-4">
      <div className="container">
        {/* Header & Tabs */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="text-white fw-bold m-0 fs-2 d-flex align-items-center gap-2">
              <Ticket size={24} color="var(--cinema-red)" />
              My Bookings
            </h1>
            <p className="text-secondary small m-0 mt-1">
              Access your digital e-tickets, view admission codes, or manage reservations.
            </p>
          </div>

          {/* Repositioned Tab Switcher */}
          <div className="d-inline-flex p-1 bg-black bg-opacity-40 rounded-pill border border-white border-opacity-10 align-self-start align-self-md-auto">
            <button
              className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold transition-all ${
                activeTab === 'upcoming'
                  ? 'btn-cinema shadow-sm'
                  : 'text-secondary border-0 bg-transparent'
              }`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming ({upcomingBookings.length})
            </button>
            <button
              className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold transition-all ${
                activeTab === 'past'
                  ? 'btn-cinema shadow-sm'
                  : 'text-secondary border-0 bg-transparent'
              }`}
              onClick={() => setActiveTab('past')}
            >
              Past & Cancelled ({pastBookings.length})
            </button>
          </div>
        </div>

        {actionSuccess && (
          <div className="alert alert-success d-flex align-items-center gap-2 mb-4 rounded-4">
            <CheckCircle size={18} />
            <span>{actionSuccess}</span>
          </div>
        )}

        {actionError && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-4 rounded-4">
            <AlertTriangle size={18} />
            <span>{actionError}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5 my-5">
            <div className="spinner-border text-danger" role="status"></div>
            <p className="text-secondary mt-2">Loading reservation history...</p>
          </div>
        ) : displayedBookings.length === 0 ? (
          <div className="glass-panel p-5 text-center text-secondary">
            <h5 className="text-white">No {activeTab} bookings found</h5>
            <p className="small mb-4">You have no reservations under this tab.</p>
            <Link to="/movies" className="btn btn-cinema">
              Book Tickets Now
            </Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {displayedBookings.map((b) => {
              const show = b.showId;
              const movie = show?.movieId;
              const screen = show?.screenId;
              const theatre = screen?.theatreId;

              const showDate = show?.startTime
                ? new Date(show.startTime).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'N/A';

              const showTime = show?.startTime
                ? new Date(show.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'N/A';

              const canCancel = isCancelable(b);

              return (
                <div key={b._id} className="glass-panel p-4">
                  <div className="row g-3 align-items-center">
                    {/* Poster */}
                    <div className="col-sm-3 col-md-2 text-center text-sm-start">
                      <img
                        src={movie?.posterUrl}
                        alt={movie?.title}
                        className="rounded-4 shadow-sm w-100"
                        style={{ maxWidth: 100, aspectRatio: '2/3', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Movie & Show Info */}
                    <div className="col-sm-9 col-md-6">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="text-secondary small fw-bold font-monospace">
                          {b.reference}
                        </span>
                        <span
                          className={`badge px-2 py-1 rounded-pill small ${
                            b.status === 'confirmed'
                              ? 'bg-success bg-opacity-20 text-success border border-success border-opacity-25'
                              : 'bg-danger bg-opacity-20 text-danger border border-danger border-opacity-25'
                          }`}
                        >
                          {b.status.toUpperCase()}
                        </span>
                      </div>

                      <h5 className="text-white fw-bold mb-1 fs-5">{movie?.title}</h5>
                      <p className="text-secondary small mb-2 d-flex align-items-center gap-1">
                        <MapPin size={13} color="var(--cinema-gold)" />
                        {theatre?.name} &bull; {screen?.name}
                      </p>

                      <div className="d-flex flex-wrap gap-3 text-light small mb-2">
                        <span className="d-flex align-items-center gap-1">
                          <Calendar size={13} /> {showDate}
                        </span>
                        <span className="d-flex align-items-center gap-1">
                          <Clock size={13} /> {showTime}
                        </span>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <span className="text-secondary small">Seats:</span>
                        <div className="d-flex flex-wrap gap-1">
                          {b.seats?.map((seat) => (
                            <span
                              key={seat}
                              className="badge px-2 py-1 fw-bold"
                              style={{
                                background: 'rgba(0, 242, 254, 0.15)',
                                color: 'var(--cinema-cyan)',
                                borderRadius: 6,
                              }}
                            >
                              {seat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Repositioned Action Toolbar */}
                    <div className="col-md-4 text-md-end pt-3 pt-md-0 border-top border-md-0 border-white border-opacity-10">
                      <div className="mb-3">
                        <span className="text-secondary small d-block">Total Paid</span>
                        <span
                          className="fw-bold fs-4"
                          style={{ color: 'var(--cinema-gold)' }}
                        >
                          ₹{b.totalAmount}
                        </span>
                      </div>

                      <div className="d-flex flex-wrap justify-content-md-end gap-2">
                        <Link
                          to={`/bookings/${b._id}`}
                          className="btn btn-cinema btn-sm px-3 py-2 d-flex align-items-center gap-1"
                        >
                          <Eye size={14} />
                          <span>View Ticket</span>
                        </Link>

                        {canCancel && (
                          <button
                            onClick={() => handleCancelBooking(b._id)}
                            disabled={cancellingId === b._id}
                            className="btn btn-cinema-outline btn-sm px-3 py-2 text-danger border-danger border-opacity-50"
                          >
                            {cancellingId === b._id ? (
                              'Cancelling...'
                            ) : (
                              <>
                                <XCircle size={14} className="me-1" />
                                Cancel
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
