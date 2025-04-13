import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Spinner } from "../hook/spinner-utils";
import { formatDate, formatCurrency } from "../hook/format-utils";
import { DatePicker } from "antd"; 
import dayjs from "dayjs"; 

const API_URL = "https://api.bizchain.co.ke/v1/supplier-deliveries";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

const DeliveriesLayer = () => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState(""); // Will store date as string or null
  const [endDate, setEndDate] = useState(""); // Will store date as string or null
  const [deliveryToDelete, setDeliveryToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);// Set items per page
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const debouncedQuery = useDebounce(query, 300);

  const fetchDeliveries = useCallback(
    async (page = 1, searchQuery = "", start = "", end = "") => {
      setIsLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem("token");
        const params = {
          page: page - 1,
          size: itemsPerPage,
          searchValue: searchQuery,
        };
        if (start) params.startDate = start;
        if (end) params.endDate = end;

        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });

        const data = response.data.data || [];
        const total = response.data.totalElements || data.length;
        setDeliveries(data);
        setTotalItems(total);
      } catch (error) {
        console.error("Error fetching deliveries:", error);
        setError("Failed to fetch deliveries. Please try again.");
        toast.error("Failed to fetch deliveries.");
        setDeliveries([]);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage]
  );

  useEffect(() => {
    fetchDeliveries(currentPage, debouncedQuery, startDate, endDate);
  }, [currentPage, debouncedQuery, startDate, endDate, fetchDeliveries]);

  const handleDeleteClick = (delivery) => {
    setDeliveryToDelete(delivery);
  };

  const handleDeleteConfirm = async () => {
    if (!deliveryToDelete) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`${API_URL}/${deliveryToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeliveryToDelete(null);
      fetchDeliveries(currentPage, debouncedQuery, startDate, endDate);
      toast.success("Delivery deleted successfully!");
    } catch (error) {
      console.error("Error deleting delivery:", error);
      setError(error.response?.data?.message || "Failed to delete delivery.");
      toast.error(error.response?.data?.message || "Failed to delete delivery.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle DatePicker change
  const handleDateChange = (date, dateString, type) => {
    if (type === "start") {
      setStartDate(dateString); // dateString is in 'YYYY-MM-DD' format
    } else {
      setEndDate(dateString);
    }
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleAddDeliveryClick = () => {
    navigate("/deliveries/add-delivery");
  };

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
              placeholder="Search Supplier"
              value={query}
              onChange={handleSearchInputChange}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
          <div className="d-flex align-items-center gap-2">
            <DatePicker
              value={startDate ? dayjs(startDate) : null} 
              format="YYYY-MM-DD"
              onChange={(date, dateString) => handleDateChange(date, dateString, "start")}
              className="h-40-px" 
              style={{ width: "150px" }} 
            />
            <span>to</span>
            <DatePicker
              value={endDate ? dayjs(endDate) : null} 
              format="YYYY-MM-DD"
              onChange={(date, dateString) => handleDateChange(date, dateString, "end")}
              className="h-40-px" 
              style={{ width: "150px" }} 
            />
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
          onClick={handleAddDeliveryClick}
        >
          <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
          Add Delivery
        </button>
      </div>

      <div className="card-body p-24">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="table-responsive scroll-sm">
          <table className="table table-borderless sm-table mb-0">
            <thead>
              <tr>
                <th scope="col" className="text-center py-3 px-6">#</th>
                <th scope="col" className="text-start py-3 px-4">Supplier</th>
                <th scope="col" className="text-start py-3 px-4">Volume (L)</th>
                <th scope="col" className="text-start py-3 px-4">Price/Litre</th>
                <th scope="col" className="text-start py-3 px-4">Storage Facility</th>
                <th scope="col" className="text-start py-3 px-4">Total Amount</th>
                <th scope="col" className="text-start py-3 px-4">Status</th>
                <th scope="col" className="text-start py-3 px-4">Created By</th>
                <th scope="col" className="text-start py-3 px-4">Date Created</th>
                <th scope="col" className="text-start py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="10" className="text-center py-3">
                    <Spinner />
                  </td>
                </tr>
              ) : deliveries.length > 0 ? (
                deliveries.map((delivery, index) => (
                  <tr key={delivery.id} style={{ transition: "background-color 0.2s" }}>
                    <td className="text-center small-text py-3 px-6">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="text-start small-text py-3 px-4">{delivery.supplier.name}</td>
                    <td className="text-start small-text py-3 px-4">{delivery.litres}</td>
                    <td className="text-start small-text py-3 px-4">{formatCurrency(delivery.pricePerLitre.toFixed(2))}</td>
                    <td className="text-start small-text py-3 px-4">{delivery?.storageFacility?.name || "N/A"}</td>
                    <td className="text-start small-text py-3 px-4">{formatCurrency(delivery.totalAmount.toFixed(2))}</td>
                    <td className="text-start small-text py-3 px-4">
                      <span
                        className={`bg-${
                          delivery.status.name === "Not Billed" ? "warning-focus" : "success-focus"
                        } text-${
                          delivery.status.name === "Not Billed" ? "warning-600" : "success-600"
                        } px-24 py-4 radius-8 fw-medium text-sm`}
                      >
                        {delivery.status.name}
                      </span>
                    </td>
                    <td className="text-start small-text py-3 px-4">{delivery.createdBy.name}</td>
                    <td className="text-start small-text py-3 px-4">{formatDate(delivery.dateCreated)}</td>
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
                              <button
                                className="dropdown-item"
                                onClick={() => navigate("/deliveries/edit-delivery", { state: { delivery } })}
                              >
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(delivery)}
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
                  <td colSpan="10" className="text-center py-3">
                    No deliveries found
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
        {/* Previous Button */}
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

        {/* Page Numbers */}
        {totalPages > 6 ? (
          <>
            {/* First Page */}
            <li className={`page-item ${currentPage === 1 ? "active" : ""}`}>
              <button
                className={`page-link btn ${currentPage === 1 ? "btn-primary" : "btn-outline-primary"} rounded-circle`}
                style={{ width: "30px", height: "30px", fontSize: "10px" }}
                onClick={() => handlePageChange(1)}
              >
                1
              </button>
            </li>

            {/* Left "..." if needed */}
            {currentPage > 3 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}

            {/* Middle Pages */}
            {Array.from(
              { length: 5 }, 
              (_, i) => currentPage - 2 + i
            )
              .filter(page => page > 1 && page < totalPages)
              .map(page => (
                <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                  <button
                    className={`page-link btn ${currentPage === page ? "btn-primary" : "btn-outline-primary"} rounded-circle`}
                    style={{ width: "30px", height: "30px", fontSize: "10px" }}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}

            {/* Right "..." if needed */}
            {currentPage < totalPages - 2 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}

            {/* Last Page */}
            <li className={`page-item ${currentPage === totalPages ? "active" : ""}`}>
              <button
                className={`page-link btn ${currentPage === totalPages ? "btn-primary" : "btn-outline-primary"} rounded-circle`}
                style={{ width: "30px", height: "30px", fontSize: "10px" }}
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </button>
            </li>
          </>
        ) : (
          // If total pages are small, show all numbers
          Array.from({ length: totalPages }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
              <button
                className={`page-link btn ${currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"} rounded-circle`}
                style={{ width: "30px", height: "30px", fontSize: "10px" }}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))
        )}

        {/* Next Button */}
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

      <div className="modal fade" id="deleteModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body pt-3 ps-18 pe-18">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="modal-title fs-6">Delete Delivery</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <p className="pb-3 mb-0">
                Are you sure you want to delete the delivery from{" "}
                <strong>{deliveryToDelete?.supplier.name}</strong> permanently? This action cannot be undone.
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

export default DeliveriesLayer;