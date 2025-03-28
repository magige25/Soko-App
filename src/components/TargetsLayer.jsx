import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";

const API_URL = "https://api.bizchain.co.ke/v1/targets";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

const TargetsLayer = () => {
  const [targets, setTargets] = useState([]);
  const [query, setQuery] = useState("");
  const [targetToDelete, setTargetToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const debouncedQuery = useDebounce(query, 300);

  const fetchTargets = useCallback(async (page = 1, searchQuery = "") => {
    setIsLoading(true);
    setError(null);
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
          page: page,
          limit: itemsPerPage,
          searchValue: searchQuery,
        },
      });
      const result = response.data;
      if (result.status.code === 0) {
        const currentDate = new Date();
        const mappedTargets = result.data.map((target) => {
          const endDate = new Date(target.endDate);
          const status = endDate < currentDate ? "Closed" : "Active";
          return {
            id: target.id,
            salesperson: target.salesperson.name,
            target: target.target || 0,
            targetType: target.targetType.name,
            achieved: target.achievement || 0,
            startDate: target.startDate?.split("T")[0] || "N/A",
            endDate: target.endDate?.split("T")[0] || "N/A",
            status: status,
          };
        });
        setTargets(mappedTargets);
        setTotalItems(result.totalElements);
      } else {
        setError(`Failed to fetch targets: ${result.status.message}`);
        setTargets([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching targets:", error);
      setError(`Error fetching targets: ${error.response?.data?.message || error.message}`);
      setTargets([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchTargets(currentPage, debouncedQuery);
  }, [currentPage, debouncedQuery, fetchTargets]);

  const handleDeleteClick = (target) => {
    setTargetToDelete(target);
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    setError(null);
    const token = sessionStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      setIsLoading(false);
      return;
    }
    try {
      await axios.delete(`${API_URL}/${targetToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTargetToDelete(null);
      fetchTargets(currentPage, debouncedQuery);
    } catch (error) {
      console.error("Error deleting target:", error);
      setError(error.response?.data?.message || "Failed to delete target.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
    setCurrentPage(1);
  };

  const formatValue = (value, targetType) => {
    if (targetType === "Sales") {
      return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(value || 0);
    }
    return value || 0;
  };

  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getFullYear();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";
    return `${day}${suffix} ${month} ${year}`;
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
              placeholder="Search Salesperson"
              value={query}
              onChange={handleSearchInputChange}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
        </div>
        <Link
          to="/targets/add-target"
          className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
        >
          <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
          Add New Target
        </Link>
      </div>

      <div className="card-body p-24">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="table-responsive scroll-sm">
          <table className="table table-borderless sm-table mb-0">
            <thead>
              <tr>
                <th scope="col" className="text-center py-3 px-6">#</th>
                <th scope="col" className="text-start py-3 px-4">Salesperson</th>
                <th scope="col" className="text-start py-3 px-4">Target</th>
                <th scope="col" className="text-start py-3 px-4">Target Type</th>
                <th scope="col" className="text-start py-3 px-4">Achieved</th>
                <th scope="col" className="text-start py-3 px-4">Start Date</th>
                <th scope="col" className="text-start py-3 px-4">End Date</th>
                <th scope="col" className="text-start py-3 px-4">Status</th>
                <th scope="col" className="text-start py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="text-center py-3">
                    <div>
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : targets.length > 0 ? (
                targets.map((target, index) => (
                  <tr key={target.id} style={{ transition: "background-color 0.2s" }}>
                    <td className="text-center small-text py-3 px-6">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="text-start small-text py-3 px-4">{target.salesperson}</td>
                    <td className="text-start small-text py-3 px-4">{formatValue(target.target, target.targetType)}</td>
                    <td className="text-start small-text py-3 px-4">{target.targetType}</td>
                    <td className="text-start small-text py-3 px-4">{formatValue(target.achieved, target.targetType)}</td>
                    <td className="text-start small-text py-3 px-4">{formatDate(target.startDate)}</td>
                    <td className="text-start small-text py-3 px-4">{formatDate(target.endDate)}</td>
                    <td className="text-start small-text py-3 px-4">
                      <span
                        className={`bg-${
                          target.status === "Closed" ? "danger-focus" : "success-focus"
                        } text-${
                          target.status === "Closed" ? "danger-600" : "success-600"
                        } px-24 py-4 radius-8 fw-medium text-sm`}
                      >
                        {target.status}
                      </span>
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
                                to="/targets/details"
                                state={{ targetId: target.id }}
                              >
                                Details
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item"
                                to="/targets/edit-target"
                                state={{ targetId: target.id }}
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(target)}
                                data-bs-toggle="modal"
                                data-bs-target="#deleteTargetModal"
                              >
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-3">
                    No targets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && (
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

      <div className="modal fade" id="deleteTargetModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body pt-3 ps-18 pe-18">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="modal-title fs-6">Delete Target</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <p className="pb-3 mb-0">
                Are you sure you want to delete the target for{" "}
                <strong>{targetToDelete?.salesperson}</strong> permanently? This action cannot be undone.
              </p>
            </div>
            <div className="d-flex justify-content-end gap-2 px-12 pb-3">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TargetsLayer;