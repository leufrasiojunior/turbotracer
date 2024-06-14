import { useState, useEffect } from "react";
import api from "../ApiConnect/connect";
import { Container, Row } from "react-bootstrap";
import { saveAs } from "file-saver";
import { BsFiletypeCsv } from "react-icons/bs";
import { bpsToMbps } from "../functions/bpsToMbps";
import Loader from "../Components/Spinner";
import ModalCustom from "../Components/Modal";

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

  const currentData = results.slice(
    (currentPage - 1) * take,
    currentPage * take + take
  );

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
  }, []);

  const exportToCsv = async () => {
    try {
      let exportData;
      if (selectedItems.length > 0) {
        exportData = results.filter((item) => selectedItems.includes(item.id));
      } else {
        const response = await api.get(`/allresults`);
        exportData = response.data.results;
      }
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

  const handleRowClick = async (id, event) => {
    if (event.target.type === "checkbox" || event.target.id === "box") {
      return;
    }
    setModalShow(true);
    setId(id);
    try {
      const response = await api.get(`/specified/${id}`);
      setSelectedRecord(response.data);
    } catch (error) {
      console.error("Error fetching record details:", error);
    }
  };

  useEffect(() => {
    const visibleIds = currentData.map((item) => item.id);
    setSelectAll(visibleIds.every((id) => selectedItems.includes(id)));
  }, [currentData, selectedItems]);

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
                  <label
                    htmlFor="itemsPerPage"
                    className="d-flex align-items-center"
                  >
                    Show
                    <select
                      className="custom-select custom-select-sm form-control form-control-sm"
                      id="itemsPerPage"
                      value={take}
                      onChange={handleItemsPerPageChange}
                      style={{
                        display: "flex",
                        marginLeft: "7px",
                        marginRight: "7px",
                        paddingLeft: "8px",
                        paddingRight: "24px",
                        width: "49px !important",
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={15}>15</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    Entries
                  </label>
                </div>
              </div>
              <div className="col-sm-12 col-md-6 d-flex justify-content-end">
                <button
                  className="btn btn-secondary buttons-copy buttons-html5"
                  onClick={exportToCsv}
                >
                  <BsFiletypeCsv style={{ marginRight: "5px" }} />
                  Export as CSV
                </button>
              </div>
            </Row>
            {!loading ? (
              <>
                <Row className="col-sm-12">
                  <table
                    className="table dataTable no-footer table-hover text-center"
                    style={{ width: "100%" }}
                  >
                    <thead className="thead-light table-bordered">
                      <tr role="row">
                        <th
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            handleCheckboxChange("selectAll", {
                              target: { checked: !selectAll },
                            })
                          }
                        >
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={(event) =>
                              handleCheckboxChange("selectAll", event)
                            }
                          />
                        </th>
                        <th>ID</th>
                        <th>Download</th>
                        <th>Upload</th>
                        <th>Ping</th>
                        <th>Status</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results &&
                        results.map((item) => (
                          <tr
                            key={item.id}
                            onClick={(event) =>
                              item.status == "failed"
                                ? null
                                : item.status == "started"
                                ? null
                                : handleRowClick(item.id, event)
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <td
                              id="box"
                              onClick={(event) =>
                                handleCheckboxChange(item.id, event)
                              }
                            >
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={(event) =>
                                  handleCheckboxChange(item.id, event)
                                }
                              />
                            </td>
                            <td>
                              {item.id !== null && item.id !== undefined
                                ? item.id
                                : ""}
                            </td>
                            <td>
                              {item.download !== null &&
                              item.download !== undefined
                                ? bpsToMbps(item.download * 8).toFixed(2)
                                : ""}
                            </td>
                            <td>
                              {item.upload !== null && item.upload !== undefined
                                ? bpsToMbps(item.upload * 8).toFixed(2)
                                : ""}
                            </td>
                            <td>
                              {item.ping !== null && item.ping !== undefined
                                ? item.ping.toFixed(2)
                                : ""}
                            </td>
                            <td>
                              <div className="w-auto">
                                <div className="d-flex justify-content-center">
                                  <span
                                    className={
                                      item.status === "completed"
                                        ? "ring-inset CustomFontSize ring-1 ring-custom-600/10 custom-success-text custom-success-bg pb-1 pt-1 px-2"
                                        : item.status === "failed"
                                        ? "text-custom-600 ring-inset ring-1 bg-custom-50 ring-custom-600/10 CustomFontSize pb-1 pt-1 px-2"
                                        : item.status === "started"
                                        ? "text-custom-600 ring-inset CustomFontSize ring-1 ring-custom-600/10 custom-success-text custom-success-bg pb-1 pt-1 px-2"
                                        : "text-custom-600"
                                    }
                                    style={{
                                      borderRadius: ".375rem",
                                      "--c-50":
                                        item.status === "completed"
                                          ? "var(--success-50)"
                                          : item.status === "failed"
                                          ? "var(--danger-50)"
                                          : item.status === "started"
                                          ? "var(--warning-50)"
                                          : "",
                                      "--c-400":
                                        item.status === "completed"
                                          ? "var(--success-400)"
                                          : item.status === "failed"
                                          ? "var(--danger-400)"
                                          : item.status === "started"
                                          ? "var(--warning-400)"
                                          : "",
                                      "--c-600":
                                        item.status === "completed"
                                          ? "var(--success-600)"
                                          : item.status === "failed"
                                          ? "var(--danger-600)"
                                          : item.status === "started"
                                          ? "var(--warning-600)"
                                          : "",
                                    }}
                                  >
                                    {item.status !== null &&
                                    item.status !== undefined
                                      ? item.status
                                      : ""}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              {item.created_at !== null &&
                              item.created_at !== undefined
                                ? new Date(item.created_at).toLocaleString()
                                : "N/A"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </Row>
                <Row className="align-items-center">
                  <div className="col-sm-12 col-md-5">
                    <div className="dataTables_info col">
                      Showing {startIndex} to {endIndex} of {results.length}{" "}
                      results
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-7 dataTables_paginate ">
                    <div className="d-flex justify-content-end">
                      <button
                        onClick={() =>
                          handlePageChange(Math.max(currentPage - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="btn btn-primary active marginRight"
                      >
                        Anterior
                      </button>
                      <span>{renderPagination()}</span>
                      <button
                        onClick={() =>
                          handlePageChange(
                            Math.min(currentPage + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="btn btn-primary active"
                      >
                        Próxima
                      </button>
                    </div>
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
