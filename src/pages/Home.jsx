import React, { useEffect, useState, useRef } from 'react'
import Search from '../components/Search'
import heroImg from '../assets/hero-img.webp'
import Logo from '../assets/logo.webp'
import Spinner from '../components/Spinner';
import MovieCard from '../components/MovieCard';
import { useDebounce } from 'react-use';
import { updateSearchCount } from '../appwrite';
import MovieModal from '../components/MovieModal';
import Pagination from '../components/Pagination';
import MovieSkeleton from '../components/MovieSkeleton';
import { Link } from 'react-router-dom';



const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        Authorization: `Bearer ${API_KEY}`,
        accept: 'application/json',
    }
}

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [debounceSearchTerm, setDebounceSearchTerm] = useState('');
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [currentPage, setCurrentPage] = useState(2);
    const [totalPages, setTotalPages] = useState(50);
    const moviesSectionRef = useRef(null);
    const [showScrollToMovies, setShowScrollToMovies] = useState(false);


    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
            moviesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            moviesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);
    useDebounce(() => {
        setCurrentPage(1); // Reset to page 1 on new search
        setDebounceSearchTerm(searchTerm);
    }, 500, [searchTerm]);

    const fetchMovies = async (query = '', page = 1) => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;

            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error('Failed to fetch movies.')
            }

            const data = await response.json();

            // console.log("Movie Data", data);
            setTotalPages(Math.min(data.total_pages || 50, 50));

            if (!data.results || data.results.length === 0) {
                setErrorMessage("No movies found.");
                setMovieList([]);
                return;
            }

            setMovieList(data.results || [])
            if (query && data.results.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }

        } catch (error) {
            console.log(`Error fetching movies: ${error}`);
            setErrorMessage('Error fetching movies. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }

    const loadTrendingMovies = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/trending/movie/week`, // Use 'day' or 'week'
                API_OPTIONS
            );

            if (!response.ok) throw new Error('Failed to fetch trending movies.');

            const data = await response.json();
            console.log("Trending Movies:", data.results);

            setTrendingMovies(data.results.slice(0, 5)); // Show only top 5 trending
        } catch (error) {
            console.error(`Error fetching trending movies: ${error}`);
        }
    };


    useEffect(() => {
        fetchMovies(debounceSearchTerm, currentPage);
    }, [debounceSearchTerm, currentPage]);

    useEffect(() => {
        loadTrendingMovies();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const moviesOffset = moviesSectionRef.current?.offsetTop || 0;
            const scrollTop = window.scrollY;

            setShowScrollToMovies(scrollTop > moviesOffset + 600); // Show button after user scrolls 600px past .all-movies
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    return (
        <main>
            <div className="pattern" />
            <div className="wrapper">
                <img className="w-20 block" src={Logo} alt="Logo" />
                <header>
                    <img src={heroImg} alt="Hero banner" />
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                {trendingMovies.length > 0 && (
                    <section className="trending w-full">
                        <h2>🔥 Trending Movies</h2>
                        <ul>
                            {trendingMovies.map((movie, index) => (
                                <li key={movie.id} onClick={() => setSelectedMovie(movie)}>
                                    <p>{index + 1}</p>
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        alt={movie.title}
                                    />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}


                <section ref={moviesSectionRef} className='all-movies'>
                    <div className="flex gap-8 justify-between">
                        <h2>🎬 Popular</h2>
                        <Link to="/favorites">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm font-medium shadow hover:bg-white/20 transition-all duration-300 cursor-pointer">
                                <span>Favorites</span>
                                <span>❤️</span>
                            </div>
                        </Link>
                    </div>

                    {isLoading ? (
                        // <Spinner />
                        <div className="flex flex-wrap gap-4 justify-center">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <MovieSkeleton key={i} />
                            ))}
                        </div>
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (

                        <ul>
                            {movieList.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} onClick={() => setSelectedMovie(movie)} />
                            ))}
                        </ul>

                    )}
                </section>
            </div>

            {selectedMovie && (
                <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
            )}

            {showScrollToMovies && (
                <div
                    onClick={() =>
                        moviesSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
                    }
                    className="sticky bottom-0 z-20 bg-[#0f0c29]/60 backdrop-blur-sm"
                >
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onNext={handleNextPage}
                        onPrev={handlePrevPage}
                    />
                </div>
            )}


        </main>
    )
}

export default Home