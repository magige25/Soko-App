import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "../hook/spinner-utils";

const API_URL = "https://api.bizchain.co.ke/v1/invoice-register";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

const InvoiceRegisterLayer = () => {
  const [invoices, setInvoices] = useState([]);
  const [query, setQuery] = useState("");
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [editInvoice, setEditInvoice] = useState({ litres: '', totalAmount: '', status: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const debouncedQuery = useDebounce(query, 300);

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(amount);

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

  const fetchInvoices = useCallback(async (page = 1, searchQuery = "") => {
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
          page: page - 1,
          size: itemsPerPage,
          searchValue: searchQuery,
        },
      });
      console.log("Raw API Response:", response.data);
      const result = response.data;
      if (result.status.code === 0) {
        const mappedInvoices = result.data.map((invoice) => ({
          id: invoice.id,
          litres: invoice.litres,
          totalAmount: invoice.totalAmount,
          status: invoice.status.name,
          dateCreated: invoice.dateCreated,
        }));
        console.log("Mapped Invoices:", mappedInvoices);
        setInvoices(mappedInvoices);
        setTotalItems(result.totalElements);
      } else {
        setError(`Failed to fetch invoices: ${result.status.message}`);
        setInvoices([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError(`Error fetching invoices: ${error.response?.data?.message || error.message}`);
      setInvoices([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchInvoices(currentPage, debouncedQuery);
  }, [currentPage, debouncedQuery, fetchInvoices]);

  const handleEditClick = (invoice) => {
    setEditInvoice({
      id: invoice.id,
      litres: invoice.litres,
      totalAmount: invoice.totalAmount,
      status: invoice.status,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editInvoice.litres || !editInvoice.totalAmount || !editInvoice.status) {
      setError("All fields are required");
      return;
    }
    setIsLoading(true);
    setError(null);
    const token = sessionStorage.getItem("token");
    try {
      const payload = {
        invoiceRequestList: [
          {
            id: editInvoice.id,
            litres: Number(editInvoice.litres),
            totalAmount: Number(editInvoice.totalAmount),
            status: { name: editInvoice.status },
          },
        ],
      };

      const response = await axios.put(
        `${API_URL}/${editInvoice.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status.code === 0) {
        setEditInvoice({ litres: '', totalAmount: '', status: '' });
        fetchInvoices(currentPage, debouncedQuery);
        toast.success("Invoice updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        setError(`Failed to update invoice: ${response.data.status.message}`);
      }
    } catch (error) {
      console.error("Error updating invoice:", error.response?.data || error.message);
      setError(`Error updating invoice: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (invoice) => {
    setInvoiceToDelete(invoice);
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    setError(null);
    const token = sessionStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/${invoiceToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoiceToDelete(null);
      fetchInvoices(currentPage, debouncedQuery);
      toast.success("Invoice deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      setError(`Error deleting invoice: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayInvoice = async (invoiceId) => {
    setIsLoading(true);
    setError(null);
    const token = sessionStorage.getItem("token");
    try {
      const payload = {
        invoiceRequestList: [{
          id: invoiceId,
          status: { name: "Paid" }
        }]
      };
      
      const response = await axios.put(
        `${API_URL}/${invoiceId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status.code === 0) {
        fetchInvoices(currentPage, debouncedQuery);
        toast.success("Invoice marked as paid successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        setError(`Failed to mark invoice as paid: ${response.data.status.message}`);
      }
    } catch (error) {
      console.error("Error paying invoice:", error.response?.data || error.message);
      setError(`Error paying invoice: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <ToastContainer />
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <form className="navbar-search">
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              name="search"
              placeholder="Search Invoices"
              value={query}
              onChange={handleSearchInputChange}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
        </div>
      </div>

      <div className="card-body-table p-24">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="table-responsive scroll-sm">
          <table className="table table-borderless sm-table mb-0">
            <thead>
              <tr>
                <th scope="col" className="text-center py-3 px-6">ID</th>
                <th scope="col" className="text-start py-3 px-4">Litres</th>
                <th scope="col" className="text-start py-3 px-4">Total Amount</th>
                <th scope="col" className="text-start py-3 px-4">Status</th>
                <th scope="col" className="text-start py-3 px-4">Date Created</th>
                <th scope="col" className="text-start py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-3">
                    <Spinner />
                  </td>
                </tr>
              ) : invoices.length > 0 ? (
                invoices.map((invoice, index) => (
                  <tr key={invoice.id} style={{ transition: "background-color 0.2s" }}>
                    <td className="text-center small-text py-3 px-6">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="text-start small-text py-3 px-4">{invoice.litres.toLocaleString()}</td>
                    <td className="text-start small-text py-3 px-4">{formatAmount(invoice.totalAmount)}</td>
                    <td className="text-start small-text py-3 px-4">
                      <span
                        className={`bg-${
                          invoice.status === "Not Paid" ? "danger-focus" : "success-focus"
                        } text-${
                          invoice.status === "Not Paid" ? "danger-600" : "success-600"
                        } px-24 py-4 radius-8 fw-medium text-sm`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="text-start small-text py-3 px-4">{formatDate(invoice.dateCreated)}</td>
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
                                to={`/invoices-/${invoice.id}`}
                                state={{ invoice }}
                              >
                                <Icon icon="ri-eye-line" />
                                View
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item"
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#editModal"
                                onClick={() => handleEditClick(invoice)}
                              >
                                <Icon icon="ri-edit-line" />
                                Edit
                              </Link>
                            </li>
                            {invoice.status === "Not Paid" && (
                              <li>
                                <button
                                  className="dropdown-item text-success"
                                  onClick={() => handlePayInvoice(invoice.id)}
                                >
                                  <Icon icon="ri-money-dollar-circle-line" />
                                  Pay
                                </button>
                              </li>
                            )}
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(invoice)}
                                data-bs-toggle="modal"
                                data-bs-target="#deleteModal"
                              >
                                <Icon icon="mdi:trash-can" />
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
                  <td colSpan="6" className="text-center py-3">
                    No invoices found
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

      {/* Edit Invoice Modal */}
      <div className="modal fade" id="editModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                Edit Invoice
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </h6>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    Litres <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Litres"
                    value={editInvoice.litres}
                    onChange={(e) => setEditInvoice({ ...editInvoice, litres: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Total Amount <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Total Amount"
                    value={editInvoice.totalAmount}
                    onChange={(e) => setEditInvoice({ ...editInvoice, totalAmount: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Status <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={editInvoice.status}
                    onChange={(e) => setEditInvoice({ ...editInvoice, status: e.target.value })}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Not Paid">Not Paid</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
                <div className="text-muted small mt-3">
                  Fields marked with <span className="text-danger">*</span> are required.
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div className="modal fade" id="deleteModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body pt-3 ps-18 pe-18">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="modal-title fs-6">Delete Invoice</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <p className="pb-3 mb-0">
                Are you sure you want to delete this invoice permanently? This action cannot be undone.
              </p>
            </div>
            <div className="d-flex justify-content-end gap-2 px-12 pb-3">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDeleteConfirm}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceRegisterLayer;