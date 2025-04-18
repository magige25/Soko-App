import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { formatDate } from "../hook/format-utils";

const API_URL = "https://api.bizchain.co.ke/v1/currencies";

const CurrenciesLayer = () => {
  const [currencies, setCurrencies] = useState([]);
  const [filteredCurrencies, setFilteredCurrencies] = useState([]);
  const [editCurrency, setEditCurrency] = useState({ code: "", name: "", sign: "" });
  const [newCurrency, setNewCurrency] = useState({ code: "", name: "", sign: "" });
  const [currencyToDelete, setCurrencyToDelete] = useState(null);
  const [currencyToView, setCurrencyToView] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const addButtonRef = useRef(null);

  useEffect(() => {
    fetchCurrencies();

    const addModal = document.getElementById("addCurrencyModal");
    const editModal = document.getElementById("editCurrencyModal");
    const resetAddForm = () => !isLoading && setNewCurrency({ code: "", name: "", sign: "" });
    const resetEditForm = () => !isLoading && setEditCurrency({ code: "", name: "", sign: "" });

    addModal?.addEventListener("hidden.bs.modal", resetAddForm);
    editModal?.addEventListener("hidden.bs.modal", resetEditForm);

    return () => {
      addModal?.removeEventListener("hidden.bs.modal", resetAddForm);
      editModal?.removeEventListener("hidden.bs.modal", resetEditForm);
    };
  }, [isLoading]);

  const fetchCurrencies = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response (Fetch Currencies):", response.data);
      const data = response.data.data || [];
      setCurrencies(data);
      setFilteredCurrencies(data);
    } catch (error) {
      console.error("Error fetching currencies:", error);
      setError("Failed to fetch currencies. Please try again.");
    }
  };

  const handleAddCurrency = async (e) => {
    e.preventDefault();
    if (!newCurrency.code.trim() || !newCurrency.name.trim() || !newCurrency.sign.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const token = sessionStorage.getItem("token");
      const response = await axios.post(API_URL, newCurrency, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response (Add Currency):", response.data);
      await fetchCurrencies();

      setNewCurrency({ code: "", name: "", sign: "" });

      if (addButtonRef.current) {
        addButtonRef.current.focus();
      }

      document.getElementById("addCurrencyModal").classList.remove("show");
      document.body.classList.remove("modal-open");
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) backdrop.remove();
    } catch (error) {
      console.error("Error adding currency:", error);
      setError(error.response?.data?.message || "Failed to add currency.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (currency) => {
    setEditCurrency({ ...currency });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editCurrency.code.trim() || !editCurrency.name.trim() || !editCurrency.sign.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const token = sessionStorage.getItem("token");
      const response = await axios.put(`${API_URL}/${editCurrency.code}`, editCurrency, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response (Edit Currency):", response.data);
      await fetchCurrencies();

      document.getElementById("editCurrencyModal").classList.remove("show");
      document.body.classList.remove("modal-open");
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) backdrop.remove();
    } catch (error) {
      console.error("Error updating currency:", error);
      setError(error.response?.data?.message || "Failed to update currency.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (currency) => {
    setCurrencyToDelete(currency);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");
      await axios.delete(`${API_URL}/${currencyToDelete.code}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response (Delete Currency):", "Currency deleted successfully");
      setCurrencies(currencies.filter((c) => c.code !== currencyToDelete.code));
      setFilteredCurrencies(filteredCurrencies.filter((c) => c.code !== currencyToDelete.code));
      setCurrencyToDelete(null);
    } catch (error) {
      console.error("Error deleting currency:", error);
      setError(error.response?.data?.message || "Failed to delete currency.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewClick = (currency) => {
    setCurrencyToView(currency);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterCurrencies(searchQuery);
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterCurrencies(query);
  };

  const filterCurrencies = (query) => {
    const lowerQuery = query.toLowerCase();
    const filtered = currencies.filter(
      (currency) =>
        currency.code.toLowerCase().includes(lowerQuery) ||
        currency.name.toLowerCase().includes(lowerQuery) ||
        currency.sign.toLowerCase().includes(lowerQuery)
    );
    setFilteredCurrencies(filtered);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCurrencies.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCurrencies.length / itemsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <form className="navbar-search" onSubmit={handleSearch}>
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              name="search"
              placeholder="Search code, name, or sign"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
        </div>
        <button
          ref={addButtonRef}
          type="button"
          className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
          data-bs-toggle="modal"
          data-bs-target="#addCurrencyModal"
        >
          <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
          Add Currency
        </button>
      </div>

      <div className="card-body-table p-24">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="table-responsive scroll-sm">
          <table className="table table-borderless sm-table mb-0">
            <thead>
              <tr>
                <th scope="col" className="text-center py-3 px-6">ID</th>
                <th scope="col" className="text-start py-3 px-4">Currency Code</th>
                <th scope="col" className="text-start py-3 px-4">Currency Name</th>
                <th scope="col" className="text-start py-3 px-4">Currency Sign</th>
                <th scope="col" className="text-start py-3 px-4">Date Created</th>
                <th scope="col" className="text-start py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((currency) => (
                  <tr key={currency.code} style={{ transition: "background-color 0.2s" }}>
                    <td className="text-center small-text py-3 px-6">
                      {indexOfFirstItem + currentItems.indexOf(currency) + 1}
                    </td>
                    <td className="text-start small-text py-3 px-4">{currency.code}</td>
                    <td className="text-start small-text py-3 px-4">{currency.name}</td>
                    <td className="text-start small-text py-3 px-4">{currency.sign}</td>
                    <td className="text-start small-text py-3 px-4">
                      {currency.dateCreated ? formatDate(currency.dateCreated) : ""}
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
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#viewCurrencyModal"
                                onClick={() => handleViewClick(currency)}
                              >
                                Details
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item"
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#editCurrencyModal"
                                onClick={() => handleEditClick(currency)}
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(currency)}
                                data-bs-toggle="modal"
                                data-bs-target="#deleteCurrencyModal"
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
                  <td colSpan="6" className="text-center py-3">
                    No currencies found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="text-muted" style={{ fontSize: "13px" }}>
            <span>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCurrencies.length)} of{" "}
              {filteredCurrencies.length} entries
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
      </div>

      {/* Add Currency Modal */}
      <div className="modal fade" id="addCurrencyModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                Add Currency
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </h6>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleAddCurrency}>
                {["code", "name", "sign"].map((field) => (
                  <div className="mb-3" key={field}>
                    <label className="form-label">
                      {field.charAt(0).toUpperCase() + field.slice(1)} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Enter Currency ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                      value={newCurrency[field]}
                      onChange={(e) => setNewCurrency({ ...newCurrency, [field]: e.target.value })}
                      required
                    />
                  </div>
                ))}
                <div className="text-muted small mt-3">
                  Fields marked with <span className="text-danger">*</span> are required.
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Currency Modal */}
      <div className="modal fade" id="editCurrencyModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                Edit Currency
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </h6>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleEditSubmit}>
                {["code", "name", "sign"].map((field) => (
                  <div className="mb-3" key={field}>
                    <label className="form-label">
                      {field.charAt(0).toUpperCase() + field.slice(1)} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Enter Currency ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                      value={editCurrency[field]}
                      onChange={(e) => setEditCurrency({ ...editCurrency, [field]: e.target.value })}
                      required
                    />
                  </div>
                ))}
                <div className="text-muted small mt-3">
                  Fields marked with <span className="text-danger">*</span> are required.
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Details Currency Modal */}
      <div className="modal fade" id="viewCurrencyModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                Details
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </h6>
              {currencyToView && (
                <div className="mt-3">
                  <p className="mb-3">
                    <strong>Code:</strong> {currencyToView.code}
                  </p>
                  <p className="mb-3">
                    <strong>Name:</strong> {currencyToView.name}
                  </p>
                  <p className="mb-3">
                    <strong>Sign:</strong> {currencyToView.sign}
                  </p>
                  <p className="mb-3">
                    <strong>Date Created:</strong>{" "}
                    {currencyToView.dateCreated ? formatDate(currencyToView.dateCreated) : "N/A"}
                  </p>
                </div>
              )}
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div className="modal fade" id="deleteCurrencyModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body pt-3 ps-18 pe-18">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="modal-title fs-6">Delete Currency</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <p className="pb-3 mb-0">
                Are you sure you want to delete the <strong>{currencyToDelete?.name}</strong> currency
                permanently? This action cannot be undone.
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
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrenciesLayer;