import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MovieModal = ({ movie, onClose }) => {
    if (!movie) return null;

    const {
        title,
        original_title,
        release_date,
        genres,
        vote_average,
        vote_count,
        overview,
        poster_path,
        backdrop_path,
        homepage,
        tagline,
        original_language,
        popularity
    } = movie;

    const year = release_date?.split('-')[0];
    const language = original_language?.toUpperCase();
    const posterUrl = poster_path
        ? `https://image.tmdb.org/t/p/w500/${poster_path}`
        : 'src/assets/No-Poster1.png';

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="bg-zinc-900 text-white w-full max-w-4xl max-h-screen mx-2 sm:mx-4 rounded-xl shadow-2xl overflow-y-auto relative min-h-[60vh]"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-white text-3xl z-50 hover:text-red-400 transition cursor-pointer"
                        aria-label="Close Modal"
                    >
                        &times;
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <img
                            src={posterUrl}
                            alt={title}
                            className="bg-black w-full h-64 md:h-full object-contain md:object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                        />

                        <div className="p-4 md:p-6 space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold leading-tight cursor-context-menu">
                                {title}
                                {original_title && original_title !== title && (
                                    <span className="block text-sm text-gray-400">({original_title})</span>
                                )}
                                <span className="text-gray-400 text-xl block md:inline ml-2">({year})</span>
                            </h2>

                            <p className="text-sm text-gray-300 cursor-context-menu">
                                {language} • ⭐ {vote_average?.toFixed(1)} ({vote_count} votes) • 🔥 {Math.round(popularity)} popularity
                            </p>

                            {genres?.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {genres.map((g, i) => (
                                        <span key={i} className="bg-white/10 px-3 py-1 rounded-full text-sm text-white">
                                            {g.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {tagline && (
                                <p className="italic text-purple-400 text-sm">“{tagline}”</p>
                            )}

                            <p className="text-sm text-white cursor-context-menu">{overview}</p>

                            {homepage && (
                                <a
                                    href={homepage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition"
                                >
                                    Visit Official Site →
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>

    );
};

export default MovieModal;
