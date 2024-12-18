import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate page numbers with smart truncation
  const generatePageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    
    // Always show first page
    pages.push(1);

    // Add ellipsis and surrounding pages if current page is far from start
    if (currentPage > 3) {
      pages.push('...');
    }

    // Determine range of pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      if (!pages.includes('...')) {
        pages.push('...');
      }
    }

    // Always show last page
    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <nav className="flex justify-center mt-8">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 mr-2 rounded ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white text-blue-500 hover:bg-blue-100 border"
        }`}
      >
        Prev
      </button>

      {/* Page numbers */}
      <ul className="flex space-x-2">
        {pageNumbers.map((number, index) => (
          <li key={index}>
            {number === '...' ? (
              <span className="px-4 py-2">...</span>
            ) : (
              <button
                onClick={() => onPageChange(number)}
                className={`px-4 py-2 rounded ${
                  currentPage === number
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500 hover:bg-blue-100 border"
                }`}
              >
                {number}
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 ml-2 rounded ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white text-blue-500 hover:bg-blue-100 border"
        }`}
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;