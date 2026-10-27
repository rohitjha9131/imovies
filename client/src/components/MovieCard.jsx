import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Globe, Ticket, ArrowUpRight } from 'lucide-react';

const MovieCard = ({ movie }) => {
  const isComingSoon = movie.status === 'coming_soon';

  return (
    <div className="movie-card-modern h-100">
      {/* Poster with Floating Badges */}
      <Link to={`/movies/${movie._id}`} className="movie-poster-wrap text-decoration-none d-block">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop';
          }}
        />
        <div className="movie-poster-gradient" />

        {/* Floating Top Badges */}
        <div className="movie-floating-badges">
          {movie.rating > 0 ? (
            <div className="movie-badge-glass text-warning">
              <Star size={13} fill="var(--cinema-gold)" color="var(--cinema-gold)" />
              <span>{movie.rating.toFixed(1)}</span>
            </div>
          ) : <div />}

          {isComingSoon ? (
            <div
              className="badge text-dark fw-bold px-2 py-1"
              style={{ background: 'var(--cinema-gold)', borderRadius: 9999, fontSize: '0.7rem' }}
            >
              SOON
            </div>
          ) : (
            <div className="movie-badge-glass text-light" style={{ fontSize: '0.72rem' }}>
              <Clock size={11} className="text-secondary" /> {movie.durationMin}m
            </div>
          )}
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-3 d-flex flex-column flex-grow-1 justify-content-between">
        <div>
          {/* Genre micro-pills */}
          <div className="d-flex flex-wrap gap-1 mb-2">
            {movie.genres?.slice(0, 2).map((genre, idx) => (
              <span
                key={idx}
                className="badge bg-white bg-opacity-10 text-light fw-normal"
                style={{ fontSize: '0.68rem', padding: '3px 8px', borderRadius: 9999 }}
              >
                {genre}
              </span>
            ))}
            <span
              className="badge bg-white bg-opacity-10 text-secondary fw-normal"
              style={{ fontSize: '0.68rem', padding: '3px 8px', borderRadius: 9999 }}
            >
              {movie.language}
            </span>
          </div>

          {/* Title */}
          <Link to={`/movies/${movie._id}`} className="text-decoration-none">
            <h5
              className="text-white mb-2 text-truncate"
              title={movie.title}
              style={{ fontSize: '1.05rem', fontWeight: 700 }}
            >
              {movie.title}
            </h5>
          </Link>
        </div>

        {/* Repositioned Action Footer */}
        <div className="pt-2 mt-2 border-top border-white border-opacity-10 d-flex align-items-center justify-content-between gap-2">
          <Link
            to={`/movies/${movie._id}`}
            className="text-secondary small text-decoration-none d-flex align-items-center gap-1"
            style={{ fontSize: '0.8rem' }}
          >
            <span>Details</span>
          </Link>

          <Link
            to={`/movies/${movie._id}`}
            className={`btn btn-sm ${
              isComingSoon ? 'btn-cinema-outline' : 'btn-cinema'
            } px-3 py-1 d-flex align-items-center gap-1`}
            style={{ fontSize: '0.82rem' }}
          >
            {isComingSoon ? (
              <span>Notify Me</span>
            ) : (
              <>
                <Ticket size={14} />
                <span>Book</span>
                <ArrowUpRight size={13} />
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
