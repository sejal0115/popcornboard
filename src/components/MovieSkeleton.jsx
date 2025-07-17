import React from 'react';

const MovieSkeleton = () => {
    return (
        <div className="animate-pulse bg-gray-800 rounded-md p-2 w-[180px] h-[280px] flex-shrink-0 flex flex-col gap-2">
            <div className="bg-gray-700 h-[200px] rounded-md w-full" />
            <div className="h-4 bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-700 rounded w-1/2" />
        </div>
    );
};

export default MovieSkeleton;
