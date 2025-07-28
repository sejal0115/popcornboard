import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MovieModal = ({ movie, onClose }) => {
    const [watchProviders, setWatchProviders] = useState(null);
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

    if (!movie) return null;

    const {
        id,
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

    // 🔥 Fetch Watch Providers
    useEffect(() => {
        const fetchWatchProviders = async () => {
            try {
                const res = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}/watch/providers`,
                    {
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${API_KEY}`
                        }
                    }
                );

                const data = await res.json();
                // console.log('All Region Providers:', data.results);

                //  Allowed regions in priority order
                const allowedRegions = ["IN", "US", "GB", "CA", "AU"];

                let selectedRegion = null;
                for (let region of allowedRegions) {
                    const details = data.results[region];
                    if (
                        details &&
                        (details.flatrate?.length > 0 ||
                            details.rent?.length > 0 ||
                            details.buy?.length > 0)
                    ) {
                        selectedRegion = region;
                        break;
                    }
                }

                if (selectedRegion) {
                    const details = data.results[selectedRegion];

                    const combinedProviders = [
                        ...(details.flatrate || []),
                        ...(details.rent || []),
                        ...(details.buy || [])
                    ];

                    const uniqueProviders = Array.from(
                        new Map(combinedProviders.map(p => [p.provider_id, { ...p, region: selectedRegion, link: details.link }])).values()
                    );

                    setWatchProviders(uniqueProviders);
                } else {
                    setWatchProviders(null);
                }
            } catch (error) {
                console.error('Error fetching watch providers:', error);
            }
        };

        fetchWatchProviders();
    }, [id, API_KEY]);



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
                    {/* Close Button */}
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
                            {/* Title */}
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

                            {/* Genres */}
                            {genres?.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {genres.map((g, i) => (
                                        <span key={i} className="bg-white/10 px-3 py-1 rounded-full text-sm text-white">
                                            {g.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Tagline */}
                            {tagline && (
                                <p className="italic text-purple-400 text-sm">“{tagline}”</p>
                            )}

                            {/* Overview */}
                            <p className="text-sm text-white cursor-context-menu">{overview}</p>

                            {/* Official Site */}
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

                            {/* 🎬 Watch Now Section */}
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-2">Watch Now</h3>
                                {watchProviders ? (
                                    <div className="flex flex-wrap gap-4">
                                        {watchProviders.map((provider, index) => (
                                            <a
                                                key={`${provider.provider_id}-${index}`}
                                                href={provider.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={`Watch on ${provider.provider_name} (${provider.region})`}
                                            >
                                                <img
                                                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                                    alt={provider.provider_name}
                                                    className="w-12 h-12 rounded hover:scale-110 transition-transform"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-sm">Not available for streaming anywhere.</p>
                                )}
                            </div>

                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MovieModal;
