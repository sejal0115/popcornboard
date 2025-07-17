import { useEffect, useState } from 'react';

const MovieCard = ({ movie, onClick, onRemoveFavorite }) => {
    const { id, title, vote_average, poster_path, original_language, release_date } = movie;
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
        setIsFavorite(storedFavorites.includes(id));
    }, [id]);

    const toggleFavorite = () => {
        const storedFavorites = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
        let updatedFavorites;

        if (isFavorite) {
            updatedFavorites = storedFavorites.filter(movieId => movieId !== id);
            if (onRemoveFavorite) onRemoveFavorite(id); // ✅ trigger the callback
        } else {
            updatedFavorites = [...storedFavorites, id];
        }

        localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
        setIsFavorite(!isFavorite);
    };

    return (
        <div
            className="movie-card cursor-pointer relative group w-full max-w-[250px] sm:max-w-none mx-auto sm:mx-0"
            onClick={onClick}
        >
            <img
                src={
                    poster_path
                        ? `https://image.tmdb.org/t/p/w500/${poster_path}`
                        : 'src/assets/no-movie.png'
                }
                alt={title}
                className="w-full h-auto rounded-md object-cover shadow-md transition-transform duration-300 group-hover:scale-[1.02]"
            />

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite();
                }}
                className="absolute bottom-3 right-2 text-xl sm:text-2xl z-10 text-red-500 hover:scale-110 transition-transform cursor-pointer"
            >
                {isFavorite ? '❤️' : '🤍'}
            </button>

            <div className="mt-3 sm:mt-4 px-1">
                <h3 className="text-sm sm:text-base font-medium text-gray-100 line-clamp-2">
                    {title}
                </h3>

                <div className="content flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-400 mt-1">
                    <div className="flex items-center gap-1">
                        <img src="star.svg" alt="Star Icon" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                    </div>

                    <span className="hidden sm:inline">•</span>
                    <p className="lang uppercase">{original_language}</p>

                    <span className="hidden sm:inline">•</span>
                    <p className="year">{release_date ? release_date.split('-')[0] : 'N/A'}</p>
                </div>
            </div>
        </div>

    );
};

export default MovieCard;
