import React, { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "https://api.bizchain.co.ke/v1/countries";
const CURRENCY_API_URL = "https://api.bizchain.co.ke/v1/currencies";

const CountriesLayer = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [query, setQuery] = useState('');
  const [editCountry, setEditCountry] = useState({ code: "", name: "", currencyCode: "" });
  const [newCountry, setNewCountry] = useState({ code: "", name: "", currencyCode: "" });
  const [countryToDelete, setCountryToDelete] = useState(null);
  const [countryToView, setCountryToView] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [currencies, setCurrencies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const addButtonRef = useRef(null);

  useEffect(() => {
    fetchCountries();
    fetchCurrencies();

    const addModal = document.getElementById("addCountryModal");
    const editModal = document.getElementById("editCountryModal");
    const resetAddForm = () => setNewCountry({ code: "", name: "", currencyCode: "" });
    const resetEditForm = () => setEditCountry({ code: "", name: "", currencyCode: "" });

    addModal?.addEventListener("hidden.bs.modal", resetAddForm);
    editModal?.addEventListener("hidden.bs.modal", resetEditForm);

    return () => {
      addModal?.removeEventListener("hidden.bs.modal", resetAddForm);
      editModal?.removeEventListener("hidden.bs.modal", resetEditForm);
    };
  }, []);

  const fetchCountries = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.get(API_URL, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = response.data.data || [];
      setCountries(data);
      setFilteredCountries(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching countries:", error);
      setError(error.message || "Failed to fetch countries. Please try again.");
      setCountries([]);
      setFilteredCountries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.get(CURRENCY_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrencies(response.data.data || []);
    } catch (error) {
      console.error("Error fetching currencies:", error);
      setError(error.message || "Failed to fetch currencies.");
      setCurrencies([]);
    }
  };

  const handleAddCountry = async (e) => {
    e.preventDefault();
    if (!newCountry.code.trim() || !newCountry.name.trim() || !newCountry.currencyCode.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await axios.post(API_URL, newCountry, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      await fetchCountries();
      
      setNewCountry({ code: "", name: "", currencyCode: "" });

      if (addButtonRef.current) {
        addButtonRef.current.focus();
      }

      const closeButton = document.querySelector("#addCountryModal .btn-close");
      if (closeButton) {
        closeButton.click();
      }
    } catch (error) {
      console.error("Error adding country:", error);
      // Enhanced error logging with server response if available
      const errorMessage = error.response?.data?.message || error.message || "Failed to add country. Server error occurred.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (country) => {
    setEditCountry({ ...country, currencyCode: country.currency?.code || "" });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editCountry.code.trim() || !editCountry.name.trim() || !editCountry.currencyCode.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await axios.put(`${API_URL}/${editCountry.code}`, editCountry, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      await fetchCountries();
    } catch (error) {
      console.error("Error updating country:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update country.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (country) => {
    setCountryToDelete(country);
  };

  const handleDeleteConfirm = async () => {
    if (!countryToDelete) return;
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await axios.delete(`${API_URL}/${countryToDelete.code}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCountries(countries.filter((c) => c.code !== countryToDelete.code));
      setFilteredCountries(filteredCountries.filter((c) => c.code !== countryToDelete.code));
      setCountryToDelete(null);
    } catch (error) {
      console.error("Error deleting country:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete country.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewClick = (country) => {
    setCountryToView(country);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterCountries(query);
  };

  const handleSearchInputChange = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
    filterCountries(searchQuery);
  };

  const filterCountries = (searchQuery) => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = countries.filter(
      (country) =>
        country.code?.toLowerCase().includes(lowerQuery) ||
        country.name?.toLowerCase().includes(lowerQuery) ||
        country.currency?.name?.toLowerCase().includes(lowerQuery)
    );
    setFilteredCountries(filtered);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCountries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "short" });
    const year = date.getFullYear();
    const suffix = (day % 10 === 1 && day !== 11) ? "st" :
                   (day % 10 === 2 && day !== 12) ? "nd" :
                   (day % 10 === 3 && day !== 13) ? "rd" : "th";
    return `${day}${suffix} ${month} ${year}`;
  };

  return (
    <div className="page-wrapper">
      <div className="row">
        <div className="d-flex align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="ms-auto">
            <button
              ref={addButtonRef}
              type="button"
              className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
              data-bs-toggle="modal"
              data-bs-target="#addCountryModal"
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add New Country
            </button>
          </div>
        </div>

        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <div>
              <form
                className="navbar-search mb-3"
                onSubmit={handleSearch}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <input
                  type="text"
                  name="search"
                  placeholder="Search by code, name, or currency"
                  value={query}
                  onChange={handleSearchInputChange}
                  className="form-control"
                  style={{ maxWidth: "300px" }}
                />
                <Icon icon="ion:search-outline" className="icon" style={{ width: "16px", height: "16px" }} />
              </form>
            </div>
            <div className="table-responsive" style={{ overflow: "visible" }}>
              <table className="table table-borderless table-hover text-start small-text" style={{ width: "100%" }}>
                <thead className="table-light text-start small-text" style={{ fontSize: "15px" }}>
                  <tr>
                    <th className="text-center py-3 px-6" style={{ width: "50px"}}>#</th>
                    <th className="text-start py-3 px-4">Code</th>
                    <th className="text-start py-3 px-4">Name</th>
                    <th className="text-start py-3 px-4">Currency</th>
                    <th className="text-start py-3 px-4">Date Created</th>
                    <th className="text-start py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: "14px" }}>
                  {currentItems.length > 0 ? (
                    currentItems.map((country) => (
                      <tr key={country.code} style={{ transition: "background-color 0.2s" }}>
                        <td className="text-center small-text py-3 px-6">
                          {indexOfFirstItem + currentItems.indexOf(country) + 1}
                        </td>
                        <td className="text-start small-text py-3 px-4">{country.code}</td>
                        <td className="text-start small-text py-3 px-4">{country.name}</td>
                        <td className="text-start small-text py-3 px-4">{country.currency?.name || 'N/A'}</td>
                        <td className="text-start small-text py-3 px-4">{country.dateCreated ? formatDate(country.dateCreated) : ""}</td>
                        <td className="text-start small-text py-3 px-4">
                          <div className="dropdown">
                            <button
                              className="btn btn-outline-secondary btn-sm dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                              style={{ padding: "4px 8px" }}
                            >
                              Actions
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <Link
                                  className="dropdown-item"
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#viewCountryModal"
                                  onClick={() => handleViewClick(country)}
                                >
                                  Details
                                </Link>
                              </li>
                              <li>
                                <Link
                                  className="dropdown-item"
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#editCountryModal"
                                  onClick={() => handleEditClick(country)}
                                >
                                  Edit
                                </Link>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => handleDeleteClick(country)}
                                  data-bs-toggle="modal"
                                  data-bs-target="#deleteCountryModal"
                                >
                                  Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-3">
                        No countries found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted">
                <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCountries.length)} of {filteredCountries.length} entries</span>
              </div>
              <nav aria-label="Page navigation">
                <ul className="pagination mb-0" style={{ gap: "8px" }}>
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "36px", height: "36px", padding: "0", transition: "all 0.2s" }}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <Icon icon="ep:d-arrow-left" style={{ fontSize: "18px" }} />
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                      <button
                        className={`page-link btn ${currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"} rounded-circle d-flex align-items-center justify-content-center`}
                        style={{
                          width: "36px",
                          height: "36px",
                          padding: "0",
                          transition: "all 0.2s",
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
                      style={{ width: "36px", height: "36px", padding: "0", transition: "all 0.2s" }}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <Icon icon="ep:d-arrow-right" style={{ fontSize: "18px" }} />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        {/* Add Country Modal */}
        <div className="modal fade" id="addCountryModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Add Country
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </h6>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleAddCountry}>
                  {["code", "name"].map((field) => (
                    <div className="mb-3" key={field}>
                      <label className="form-label">
                        {field.charAt(0).toUpperCase() + field.slice(1)} <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`Enter Country ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                        value={newCountry[field]}
                        onChange={(e) => setNewCountry({ ...newCountry, [field]: e.target.value })}
                        required
                      />
                    </div>
                  ))}
                  <div className="mb-3">
                    <label className="form-label">
                      Currency <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      value={newCountry.currencyCode}
                      onChange={(e) => setNewCountry({ ...newCountry, currencyCode: e.target.value })}
                      required
                    >
                      <option value="">Select Currency</option>
                      {currencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>
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

        {/* Edit Country Modal */}
        <div className="modal fade" id="editCountryModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Edit Country
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </h6>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleEditSubmit}>
                  {["code", "name"].map((field) => (
                    <div className="mb-3" key={field}>
                      <label className="form-label">
                        {field.charAt(0).toUpperCase() + field.slice(1)} <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`Enter Country ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                        value={editCountry[field]}
                        onChange={(e) => setEditCountry({ ...editCountry, [field]: e.target.value })}
                        required
                      />
                    </div>
                  ))}
                  <div className="mb-3">
                    <label className="form-label">
                      Currency <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      value={editCountry.currencyCode}
                      onChange={(e) => setEditCountry({ ...editCountry, currencyCode: e.target.value })}
                      required
                    >
                      <option value="">Select Currency</option>
                      {currencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-muted small mt-3">
                    Fields marked with <span className="text-danger">*</span> are required.
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                      data-bs-dismiss={!isLoading && !error ? "modal" : undefined}
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* View Country Modal */}
        <div className="modal fade" id="viewCountryModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Details
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </h6>
                {countryToView && (
                  <div className="mt-3">
                    <p className="mb-3">
                      <strong>Code:</strong> {countryToView.code}
                    </p>
                    <p className="mb-3">
                      <strong>Name:</strong> {countryToView.name}
                    </p>
                    <p className="mb-3">
                      <strong>Currency:</strong> {countryToView.currency?.name || 'N/A'}
                    </p>
                    <p className="mb-3">
                      <strong>Date Created:</strong> {countryToView.dateCreated ? formatDate(countryToView.dateCreated) : "N/A"}
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
        <div className="modal fade" id="deleteCountryModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body pt-3 ps-18 pe-18">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="modal-title fs-6">Delete Country</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <p className="pb-3 mb-0">
                  Are you sure you want to delete the <strong>{countryToDelete?.name}</strong> country permanently? This action cannot be undone.
                </p>
              </div>
              <div className="d-flex justify-content-end gap-2 px-12 pb-3">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button
                  type="button"
                  className="btn btn-danger"
                  data-bs-dismiss="modal"
                  onClick={handleDeleteConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountriesLayer;