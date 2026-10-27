import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { movieApi } from '../api/movieApi';
import MovieCard from '../components/MovieCard';
import {
  Search,
  Sparkles,
  Flame,
  Play,
  ArrowRight,
  ShieldCheck,
  Ticket,
  Clock,
  Star,
  Compass,
} from 'lucide-react';

const FALLBACK_SHOWING = [
  {
    _id: 'm1',
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    language: 'English',
    durationMin: 166,
    rating: 8.6,
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    status: 'now_showing',
  },
  {
    _id: 'm2',
    title: 'Interstellar: Re-Release',
    description: 'When Earth becomes uninhabitable, a team of researchers travels through a wormhole in search of a new home for mankind.',
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    language: 'English',
    durationMin: 169,
    rating: 8.7,
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    status: 'now_showing',
  },
  {
    _id: 'm3',
    title: 'Cyberpunk: Neon City 2099',
    description: 'An elite rogue netrunner discovers an AI consciousness that can reshape human reality in a neon-drenched metropolis.',
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    language: 'English',
    durationMin: 142,
    rating: 8.7,
    posterUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=qIcTM8WXFjk',
    status: 'now_showing',
  },
  {
    _id: 'm4',
    title: 'Kalki 2898 AD',
    description: 'In a post-apocalyptic future, a mysterious warrior embarks on a mission to protect the unborn incarnation of Lord Vishnu.',
    genres: ['Sci-Fi', 'Action', 'Fantasy'],
    language: 'Hindi',
    durationMin: 181,
    rating: 8.2,
    posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=kQDd1AhGIHk',
    status: 'now_showing',
  },
  {
    _id: 'm5',
    title: 'Spider-Man: Across the Spider-Verse',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    genres: ['Animation', 'Action', 'Adventure'],
    language: 'English',
    durationMin: 140,
    rating: 8.8,
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
    status: 'now_showing',
  },
  {
    _id: 'm6',
    title: 'Deadpool & Wolverine',
    description: 'Deadpool recruits a reluctant Wolverine from another timeline to help save his universe from annihilation.',
    genres: ['Action', 'Comedy', 'Sci-Fi'],
    language: 'English',
    durationMin: 128,
    rating: 7.9,
    posterUrl: 'https://images.unsplash.com/photo-1568876694728-451bbf694b83?q=80&w=800&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=73_1biulkYk',
    status: 'now_showing',
  },
  {
    _id: 'm7',
    title: 'Joker: Folie à Deux',
    description: 'Arthur Fleck meets Harley Quinn in Arkham State Hospital, spiraling into a dramatic and chaotic journey together.',
    genres: ['Drama', 'Thriller'],
    language: 'English',
    durationMin: 138,
    rating: 7.3,
    posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=_OKAwz2NiJs',
    status: 'now_showing',
  },
  {
    _id: 'm8',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    language: 'English',
    durationMin: 148,
    rating: 8.8,
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    status: 'now_showing',
  },
];

const FALLBACK_COMING = [
  {
    _id: 'c1',
    title: 'The Batman: Part II',
    description: 'Bruce Wayne faces the corrupt criminal underworld of Gotham City as mysterious new adversaries emerge.',
    genres: ['Action', 'Crime', 'Drama'],
    language: 'English',
    durationMin: 168,
    rating: 8.5,
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    status: 'coming_soon',
  },
  {
    _id: 'c2',
    title: 'Avatar: Fire and Ash',
    description: 'Jake and Neytiri travel across unfamiliar regions of Pandora, coming into conflict with the Ash People.',
    genres: ['Action', 'Adventure', 'Fantasy'],
    language: 'English',
    durationMin: 195,
    rating: 8.9,
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    status: 'coming_soon',
  },
];

const Home = () => {
  const [nowShowing, setNowShowing] = useState(FALLBACK_SHOWING);
  const [comingSoon, setComingSoon] = useState(FALLBACK_COMING);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const navigate = useNavigate();

  const genres = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Animation', 'Thriller'];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [showingRes, comingRes] = await Promise.all([
          movieApi.getMovies({ status: 'now_showing', limit: 8 }),
          movieApi.getMovies({ status: 'coming_soon', limit: 4 }),
        ]);

        if (showingRes?.success && showingRes.data?.length > 0) {
          setNowShowing(showingRes.data);
        }
        if (comingRes?.success && comingRes.data?.length > 0) {
          setComingSoon(comingRes.data);
        }
      } catch (err) {
        // Fallback already pre-loaded gracefully
      }
    };

    fetchMovies();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const filteredShowing =
    selectedGenre === 'All'
      ? nowShowing
      : nowShowing.filter((m) => m.genres?.includes(selectedGenre));

  // Spotlight movie for hero banner
  const spotlightMovie = nowShowing[0] || null;

  return (
    <div className="home-page pb-5">
      {/* Dynamic Wide Hero Showcase */}
      {spotlightMovie && (
        <section className="position-relative overflow-hidden mb-5">
          <div
            className="position-relative d-flex align-items-center"
            style={{
              minHeight: '78vh',
              backgroundImage: `linear-gradient(to right, var(--bg-deep) 30%, rgba(9, 6, 20, 0.85) 60%, rgba(9, 6, 20, 0.45) 100%), radial-gradient(circle at 75% 25%, var(--border-glow) 0%, transparent 60%), url(${spotlightMovie.posterUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 25%',
            }}
          >
            <div className="container py-5 position-relative" style={{ zIndex: 2 }}>
              <div className="row align-items-center">
                <div className="col-lg-7 col-md-10">
                  {/* Floating Pill Tag */}
                  <div
                    className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3 fw-bold small"
                    style={{
                      background: 'rgba(139, 92, 246, 0.15)',
                      border: '1px solid var(--border-glow)',
                      color: 'var(--cinema-red)',
                    }}
                  >
                    <Flame size={14} /> SPOTLIGHT PREMIERE
                  </div>

                  <h1
                    className="display-4 fw-black text-white mb-3"
                    style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, lineHeight: 1.15 }}
                  >
                    {spotlightMovie.title}
                  </h1>

                  <p
                    className="lead text-secondary mb-4"
                    style={{ fontSize: '1.05rem', maxWidth: 600, lineHeight: 1.6 }}
                  >
                    {spotlightMovie.description}
                  </p>

                  {/* Highlights Row */}
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
                    <span
                      className="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill text-warning fw-bold small"
                      style={{ background: 'rgba(255, 184, 0, 0.12)', border: '1px solid rgba(255, 184, 0, 0.3)' }}
                    >
                      <Star size={14} fill="var(--cinema-gold)" />
                      {spotlightMovie.rating.toFixed(1)} / 10
                    </span>
                    <span
                      className="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill text-light small"
                      style={{ background: 'rgba(255, 255, 255, 0.08)' }}
                    >
                      <Clock size={13} className="text-secondary" />
                      {spotlightMovie.durationMin} mins
                    </span>
                    <span
                      className="px-3 py-1 rounded-pill text-light small"
                      style={{ background: 'rgba(255, 255, 255, 0.08)' }}
                    >
                      {spotlightMovie.language}
                    </span>
                    <span
                      className="px-3 py-1 rounded-pill text-secondary small"
                      style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                    >
                      {spotlightMovie.genres?.join(', ')}
                    </span>
                  </div>

                  {/* Repositioned Hero Action Controls */}
                  <div className="d-flex flex-wrap gap-3 align-items-center">
                    <Link
                      to={`/movies/${spotlightMovie._id}`}
                      className="btn btn-cinema btn-lg px-4 py-2"
                    >
                      <Ticket size={18} />
                      <span>Book Seats Now</span>
                    </Link>
                    {spotlightMovie.trailerUrl && (
                      <a
                        href={spotlightMovie.trailerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-cinema-outline btn-lg px-4 py-2"
                      >
                        <Play size={16} fill="#ffffff" />
                        <span>Watch Trailer</span>
                      </a>
                    )}
                    <Link
                      to="/movies"
                      className="text-secondary small fw-semibold text-decoration-none d-flex align-items-center gap-1 ms-2"
                    >
                      <span>Explore all shows</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Floating Search & Quick Filter Capsule */}
      <div className="container mb-5">
        <div className="glass-panel p-3 p-md-4">
          <div className="row g-3 align-items-center">
            {/* Search Input */}
            <div className="col-lg-5">
              <form onSubmit={handleSearchSubmit} className="position-relative">
                <Search
                  size={18}
                  className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"
                />
                <input
                  type="text"
                  className="form-control form-control-cinema ps-5"
                  placeholder="Quick search movies, cast, genres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* Quick Genre Selector Pills */}
            <div className="col-lg-7">
              <div className="d-flex gap-2 overflow-x-auto pb-1 align-items-center">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => setSelectedGenre(genre)}
                    className={`genre-pill ${selectedGenre === genre ? 'active' : ''}`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Now Showing Section */}
      <section className="container mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <div
              className="d-flex align-items-center gap-2 fw-bold small text-uppercase mb-1"
              style={{ color: 'var(--cinema-red)' }}
            >
              <Sparkles size={15} /> In Theatres Now
            </div>
            <h2 className="text-white fw-bold m-0">Now Showing</h2>
          </div>
          <Link
            to="/movies?status=now_showing"
            className="btn btn-cinema-outline btn-sm px-3 py-1"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status"></div>
            <p className="text-secondary mt-3">Loading shows...</p>
          </div>
        ) : filteredShowing.length === 0 ? (
          <div className="glass-panel p-5 text-center text-secondary">
            No movies match this genre filter right now.
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {filteredShowing.map((movie) => (
              <div key={movie._id} className="col">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Coming Soon Section */}
      {comingSoon.length > 0 && (
        <section className="container mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <div className="d-flex align-items-center gap-2 text-warning fw-bold small text-uppercase mb-1">
                <Compass size={15} /> Upcoming Releases
              </div>
              <h2 className="text-white fw-bold m-0">Coming Soon</h2>
            </div>
            <Link
              to="/movies?status=coming_soon"
              className="btn btn-cinema-outline btn-sm px-3 py-1"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {comingSoon.map((movie) => (
              <div key={movie._id} className="col">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Platform Features / Perks */}
      <section className="container">
        <div className="glass-panel p-4 p-md-5">
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div
                className="d-inline-flex p-3 rounded-circle mb-3"
                style={{
                  background: 'rgba(139, 92, 246, 0.15)',
                  color: 'var(--cinema-red)',
                  boxShadow: 'var(--shadow-glow-red)',
                }}
              >
                <Ticket size={28} />
              </div>
              <h5 className="text-white fw-bold mb-2">Atomic 5-Min Seat Hold</h5>
              <p className="text-secondary small mb-0">
                Zero race conditions. Once selected, your seats are locked exclusively to your account for 5 minutes during checkout.
              </p>
            </div>
            <div className="col-md-4">
              <div
                className="d-inline-flex p-3 rounded-circle mb-3"
                style={{
                  background: 'rgba(255, 184, 0, 0.15)',
                  color: 'var(--cinema-gold)',
                  boxShadow: '0 0 20px rgba(255, 184, 0, 0.25)',
                }}
              >
                <Sparkles size={28} />
              </div>
              <h5 className="text-white fw-bold mb-2">Instant QR Boarding Passes</h5>
              <p className="text-secondary small mb-0">
                Paperless digital e-tickets generated immediately with verified QR code scanning for contactless theater access.
              </p>
            </div>
            <div className="col-md-4">
              <div
                className="d-inline-flex p-3 rounded-circle mb-3"
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)',
                }}
              >
                <ShieldCheck size={28} />
              </div>
              <h5 className="text-white fw-bold mb-2">Easy Cancellations</h5>
              <p className="text-secondary small mb-0">
                Cancel any booking up to 2 hours before showtime with one click for an immediate release and simulated refund.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
