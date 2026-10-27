import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { bookingApi } from '../api/bookingApi';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  Printer,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Sparkles,
  Download,
} from 'lucide-react';

const BookingConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);

  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Fallback
    }

    if (!booking) {
      const fetchBooking = async () => {
        try {
          const res = await bookingApi.getBookingById(id);
          if (res.success) {
            setBooking(res.data);
          }
        } catch (err) {
          console.error('Failed to load booking details:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchBooking();
    }
  }, [id, booking]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="text-center py-5 my-5">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="text-secondary mt-2">Generating verified e-ticket pass...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container py-5 text-center text-secondary">
        <h5 className="text-white">Booking Not Found</h5>
        <Link to="/my-bookings" className="btn btn-cinema mt-3">
          View My Bookings
        </Link>
      </div>
    );
  }

  const show = booking.showId;
  const movie = show?.movieId;
  const screen = show?.screenId;
  const theatre = screen?.theatreId;

  const formattedDate = show?.startTime
    ? new Date(show.startTime).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const formattedTime = show?.startTime
    ? new Date(show.startTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div className="booking-confirmation-page py-4">
      <div className="container" style={{ maxWidth: 800 }}>
        {/* Success Header with Action Shortcuts */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: 48,
                height: 48,
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
              }}
            >
              <CheckCircle size={28} />
            </div>
            <div>
              <h3 className="text-white fw-bold m-0 fs-4">Reservation Confirmed</h3>
              <p className="text-secondary small m-0">Your pass is active and ready for entry.</p>
            </div>
          </div>

          {/* Quick Repositioned Action Buttons */}
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn btn-cinema-outline btn-sm px-3 py-2 d-flex align-items-center gap-1"
            >
              <Printer size={15} />
              <span>Print Pass</span>
            </button>
            <Link
              to="/my-bookings"
              className="btn btn-cinema-outline btn-sm px-3 py-2"
            >
              My Bookings
            </Link>
          </div>
        </div>

        {/* E-Ticket Card */}
        <div className="ticket-card p-4 p-md-5 mb-4 text-white position-relative">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center gap-2">
              <div
                className="p-2 rounded-3"
                style={{ background: 'var(--border-glow)', color: 'var(--cinema-red)' }}
              >
                <Ticket size={22} />
              </div>
              <span
                className="fw-bold tracking-wider fs-5"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                IMOVIES ADMISSION PASS
              </span>
            </div>
            <span
              className="badge px-3 py-2 fw-bold text-uppercase rounded-pill"
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.4)',
              }}
            >
              {booking.status}
            </span>
          </div>

          <div className="row g-4 align-items-center">
            {/* Movie Info */}
            <div className="col-md-7">
              <h3 className="fw-bold text-white mb-2 fs-3">{movie?.title}</h3>
              <p className="text-secondary small mb-3">
                {movie?.language} &bull; {movie?.genres?.join(', ')} &bull; {movie?.durationMin} mins
              </p>

              <div className="mb-3 p-3 rounded-3" style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
                <div className="d-flex align-items-center gap-2 text-warning fw-semibold mb-1 small">
                  <MapPin size={14} /> {theatre?.name}
                </div>
                <div className="text-secondary small ps-3">
                  {theatre?.address}, {theatre?.city}
                </div>
              </div>

              <div className="d-flex flex-wrap gap-4 text-light small mb-3">
                <div>
                  <span className="text-secondary d-block small">SCREEN</span>
                  <strong>{screen?.name}</strong>
                </div>
                <div>
                  <span className="text-secondary d-block small">DATE</span>
                  <strong>{formattedDate}</strong>
                </div>
                <div>
                  <span className="text-secondary d-block small">TIME</span>
                  <strong>{formattedTime}</strong>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-4 pt-3 border-top border-white border-opacity-10">
                <div>
                  <span className="text-secondary d-block small">SEATS ALLOCATED</span>
                  <div className="d-flex gap-1 mt-1 flex-wrap">
                    {booking.seats?.map((seat) => (
                      <span
                        key={seat}
                        className="badge px-2 py-1 fw-bold"
                        style={{
                          background: 'rgba(0, 242, 254, 0.2)',
                          color: 'var(--cinema-cyan)',
                          borderRadius: 6,
                          fontSize: '0.9rem',
                        }}
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-secondary d-block small">PAID AMOUNT</span>
                  <span className="fw-bold fs-4 text-warning">₹{booking.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* QR Code Column */}
            <div className="col-md-5 text-center border-start-md border-white border-opacity-10 ps-md-4">
              <div
                className="bg-white p-3 rounded-4 d-inline-block shadow mb-2"
                style={{ width: 'fit-content' }}
              >
                <QRCodeSVG
                  value={`IMOVIES:${booking.reference}:${booking._id}`}
                  size={150}
                  level="H"
                />
              </div>
              <div className="small text-secondary mt-2">
                Verification Reference:
                <strong className="d-block text-white fw-bold tracking-wider fs-5">
                  {booking.reference}
                </strong>
              </div>
              <div className="text-secondary small mt-1" style={{ fontSize: '0.75rem' }}>
                Present at entry checkpoint
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="text-center pt-2">
          <Link to="/" className="btn btn-cinema px-4 py-2 d-inline-flex align-items-center gap-2">
            <span>Browse More Movies</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
