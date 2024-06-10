import { useState, useEffect } from "react";
import api from "../ApiConnect/connect";

const List = () => {
  const [results, setResults] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [getid, setGetid] = useState();
  const [prevPage, setPrevPage] = useState(1);

  let take = 10;

  const fetchResults = async (cursor = null) => {
    setLoading(true);
    try {
      const response = await api.get("/allresults", {
        params: {
          cursor: cursor,
          take: take,
        },
      });
      if (response.data && response.data.results) {
        const { resultsLength, nextCursor, results } = response.data;

        setResults(results);
        setTotalRecords(resultsLength);
        setNextCursor(nextCursor);
        if (results.length > 0) {
          const lastId = results[0].id;
          setGetid(lastId);
        } else {
          setGetid(null);
        }
      } else {
        console.error("Dados de resposta inválidos:", response.data);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const loadMore = () => {
    if (nextCursor) {
      fetchResults(getid - 1);
    }
  };
  const handlePageChange = (page) => {
    if (isNaN(page) || page < 0) {
      console.error("Page must be a non-negative number.");
      return;
    }
    const previousPage = prevPage;
    if (isNaN(previousPage) || isNaN(take)) {
      console.error("Previous page and take must be valid numbers.");
      return;
    }
    setPrevPage(page);
    let nextPageCursor;
    try {
      if (page < previousPage) {
        nextPageCursor = previousPage * take - page * take;
        fetchResults(getid + nextPageCursor);
      } else if (page > previousPage) {
        nextPageCursor = page * take - previousPage * take;
        fetchResults(getid - nextPageCursor);
      }
    } catch (error) {
      console.error("Failed to fetch results:", error);
      handleFetchError(error);
    }
    setCurrentPage(page);
  };

  // Função para lidar com erros na busca de resultados
  const handleFetchError = (error) => {
    // Implemente a lógica de fallback aqui, por exemplo:
    alert("An error occurred while fetching results. Please try again.");
  };

  const totalPages = Math.ceil(totalRecords / take);

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
    <div>
      <h1>Results</h1>
      <p>Total Records: {totalRecords}</p>
      <p>total Pages: {totalPages}</p>
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.id}</li>
        ))}
      </ul>
      {loading && <p>Loading...</p>}
      {nextCursor && !loading && <button onClick={loadMore}>Load More</button>}
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
          onClick={() =>
            handlePageChange(Math.min(currentPage + 1, totalRecords))
          }
          disabled={currentPage === totalPages}
          className="btn btn-primary active"
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

export default List;
