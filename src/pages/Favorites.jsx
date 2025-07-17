import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        Authorization: `Bearer ${API_KEY}`,
        accept: 'application/json',
    }
}

const Favorites = () => {
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const favoriteIds = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

        const fetchFavorites = async () => {
            try {
                setLoading(true); // Start loading
                const responses = await Promise.all(
                    favoriteIds.map(id =>
                        fetch(`${API_BASE_URL}/movie/${id}?language=en-US`, API_OPTIONS)
                    )
                );
                const movies = await Promise.all(responses.map(res => res.json()));
                setFavoriteMovies(movies);
            } catch (error) {
                console.error('Error fetching favorite movies:', error);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchFavorites();
    }, []);

    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <Link to="/" className="inline-block w-max">
                    <img
                        className="backdrop-blur-md bg-white/10 cursor-pointer duration-300 hover:bg-white/20 px-4 py-2 rounded-md shadow-md transition-all"
                        src="arrow-left-tiny.svg"
                        alt="Left arrow"
                    />
                </Link>

                <h1 className="text-xl sm:text-2xl font-bold ml-0 sm:ml-4 text-center sm:text-left">
                    Favorites Collection
                </h1>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-[60vh]">
                    <Spinner />
                </div>
            ) : (
                <>
                    {favoriteMovies.length > 0 && (
                        <p className="text-gray-500 text-sm mt-2 ml-1 flex justify-end items-center text-right">
                            You’ve saved {favoriteMovies.length} {favoriteMovies.length === 1 ? 'movie' : 'movies'}.
                        </p>
                    )}

                    {favoriteMovies.length === 0 ? (
                        <div className="text-center mt-10 px-4">
                            <p className="text-lg sm:text-xl text-gray-500 font-medium">
                                You haven’t added any favorites yet.
                            </p>
                            <p className="text-sm sm:text-md text-gray-400 mt-2">
                                Browse movies and tap the <span className="text-red-400">❤️</span> icon to save your favorites here.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 mt-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {favoriteMovies.map(movie => (
                                <MovieCard
                                    key={movie.id}
                                    movie={movie}
                                    onRemoveFavorite={id => {
                                        setFavoriteMovies(prev => prev.filter(m => m.id !== id));
                                        const updatedIds = JSON.parse(localStorage.getItem('favoriteMovies'))?.filter(fid => fid !== id);
                                        localStorage.setItem('favoriteMovies', JSON.stringify(updatedIds));
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>


    );
};

export default Favorites;
