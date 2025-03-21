import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import toast, { Toaster } from "react-hot-toast";
import { formatDate } from "../hook/format-utils";
import { Spinner } from "../hook/spinner-utils";

const API_URL = "https://api.bizchain.co.ke/v1/stock-requests";

const StockRequestLayer = () => {
  const [requests, setRequests] = useState([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState({}); // Per-request loading state
  const [error, setError] = useState(null);
  const [requestToDelete, setRequestToDelete] = useState(null);

  const fetchStockRequests = useCallback(
    async (page = 1, searchQuery = "") => {
      setIsLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found.");
        const params = {
          page: page - 1,
          size: itemsPerPage,
          searchValue: searchQuery,
          status: "PEND",
          _t: new Date().getTime(), // Cache-busting
        };
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });

        const responseData = response.data;
        if (responseData.status.code === 0) {
          const data = responseData.data || [];
          setRequests(data);
          setTotalItems(responseData.totalElements || data.length);
        } else {
          throw new Error(responseData.status.message || "Failed to fetch stock requests.");
        }
      } catch (error) {
        console.error("Error fetching stock requests:", error);
        setError(error.message || "Failed to fetch stock requests. Please try again.");
        setRequests([]);
        toast.error(error.message || "Failed to fetch stock requests.");
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage]
  );

  useEffect(() => {
    fetchStockRequests(currentPage, query);
  }, [currentPage, query, fetchStockRequests]);

  const handleSearchInputChange = (e) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleApproveClick = async (requestId) => {
    setLoadingRequests((prev) => ({ ...prev, [requestId]: true }));
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found. Please log in again.");

      const response = await axios.put(
        `${API_URL}/approve/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status.code === 0) {
        toast.success("Stock request approved successfully!");
        setTimeout(() => fetchStockRequests(currentPage, query), 500); // Slight delay for server sync
      } else {
        throw new Error(response.data.status.message || "Approval failed");
      }
    } catch (error) {
      console.error("Error approving stock request:", error);
      if (error.response) {
        toast.error(`Approval failed: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        toast.error("Network error: Could not reach the server.");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setLoadingRequests((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const handleDeleteClick = (request) => {
    setRequestToDelete(request);
  };

  const handleDeleteConfirm = async () => {
    if (!requestToDelete) return;
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");
      await axios.delete(`${API_URL}/${requestToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequestToDelete(null);
      fetchStockRequests(currentPage, query);
      toast.success("Stock request deleted successfully!");
    } catch (error) {
      console.error("Error deleting stock request:", error);
      toast.error(error.message || "Failed to delete stock request.");
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="card h-100 p-0 radius-12">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          success: { style: { background: "#d4edda", color: "#155724" } },
          error: { style: { background: "#f8d7da", color: "#721c24" } },
        }}
      />
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <form className="navbar-search">
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              name="search"
              placeholder="Search Pending Stock Requests"
              value={query}
              onChange={handleSearchInputChange}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
        </div>
      </div>

      <div className="card-body p-24">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="table-responsive scroll-sm">
          <table className="table table-borderless sm-table mb-0">
            <thead>
              <tr>
                <th scope="col" className="text-center py-3 px-6">#</th>
                <th scope="col" className="text-start py-3 px-4">Depot</th>
                <th scope="col" className="text-start py-3 px-4">Order Code</th>
                <th scope="col" className="text-start py-3 px-4">No. Products</th>
                <th scope="col" className="text-start py-3 px-4">Status</th>
                <th scope="col" className="text-start py-3 px-4">Date Created</th>
                <th scope="col" className="text-start py-3 px-4">Created By</th>
                <th scope="col" className="text-start py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="text-center py-3">
                    <Spinner />
                  </td>
                </tr>
              ) : requests.length > 0 ? (
                requests.map((request, index) => (
                  <tr key={request.id} style={{ transition: "background-color 0.2s" }}>
                    <td className="text-center small-text py-3 px-6">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="text-start small-text py-3 px-4">{request.depot.name}</td>
                    <td className="text-start small-text py-3 px-4">{request.orderCode}</td>
                    <td className="text-start small-text py-3 px-4">{request.products}</td>
                    <td className="text-start small-text py-3 px-4">
                      <span className="bg-warning-focus text-warning-600 px-24 py-4 radius-8 fw-medium text-sm">
                        {request.status.name}
                      </span>
                    </td>
                    <td className="text-start small-text py-3 px-4">
                      {formatDate(request.dateCreated) || "N/A"}
                    </td>
                    <td className="text-start small-text py-4 px-4">{request.createdBy.name}</td>
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
                                to={`/stock-request/view/${request.id}`}
                              >
                                View Details
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item"
                                to={`/stock-request/edit/${request.id}`}
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-success"
                                onClick={() => handleApproveClick(request.id)}
                                disabled={loadingRequests[request.id]}
                              >
                                {loadingRequests[request.id] ? (
                                  <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                ) : (
                                  "Approve"
                                )}
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(request)}
                                data-bs-toggle="modal"
                                data-bs-target="#deleteModal"
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
                  <td colSpan="8" className="text-center py-3">
                    No pending stock requests found
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

      {/* Delete Confirmation Modal */}
      <div className="modal fade" id="deleteModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body pt-3 ps-18 pe-18">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="modal-title fs-6">Delete Stock Request</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <p className="pb-3 mb-0">
                Are you sure you want to delete the stock request{" "}
                <strong>{requestToDelete?.orderCode}</strong> permanently? This action cannot be
                undone.
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

export default StockRequestLayer;