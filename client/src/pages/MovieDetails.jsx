import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { movieApi } from '../api/movieApi';
import {
  Star,
  Clock,
  Globe,
  MapPin,
  Play,
  Ticket,
  ChevronRight,
  Info,
  Tv,
  Calendar,
  Sparkles,
} from 'lucide-react';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedCity, setSelectedCity] = useState('');
  const [trailerOpen, setTrailerOpen] = useState(false);

  // Generate next 5 dates for the date selector
  const availableDates = Array.from({ length: 5 }).map((_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() + idx);
    return {
      iso: d.toISOString().split('T')[0],
      dayName:
        idx === 0
          ? 'Today'
          : idx === 1
          ? 'Tomorrow'
          : d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
    };
  });

  useEffect(() => {
    const fetchMovieAndShows = async () => {
      try {
        setLoading(true);
        const [movieRes, showsRes] = await Promise.all([
          movieApi.getMovieById(id),
          movieApi.getMovieShows(id, { date: selectedDate, city: selectedCity }),
        ]);

        if (movieRes.success) setMovie(movieRes.data);
        if (showsRes.success) setShows(showsRes.data);
      } catch (err) {
        console.error('Failed to fetch movie details or shows:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndShows();
  }, [id, selectedDate, selectedCity]);

  // Group shows by Theatre -> Screen
  const groupedTheatres = shows.reduce((acc, show) => {
    const screen = show.screenId;
    const theatre = screen?.theatreId;
    if (!theatre) return acc;

    const theatreId = theatre._id;
    if (!acc[theatreId]) {
      acc[theatreId] = {
        theatre,
        screens: {},
      };
    }

    const screenId = screen._id;
    if (!acc[theatreId].screens[screenId]) {
      acc[theatreId].screens[screenId] = {
        screen,
        shows: [],
      };
    }

    acc[theatreId].screens[screenId].shows.push(show);
    return acc;
  }, {});

  const theatresList = Object.values(groupedTheatres);

  if (loading && !movie) {
    return (
      <div className="text-center py-5 my-5">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="text-secondary mt-3">Loading movie details...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container py-5 text-center text-secondary">
        <h3>Movie Not Found</h3>
        <Link to="/movies" className="btn btn-cinema mt-3">
          Back to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="movie-details-page pb-5">
      {/* High-Impact Hero Showcase */}
      <div
        className="position-relative py-5 mb-5 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, #07090e 35%, rgba(7, 9, 14, 0.9) 70%, rgba(7, 9, 14, 0.5) 100%), linear-gradient(to top, #07090e 0%, transparent 80%), url(${movie.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
        }}
      >
        <div className="container position-relative pt-3" style={{ zIndex: 2 }}>
          <div className="row g-4 align-items-center">
            {/* Poster Column */}
            <div className="col-md-4 col-lg-3 text-center text-md-start">
              <div
                className="rounded-4 overflow-hidden border border-white border-opacity-15 mx-auto"
                style={{
                  maxWidth: 270,
                  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.8), var(--shadow-glow-red)',
                }}
              >
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-100 d-block"
                  style={{ aspectRatio: '2/3', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Movie Info Column */}
            <div className="col-md-8 col-lg-9">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <span
                  className="badge px-3 py-1 text-uppercase fw-bold"
                  style={{
                    background:
                      movie.status === 'now_showing'
                        ? 'var(--brand-gradient)'
                        : 'var(--cinema-gold)',
                    color: movie.status === 'now_showing' ? '#ffffff' : '#000000',
                    borderRadius: 9999,
                  }}
                >
                  {movie.status === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
                </span>
                {movie.genres?.map((g) => (
                  <span
                    key={g}
                    className="badge bg-white bg-opacity-10 text-light fw-normal px-3 py-1"
                    style={{ borderRadius: 9999 }}
                  >
                    {g}
                  </span>
                ))}
              </div>

              <h1 className="display-5 fw-black text-white mb-2">{movie.title}</h1>

              {/* Metrics Pill Bar */}
              <div className="d-flex flex-wrap align-items-center gap-2 text-secondary mb-3">
                {movie.rating > 0 && (
                  <div
                    className="d-flex align-items-center gap-1 text-warning fw-bold px-3 py-1 rounded-pill"
                    style={{ background: 'rgba(255, 184, 0, 0.12)', border: '1px solid rgba(255, 184, 0, 0.25)' }}
                  >
                    <Star size={15} fill="var(--cinema-gold)" />
                    <span>{movie.rating.toFixed(1)} / 10</span>
                  </div>
                )}
                <span className="px-3 py-1 rounded-pill text-light small bg-white bg-opacity-10 d-flex align-items-center gap-1">
                  <Clock size={13} className="text-secondary" /> {movie.durationMin} mins
                </span>
                <span className="px-3 py-1 rounded-pill text-light small bg-white bg-opacity-10 d-flex align-items-center gap-1">
                  <Globe size={13} className="text-secondary" /> {movie.language}
                </span>
                <span className="px-3 py-1 rounded-pill text-secondary small bg-white bg-opacity-5">
                  {new Date(movie.releaseDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <p
                className="text-secondary mb-4"
                style={{ maxWidth: 700, lineHeight: 1.6, fontSize: '0.98rem' }}
              >
                {movie.description}
              </p>

              {movie.cast && movie.cast.length > 0 && (
                <div className="mb-4">
                  <span className="text-secondary small fw-bold text-uppercase d-block mb-2">
                    Key Cast
                  </span>
                  <div className="d-flex flex-wrap gap-2">
                    {movie.cast.map((actor, idx) => (
                      <span
                        key={idx}
                        className="badge bg-white bg-opacity-10 text-white py-1 px-3 fw-normal"
                        style={{ borderRadius: 9999 }}
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Repositioned Action Controls */}
              <div className="d-flex flex-wrap gap-3 align-items-center">
                {movie.trailerUrl && (
                  <button
                    onClick={() => setTrailerOpen(true)}
                    className="btn btn-cinema-outline d-inline-flex align-items-center gap-2"
                  >
                    <Play size={16} fill="#ffffff" />
                    <span>Watch Trailer</span>
                  </button>
                )}
                <a
                  href="#showtimes"
                  className="btn btn-cinema d-inline-flex align-items-center gap-2"
                >
                  <Ticket size={16} />
                  <span>View Showtimes</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal (if open) */}
      {trailerOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', zIndex: 1050 }}
          onClick={() => setTrailerOpen(false)}
        >
          <div
            className="glass-panel p-3 w-100"
            style={{ maxWidth: 840 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-white m-0 fw-bold">{movie.title} - Official Trailer</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setTrailerOpen(false)}
              ></button>
            </div>
            <div className="ratio ratio-16x9 rounded-3 overflow-hidden">
              <iframe
                src={
                  movie.trailerUrl.includes('watch?v=')
                    ? movie.trailerUrl.replace('watch?v=', 'embed/')
                    : movie.trailerUrl
                }
                title="Trailer"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Showtimes & Booking Section */}
      <div className="container" id="showtimes">
        {/* Date & City Toolbar */}
        <div className="glass-panel p-4 mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
            <div>
              <div
                className="d-flex align-items-center gap-2 small fw-bold text-uppercase mb-1"
                style={{ color: 'var(--cinema-red)' }}
              >
                <Sparkles size={14} /> Multiplex Schedules
              </div>
              <h3 className="text-white fw-bold m-0">Select Showtime</h3>
            </div>

            {/* City Filter Selector */}
            <div className="d-flex align-items-center gap-2">
              <MapPin size={18} color="var(--cinema-red)" />
              <select
                className="form-select form-select-cinema"
                style={{ width: 190 }}
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">All Regions</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Delhi NCR">Delhi NCR</option>
              </select>
            </div>
          </div>

          {/* Date Selector Pills */}
          <div className="d-flex gap-2 overflow-x-auto pb-2">
            {availableDates.map((item) => (
              <button
                key={item.iso}
                onClick={() => setSelectedDate(item.iso)}
                className={`btn text-center p-2 px-3 rounded-4 transition-all ${
                  selectedDate === item.iso
                    ? 'btn-cinema shadow-sm'
                    : 'btn-cinema-outline text-secondary'
                }`}
                style={{ minWidth: 95 }}
              >
                <div className="small fw-semibold text-uppercase" style={{ fontSize: '0.75rem' }}>
                  {item.dayName}
                </div>
                <div className="fs-4 fw-bold">{item.dateNum}</div>
                <div className="small opacity-75" style={{ fontSize: '0.72rem' }}>
                  {item.month}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Grouped Showtimes List */}
        {theatresList.length === 0 ? (
          <div className="glass-panel p-5 text-center text-secondary">
            <Info size={40} className="mb-2 text-warning" />
            <h5 className="text-white">No shows found for this date & region</h5>
            <p className="small mb-0">Try picking a different day or switching cities above.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {theatresList.map(({ theatre, screens }) => (
              <div key={theatre._id} className="glass-panel p-4">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
                  <div>
                    <h5 className="text-white fw-bold mb-1">{theatre.name}</h5>
                    <p className="text-secondary small mb-0 d-flex align-items-center gap-1">
                      <MapPin size={13} color="var(--cinema-gold)" />
                      {theatre.address}, {theatre.city}
                    </p>
                  </div>
                </div>

                <hr className="border-white border-opacity-10 my-3" />

                {/* Screens and Showtimes */}
                <div className="d-flex flex-column gap-3">
                  {Object.values(screens).map(({ screen, shows }) => (
                    <div key={screen._id} className="row g-2 align-items-center">
                      <div className="col-md-3">
                        <span className="text-light small fw-bold d-flex align-items-center gap-2">
                          <Tv size={15} color="var(--cinema-cyan)" />
                          {screen.name}
                        </span>
                      </div>

                      <div className="col-md-9">
                        <div className="d-flex flex-wrap gap-2">
                          {shows.map((show) => {
                            const timeStr = new Date(show.startTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            });
                            const minPrice = Math.min(
                              show.prices?.regular || 150,
                              show.prices?.premium || 250,
                              show.prices?.recliner || 400
                            );

                            return (
                              <Link
                                key={show._id}
                                to={`/shows/${show._id}/seats`}
                                className="btn btn-cinema-outline text-decoration-none d-flex flex-column align-items-center py-2 px-3"
                                style={{ minWidth: 110, borderRadius: 14 }}
                              >
                                <span
                                  className="text-white fw-bold"
                                  style={{ fontSize: '0.95rem' }}
                                >
                                  {timeStr}
                                </span>
                                <span
                                  className="text-success small fw-semibold"
                                  style={{ fontSize: '0.72rem' }}
                                >
                                  ₹{minPrice}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
