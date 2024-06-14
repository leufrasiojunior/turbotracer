/* eslint-disable react/prop-types */
const Pagination = ({ totalPages, currentPage, handlePageChange }) => {
  const renderPagination = () => {
    const pages = [];

    for (let i = 1; i <= Math.min(3, totalPages); i++) {
      pages.push(
        <button
          className="btn btn-primary marginRight"
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={i === currentPage}
        >
          {i}
        </button>
      );
    }

    const currentPageIndex = Math.min(Math.max(currentPage - 2, 4), totalPages);
    const lastPageIndex = Math.min(currentPageIndex + 2, totalPages);
    for (let i = currentPageIndex; i <= lastPageIndex; i++) {
      pages.push(
        <button
          className="btn btn-primary marginRight"
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={i === currentPage}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="d-flex justify-content-end">
      <button
        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="btn btn-primary active marginRight"
      >
        Anterior
      </button>
      <span>{renderPagination()}</span>
      <button
        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="btn btn-primary active"
      >
        Próxima
      </button>
    </div>
  );
};

export default Pagination;
