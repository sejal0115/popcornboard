

const Pagination = ({ currentPage, totalPages, onNext, onPrev }) => {
    return (
        <div className="flex gap-8 items-center justify-between px-4 py-2">
                {/* Left Arrow */}
                <button
                    onClick={onPrev}
                    disabled={currentPage === 1}
                    className="bg-[#151125] p-3 rounded-lg hover:bg-[#1e1933] transition disabled:opacity-30"
                >
                    <img src="arrow-left-tiny.svg" alt="Left arrow" />

                </button>

                {/* Page Info */}
                <span className="text-white text-lg">
                    <span className="text-white font-bold">{currentPage}</span>
                    <span className="text-gray-500"> / {totalPages}</span>
                </span>

                {/* Right Arrow */}
                <button
                    onClick={onNext}
                    disabled={currentPage === totalPages}
                    className="bg-[#151125] p-3 rounded-lg hover:bg-[#1e1933] transition disabled:opacity-30"
                >
                    <img src="arrow-right-tiny.svg" alt="Right arrow" />
                </button>
            </div>


    );
};

export default Pagination;
