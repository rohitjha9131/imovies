import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { showApi } from '../api/showApi';
import { useAuth } from '../context/AuthContext';
import SeatGrid from '../components/SeatGrid';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  X,
} from 'lucide-react';

const SeatSelection = () => {
  const { id: showId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locking, setLocking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch show details
  const fetchShowData = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      else setIsRefreshing(true);

      const res = await showApi.getShowById(showId);
      if (res.success && res.data) {
        setShow(res.data);

        // Deselect any seat that has become booked or locked by someone else
        setSelectedSeats((prevSelected) => {
          const validSeats = prevSelected.filter((seatId) => {
            const foundSeat = res.data.seats.find((s) => s.seatId === seatId);
            if (!foundSeat) return false;
            if (foundSeat.status === 'booked') return false;
            if (
              foundSeat.status === 'locked' &&
              foundSeat.lockedBy &&
              foundSeat.lockedBy !== user?._id
            ) {
              return false;
            }
            return true;
          });
          return validSeats;
        });
      }
    } catch (err) {
      console.error('Error fetching show seat map:', err);
      setErrorMessage('Failed to load show seat layout. Please try again.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchShowData();

    // Poll every 5 seconds for live updates
    const pollInterval = setInterval(() => {
      fetchShowData(true);
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [showId]);

  // Handle seat click toggle (up to 8 seats)
  const handleSeatToggle = (seat) => {
    setErrorMessage('');
    const seatId = seat.seatId;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= 8) {
        setErrorMessage('You can select a maximum of 8 seats per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  // Calculate running total
  const calculateTotal = () => {
    if (!show || selectedSeats.length === 0) return 0;
    return selectedSeats.reduce((sum, seatId) => {
      const seat = show.seats.find((s) => s.seatId === seatId);
      const price = show.prices?.[seat?.category] || 150;
      return sum + price;
    }, 0);
  };

  // Handle seat lock and proceed
  const handleProceedToCheckout = async () => {
    if (selectedSeats.length === 0) return;

    if (!isAuthenticated) {
      navigate('/login', {
        state: { from: { pathname: `/shows/${showId}/seats` } },
      });
      return;
    }

    try {
      setLocking(true);
      setErrorMessage('');

      const res = await showApi.lockSeats(showId, selectedSeats);

      if (res.success) {
        navigate('/checkout', {
          state: {
            showId,
            show,
            selectedSeats,
            lockExpiresAt: res.lockExpiresAt,
            totalAmount: calculateTotal(),
          },
        });
      }
    } catch (err) {
      const respData = err.response?.data;
      if (respData && respData.unavailable) {
        setErrorMessage(
          `Some seats were just taken: ${respData.unavailable.join(', ')}. Please select alternative seats.`
        );
        fetchShowData(true);
      } else {
        setErrorMessage(respData?.message || 'Failed to lock seats. Please try again.');
      }
    } finally {
      setLocking(false);
    }
  };

  if (loading && !show) {
    return (
      <div className="text-center py-5 my-5">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="text-secondary mt-3">Rendering interactive seat map...</p>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="container py-5 text-center text-secondary">
        <h5>Show details not found.</h5>
        <Link to="/movies" className="btn btn-cinema mt-3">
          Return to Movies
        </Link>
      </div>
    );
  }

  const movie = show.movieId;
  const screen = show.screenId;
  const theatre = screen?.theatreId;

  const formattedDate = new Date(show.startTime).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = new Date(show.startTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="seat-selection-page pb-5">
      {/* Top Breadcrumb & Metadata Header */}
      <div className="container py-3 mb-3">
        <div className="glass-panel p-3 px-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <Link
              to={`/movies/${movie?._id}`}
              className="btn btn-cinema-outline btn-sm p-2 d-flex align-items-center justify-content-center"
              title="Back to Movie"
            >
              <ChevronLeft size={18} />
            </Link>
            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-danger text-uppercase" style={{ fontSize: '0.65rem' }}>
                  Auditorium
                </span>
                <h4 className="text-white fw-bold m-0 fs-5">{movie?.title}</h4>
              </div>
              <div className="d-flex flex-wrap align-items-center gap-2 text-secondary small mt-1">
                <span className="d-flex align-items-center gap-1 text-light">
                  <MapPin size={13} color="var(--cinema-red)" />
                  {theatre?.name} &bull; {screen?.name}
                </span>
                <span>&bull;</span>
                <span className="d-flex align-items-center gap-1">
                  <Calendar size={13} /> {formattedDate}
                </span>
                <span>&bull;</span>
                <span className="d-flex align-items-center gap-1">
                  <Clock size={13} /> {formattedTime}
                </span>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            {isRefreshing && (
              <span className="text-secondary small d-flex align-items-center gap-1">
                <RefreshCw size={13} className="spin text-info" /> Syncing seats...
              </span>
            )}
            <div
              className="px-3 py-1 rounded-pill small fw-semibold text-secondary"
              style={{ background: 'rgba(255, 255, 255, 0.05)' }}
            >
              Max 8 Seats
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Error Notification */}
        {errorMessage && (
          <div
            className="alert alert-danger d-flex align-items-center gap-2 mb-4 rounded-4"
            role="alert"
          >
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Seat Map Panel */}
        <div className="glass-panel p-4 mb-5 position-relative">
          <SeatGrid
            seats={show.seats || []}
            prices={show.prices || {}}
            selectedSeats={selectedSeats}
            onSeatToggle={handleSeatToggle}
            currentUserId={user?._id}
          />
        </div>
      </div>

      {/* Repositioned Floating Dock When Seats Selected */}
      {selectedSeats.length > 0 && (
        <div className="floating-checkout-dock">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
            {/* Left: Selected seats chips */}
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="text-secondary small">
                  Selected Seats ({selectedSeats.length}/8):
                </span>
                <button
                  onClick={() => setSelectedSeats([])}
                  className="btn btn-link text-secondary p-0 text-decoration-none small d-flex align-items-center gap-1"
                >
                  <X size={12} /> Clear
                </button>
              </div>
              <div className="d-flex flex-wrap gap-1 align-items-center">
                {selectedSeats.map((s) => (
                  <span
                    key={s}
                    className="badge px-2 py-1 fw-bold"
                    style={{
                      background: 'rgba(0, 242, 254, 0.2)',
                      border: '1px solid var(--seat-selected)',
                      color: 'var(--seat-selected)',
                      borderRadius: 8,
                      fontSize: '0.85rem',
                    }}
                  >
                    {s}
                  </span>
                ))}
                <span className="text-white fw-bold ms-3 fs-5">
                  ₹{calculateTotal()}
                </span>
              </div>
            </div>

            {/* Right: Checkout Action Button */}
            <button
              onClick={handleProceedToCheckout}
              disabled={locking}
              className="btn btn-cinema btn-lg px-4 py-2"
            >
              {locking ? (
                <>
                  <div className="spinner-border spinner-border-sm" role="status"></div>
                  <span>Locking Seats...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Pay</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;
