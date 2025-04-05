import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Spinner } from "../hook/spinner-utils";
import { formatDate } from "../hook/format-utils";

const API_URL = "https://api.bizchain.co.ke/v1/drawing";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

const DrawingLayer = () => {
  const [drawings, setDrawings] = useState([]);
  const [allDrawings, setAllDrawings] = useState([]); 
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClientSidePagination, setIsClientSidePagination] = useState(false); 
  const debouncedQuery = useDebounce(query, 300);

  const fetchDrawings = useCallback(async (page = 1, searchQuery = "") => {
    setIsLoading(true);
    setError(null);
    setDrawings([]);

    const token = sessionStorage.getItem("token");
    if (!token || token.trim() === "") {
      setError("No authentication token found. Please log in.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: page - 1,
          limit: itemsPerPage,
          searchValue: searchQuery,
          _t: new Date().getTime(),
        },
      });

      const result = response.data;
      console.log("Full API Response:", result);

      if (result.status.code === 0) {
        const mappedDrawings = (result.data || []).map((drawing) => ({
          id: drawing.id,
          drawCode: drawing.drawCode || "N/A",
          totalLitres: drawing.totalLitres || 0,
          productQty: drawing.productQty || 0,
          itemQty: drawing.itemQty || 0,
          dateCreated: drawing.dateCreated?.split("T")[0] || "N/A",
          createdBy: drawing.createdBy || "-",
        }));

        if (mappedDrawings.length > itemsPerPage || !result.totalElements) {
          setAllDrawings(mappedDrawings);
          setIsClientSidePagination(true);
          const startIndex = (page - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          setDrawings(mappedDrawings.slice(startIndex, endIndex));
          setTotalItems(mappedDrawings.length);
        } else {
          setDrawings(mappedDrawings);
          setIsClientSidePagination(false);
          setTotalItems(result.totalElements || mappedDrawings.length);
        }
      } else {
        setError(`Failed to fetch drawings: ${result.status.message}`);
        setDrawings([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching drawings:", error);
      setError(`Error fetching drawings: ${error.response?.data?.message || error.message}`);
      setDrawings([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchDrawings(currentPage, debouncedQuery);
  }, [currentPage, debouncedQuery, fetchDrawings]);

  const handleSearchInputChange = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      if (isClientSidePagination) {
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setDrawings(allDrawings.slice(startIndex, endIndex));
      }
    }
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <form className="navbar-search">
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              name="search"
              placeholder="Search Drawings"
              value={query}
              onChange={handleSearchInputChange}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
        </div>
        <Link
          to="/drawing/draw-request"
          className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
        >
          Draw Request
        </Link>
      </div>

      <div className="card-body p-24">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="table-responsive scroll-sm">
          <table className="table table-borderless sm-table mb-0">
            <thead>
              <tr>
                <th scope="col" className="text-center py-3 px-6">#</th>
                <th scope="col" className="text-start py-3 px-4">Draw Code</th>
                <th scope="col" className="text-start py-3 px-4">Total Litres</th>
                <th scope="col" className="text-start py-3 px-4">Number of Products</th>
                <th scope="col" className="text-start py-3 px-4">Total Items</th>
                <th scope="col" className="text-start py-3 px-4">Drawn Date</th>
                <th scope="col" className="text-start py-3 px-4">Drawn By</th>
                <th scope="col" className="text-start py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="text-center py-3">
                    <Spinner />
                  </td>
                </tr>
              ) : drawings.length > 0 ? (
                drawings.map((drawing, index) => {
                  const itemNumber = (currentPage - 1) * itemsPerPage + index + 1;
                  return (
                    <tr key={drawing.id} style={{ transition: "background-color 0.2s" }}>
                      <td className="text-center small-text py-3 px-6">{itemNumber}</td>
                      <td className="text-start small-text py-3 px-4">{drawing.drawCode}</td>
                      <td className="text-start small-text py-3 px-4">{drawing.totalLitres}</td>
                      <td className="text-start small-text py-3 px-4">{drawing.productQty}</td>
                      <td className="text-start small-text py-3 px-4">{drawing.itemQty}</td>
                      <td className="text-start small-text py-3 px-4">{formatDate(drawing.dateCreated)}</td>
                      <td className="text-start small-text py-3 px-4">
                        {drawing.createdBy.name || drawing.createdBy}
                      </td>
                      <td className="text-start small-text py-3 px-4">
                        <div className="action-dropdown">
                          <div className="dropdown">
                            <button
                              className="btn btn-outline-secondary btn-sm dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                            >
                              Actions
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <Link
                                  className="dropdown-item"
                                  to="/drawing/draw-details"
                                  state={{ drawingId: drawing.id }}
                                >
                                  View
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-3">
                    No drawings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && totalItems > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="text-muted" style={{ fontSize: "13px" }}>
              <span>
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
              </span>
            </div>
            <nav aria-label="Page navigation">
              <ul className="pagination mb-0" style={{ gap: "6px" }}>
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "24px", height: "24px", padding: "0", transition: "all 0.2s" }}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <Icon icon="ri-arrow-drop-left-line" style={{ fontSize: "12px" }} />
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                    <button
                      className={`page-link btn ${
                        currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"
                      } rounded-circle d-flex align-items-center justify-content-center`}
                      style={{
                        width: "30px",
                        height: "30px",
                        padding: "0",
                        transition: "all 0.2s",
                        fontSize: "10px",
                        color: currentPage === i + 1 ? "#fff" : "",
                      }}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "24px", height: "24px", padding: "0", transition: "all 0.2s" }}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <Icon icon="ri-arrow-drop-right-line" style={{ fontSize: "12px" }} />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrawingLayer;