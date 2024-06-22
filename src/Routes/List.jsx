import { useState, useEffect } from "react";
import api from "../ApiConnect/connect";
import { Container, Row } from "react-bootstrap";
import Loader from "../Components/Spinner";
import { saveAs } from "file-saver";
import ItemsPerPageSelector from "../Components/ListPage/ItemsPerPageSelector";
import ExportButton from "../Components/ListPage/ExportButton";
import TableData from "../Components/ListPage/TableData";
import Pagination from "../Components/ListPage/Pagination";
import ModalCustom from "../Components/ListPage/Modal";

const List = () => {
  const [results, setResults] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [getid, setGetid] = useState();
  const [prevPage, setPrevPage] = useState(1);
  const [take, setTake] = useState(15);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [id, setId] = useState();

  function getFullDate() {
    const date = new Date();
    const todayDate = date.getDate();
    const todayMonth = date.getMonth() + 1;
    const fullYear = date.getFullYear();
    return todayDate + "_" + todayMonth + "_" + fullYear;
  }

  const fetchResults = async (cursor) => {
    setLoading(true);
    try {
      const response = await api.get("/list-results", {
        params: {
          cursor: cursor,
          take: take,
        },
      });
      if (response.data && response.data.results) {
        const { resultsLength, results } = response.data;

        setResults(results);
        setTotalRecords(resultsLength);
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

  const handleItemsPerPageChange = (event) => {
    setTake(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleCheckboxChange = (id, event) => {
    if (id === "selectAll") {
      if (event.target.checked) {
        const visibleIds = results.map((item) => item.id);
        setSelectedItems([...new Set([...selectedItems, ...visibleIds])]);
      } else {
        const visibleIds = results.map((item) => item.id);
        setSelectedItems(
          selectedItems.filter((item) => !visibleIds.includes(item))
        );
      }
      setSelectAll(event.target.checked);
    } else {
      if (selectedItems.includes(id)) {
        setSelectedItems(selectedItems.filter((item) => item !== id));
      } else {
        setSelectedItems([...selectedItems, id]);
      }
    }
  };

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [take]);

  const exportToCsv = async () => {
    try {
      let exportData;
      if (selectedItems.length > 0) {
        exportData = results.filter((item) => selectedItems.includes(item.id));
      } else {
        const response = await api.get(`/allresults`);
        exportData = response.data.results;
      }
      console.log(exportData);
      let csvContent = "";

      const headerRow = Object.keys(exportData[0]).join(";");
      csvContent += headerRow + "\n";

      exportData.forEach((row) => {
        const rowData = Object.values(row).map((value) => {
          return JSON.stringify(
            value !== null && value !== undefined ? value : "N/A"
          );
        });
        csvContent += rowData.join(";") + "\n";
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      saveAs(blob, getFullDate() + "_fulldata.csv");
    } catch (error) {
      console.error("Error exporting data:", error);
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

  const handleFetchError = (error) => {
    alert("An error occurred while fetching results. Please try again.", error);
  };

  const totalPages = Math.ceil(totalRecords / take);

  const handleRowClick = async (id, event) => {
    if (event.target.type === "checkbox" || event.target.id === "box") {
      return;
    }
    setModalShow(true);
    setId(id);
    try {
      const response = await api.get(`/list-results/${id}`);
      setSelectedRecord(JSON.parse(response.data.data));
    } catch (error) {
      console.error("Error fetching record details:", error);
    }
  };

  useEffect(() => {
    const visibleIds = results.map((item) => item.id);
    setSelectAll(visibleIds.every((id) => selectedItems.includes(id)));
  }, [selectedItems]);

  const startIndex = (currentPage - 1) * take + 1;
  const endIndex = Math.min(currentPage * take, totalPages);
  return (
    <Container>
      <Container className="col-lg-10 mx-auto">
        <Container className="card-body p-5 bg-white rounded">
          <h1>Table Data</h1>
          <Container className="table-responsive">
            <Row style={{ paddingRight: "13px" }} className="mb-2">
              <div className="col-sm-12 col-md-6">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignContent: "space-between",
                  }}
                >
                  <ItemsPerPageSelector
                    take={take}
                    handleItemsPerPageChange={handleItemsPerPageChange}
                  />
                </div>
              </div>
              <div className="col-sm-12 col-md-6 d-flex justify-content-end">
                <ExportButton exportToCsv={exportToCsv} />
              </div>
            </Row>
            {!loading ? (
              <>
                <Row className="col-sm-12">
                  <TableData
                    results={results}
                    handleCheckboxChange={handleCheckboxChange}
                    selectedItems={selectedItems}
                    handleRowClick={handleRowClick}
                    selectAll={selectAll}
                    setSelectAll={setSelectAll}
                  />
                </Row>
                <Row className="align-items-center">
                  <div className="col-sm-12 col-md-5">
                    <div className="dataTables_info col">
                      Showing {startIndex} to {endIndex} of {totalRecords}{" "}
                      results
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-7 dataTables_paginate">
                    <Pagination
                      totalPages={totalPages}
                      currentPage={currentPage}
                      handlePageChange={handlePageChange}
                    />
                  </div>
                </Row>
              </>
            ) : (
              <Loader />
            )}
            <ModalCustom
              show={modalShow}
              onHide={() => setModalShow(false)}
              data={selectedRecord}
              id={id}
            />
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

export default List;
