import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { bookingApi } from '../api/bookingApi';
import { showApi } from '../api/showApi';
import Timer from '../components/Timer';
import {
  CreditCard,
  ShieldCheck,
  Film,
  Calendar,
  Clock,
  MapPin,
  Lock,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { showId, show, selectedSeats, lockExpiresAt, totalAmount } =
    location.state || {};

  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cardData, setCardData] = useState({
    name: 'Parv Khandelwal',
    number: '4242 •••• •••• 4242',
    expiry: '12/28',
    cvv: '888',
  });

  if (!showId || !selectedSeats || !show) {
    return (
      <div className="container py-5 text-center text-secondary">
        <h5 className="text-white">No active checkout session found</h5>
        <p className="small mb-4">Please select a movie and lock your seats first.</p>
        <Link to="/movies" className="btn btn-cinema">
          Browse Movies
        </Link>
      </div>
    );
  }

  const movie = show.movieId;
  const screen = show.screenId;
  const theatre = screen?.theatreId;

  const handleTimerExpire = () => {
    alert('Your 5-minute seat hold has expired. The seats have been released.');
    navigate(`/shows/${showId}/seats`);
  };

  const handleCancelHold = async () => {
    try {
      await showApi.unlockSeats(showId, selectedSeats);
    } catch (e) {
      console.warn('Unlock failed or already expired');
    }
    navigate(`/shows/${showId}/seats`);
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    try {
      setPaymentProcessing(true);
      setErrorMessage('');

      const res = await bookingApi.createBooking({
        showId,
        seats: selectedSeats,
      });

      if (res.success && res.data) {
        navigate(`/bookings/${res.data._id}`, {
          state: { booking: res.data, isNew: true },
        });
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Payment processing failed. Please try again.';
      setErrorMessage(msg);
      setPaymentProcessing(false);
    }
  };

  const convenienceFee = Math.round(totalAmount * 0.05);
  const grandTotal = totalAmount + convenienceFee;

  return (
    <div className="checkout-page py-4">
      <div className="container">
        {/* Navigation & Timer Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <button
            onClick={handleCancelHold}
            className="btn btn-cinema-outline btn-sm py-2 px-3 d-inline-flex align-items-center gap-2"
          >
            <ChevronLeft size={16} /> Release Seats & Change
          </button>

          {/* Countdown timer */}
          {lockExpiresAt && (
            <Timer expiresAt={lockExpiresAt} onExpire={handleTimerExpire} />
          )}
        </div>

        {errorMessage && (
          <div
            className="alert alert-danger d-flex align-items-center gap-2 mb-4 rounded-4"
            role="alert"
          >
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="row g-4">
          {/* Order Breakdown Column */}
          <div className="col-lg-7">
            <div className="glass-panel p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="text-white fw-bold m-0 d-flex align-items-center gap-2">
                  <Film size={20} color="var(--cinema-red)" />
                  Booking Breakdown
                </h5>
                <span
                  className="badge px-3 py-1 rounded-pill small fw-semibold"
                  style={{
                    background: 'rgba(0, 242, 254, 0.15)',
                    color: 'var(--cinema-cyan)',
                    border: '1px solid rgba(0, 242, 254, 0.3)',
                  }}
                >
                  Hold Confirmed
                </span>
              </div>

              <div className="d-flex gap-3 mb-4 align-items-center">
                <img
                  src={movie?.posterUrl}
                  alt={movie?.title}
                  className="rounded-4 shadow"
                  style={{ width: 85, height: 120, objectFit: 'cover' }}
                />
                <div>
                  <h5 className="text-white fw-bold mb-1">{movie?.title}</h5>
                  <p className="text-secondary small mb-2">{movie?.genres?.join(', ')}</p>
                  <p className="text-light small mb-1 d-flex align-items-center gap-1">
                    <MapPin size={14} color="var(--cinema-gold)" />
                    {theatre?.name} &bull; {screen?.name}
                  </p>
                  <p className="text-secondary small mb-0 d-flex align-items-center gap-2">
                    <span>
                      <Calendar size={13} className="me-1" />
                      {new Date(show.startTime).toLocaleDateString()}
                    </span>
                    <span>
                      <Clock size={13} className="me-1" />
                      {new Date(show.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </p>
                </div>
              </div>

              <hr className="border-white border-opacity-10 my-3" />

              {/* Seats and Fare Breakdown */}
              <div className="mb-3">
                <div className="d-flex justify-content-between text-secondary small mb-2">
                  <span>Reserved Seats ({selectedSeats.length})</span>
                  <div className="d-flex gap-1 flex-wrap">
                    {selectedSeats.map((s) => (
                      <span
                        key={s}
                        className="badge px-2 py-1 fw-bold"
                        style={{
                          background: 'rgba(0, 242, 254, 0.2)',
                          color: 'var(--cinema-cyan)',
                          borderRadius: 6,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="d-flex justify-content-between text-light small mb-2">
                  <span className="text-secondary">Base Seat Price</span>
                  <span className="fw-semibold">₹{totalAmount}</span>
                </div>

                <div className="d-flex justify-content-between text-light small mb-2">
                  <span className="text-secondary">Convenience & GST (5%)</span>
                  <span className="fw-semibold">₹{convenienceFee}</span>
                </div>
              </div>

              <hr className="border-white border-opacity-10 my-3" />

              <div className="d-flex justify-content-between align-items-center">
                <span className="text-white fw-bold fs-5">Total Due</span>
                <span className="text-white fw-black fs-3" style={{ color: 'var(--cinema-gold)' }}>
                  ₹{grandTotal}
                </span>
              </div>
            </div>

            <div className="glass-panel p-3 d-flex align-items-center gap-3">
              <ShieldCheck size={28} color="#10b981" />
              <div className="small text-secondary">
                <strong className="text-white d-block">Instant Ticket Release Guarantee</strong>
                Your seats are exclusively allocated to your account ID until timer expiration.
              </div>
            </div>
          </div>

          {/* Mock Payment Gateway Column */}
          <div className="col-lg-5">
            <div className="glass-panel p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-white fw-bold m-0 d-flex align-items-center gap-2">
                  <CreditCard size={20} color="var(--cinema-gold)" />
                  Simulated Gateway
                </h5>
                <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-25 small px-2 py-1 rounded-pill">
                  Test Mode
                </span>
              </div>

              {/* Styled Virtual Card Preview */}
              <div
                className="p-3 rounded-4 mb-4 text-white position-relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #1f293d 0%, #0f1422 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="small text-secondary tracking-widest text-uppercase">
                    IMOVIES PASS
                  </span>
                  <Zap size={18} color="var(--cinema-gold)" />
                </div>
                <div className="fs-5 tracking-wider font-monospace mb-3">
                  {cardData.number || '•••• •••• •••• ••••'}
                </div>
                <div className="d-flex justify-content-between align-items-end small">
                  <div>
                    <div className="text-secondary" style={{ fontSize: '0.65rem' }}>
                      CARD HOLDER
                    </div>
                    <div className="fw-semibold">{cardData.name || 'GUEST USER'}</div>
                  </div>
                  <div>
                    <div className="text-secondary" style={{ fontSize: '0.65rem' }}>
                      EXPIRES
                    </div>
                    <div className="fw-semibold">{cardData.expiry || 'MM/YY'}</div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleConfirmPayment}>
                <div className="mb-3">
                  <label className="form-label text-secondary small">Cardholder Name</label>
                  <input
                    type="text"
                    className="form-control form-control-cinema"
                    value={cardData.name}
                    onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary small">Card Number</label>
                  <input
                    type="text"
                    className="form-control form-control-cinema"
                    value={cardData.number}
                    onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                    required
                  />
                </div>

                <div className="row g-2 mb-4">
                  <div className="col-6">
                    <label className="form-label text-secondary small">Expiry</label>
                    <input
                      type="text"
                      className="form-control form-control-cinema"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label text-secondary small">CVV</label>
                    <input
                      type="password"
                      className="form-control form-control-cinema"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Repositioned Pay Button */}
                <button
                  type="submit"
                  disabled={paymentProcessing}
                  className="btn btn-cinema btn-lg w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                >
                  {paymentProcessing ? (
                    <>
                      <div className="spinner-border spinner-border-sm" role="status"></div>
                      <span>Authorizing Reservation...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      <span>Confirm & Pay ₹{grandTotal}</span>
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-3 text-secondary" style={{ fontSize: '0.75rem' }}>
                <CheckCircle2 size={13} className="text-success me-1" />
                256-Bit SSL Mock Cinema Payment Processor
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
