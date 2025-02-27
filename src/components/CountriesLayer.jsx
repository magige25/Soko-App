import React, { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const API_URL = "https://biz-system-production.up.railway.app/v1/countries";
const CURRENCY_API_URL = "https://biz-system-production.up.railway.app/v1/currencies";

const CountriesLayer = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [query, setQuery] = useState('');
  const [editCountry, setEditCountry] = useState({ code: "", name: "", currencyCode: "" });
  const [newCountry, setNewCountry] = useState({ code: "", name: "", currencyCode: "" });
  const [countryToDelete, setCountryToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [currencies, setCurrencies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const addModalRef = useRef(null);
  const editModalRef = useRef(null);

  useEffect(() => {
    console.log('Component mounted, fetching countries and currencies...');
    fetchCountries();
    fetchCurrencies();

    const editModal = document.getElementById("editCountryModal");
    const resetEditForm = () => {
      if (!isLoading) {
        console.log('Resetting edit form');
        setEditCountry({ code: "", name: "", currencyCode: "" });
      }
    };

    const addModal = document.getElementById("addCountryModal");
    const resetAddForm = () => {
      if (!isLoading) {
        console.log('Resetting add form');
        setNewCountry({ code: "", name: "", currencyCode: "" });
      }
    };

    editModal?.addEventListener("hidden.bs.modal", resetEditForm);
    addModal?.addEventListener("hidden.bs.modal", resetAddForm);

    return () => {
      editModal?.removeEventListener("hidden.bs.modal", resetEditForm);
      addModal?.removeEventListener("hidden.bs.modal", resetAddForm);
    };
  }, [isLoading]);

  const fetchCountries = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      console.log('Fetching countries with token:', token);
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetch Countries Response:', response.data.data);
      const data = response.data.data || [];
      setCountries(data);
      setFilteredCountries(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching countries:", error);
      setError("Failed to fetch countries. Please try again.");
      setCountries([]);
      setFilteredCountries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log('Fetching currencies with token:', token);
      const response = await axios.get(CURRENCY_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched currencies:", response.data.data);
      setCurrencies(response.data.data || []);
    } catch (error) {
      console.error("Error fetching currencies:", error);
      setError("Failed to fetch currencies.");
      setCurrencies([]);
    }
  };

  const handleEditClick = (country) => {
    console.log('Edit clicked for country:', country);
    setEditCountry(country);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting edit form:', editCountry);
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/${editCountry.code}`, editCountry, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log('Update Response:', response.data);
      if (response.status === 200) {
        const updatedCountries = countries.map((r) =>
          r.code === editCountry.code ? { ...r, ...editCountry } : r
        );
        setCountries(updatedCountries);
        setFilteredCountries(updatedCountries);
        alert("Country updated successfully!");
      }
    } catch (error) {
      console.error("Error updating country:", error);
      setError("Failed to update country.");
      alert("Failed to update country.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (country) => {
    console.log('Delete clicked for country:', country);
    setCountryToDelete(country);
  };

  const handleDeleteConfirm = async () => {
    if (!countryToDelete) return;
    console.log('Confirming delete for country:', countryToDelete);
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_URL}/${countryToDelete.code}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        const updatedCountries = countries.filter((r) => r.code !== countryToDelete.code);
        setCountries(updatedCountries);
        setFilteredCountries(updatedCountries);
        setCountryToDelete(null);
        alert("Country deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting country:", error);
      setError("Failed to delete country.");
      alert("Failed to delete country.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCountry = async (e) => {
    e.preventDefault();
    if (!newCountry.code || !newCountry.name || !newCountry.currencyCode) {
      setError("Please fill in all fields before saving.");
      alert("Please fill in all fields before saving.");
      return;
    }
    const newCountryData = {
      code: newCountry.code,
      name: newCountry.name,
      currencyCode: newCountry.currencyCode,
    };
    console.log('Submitting add form:', newCountryData);
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const response = await axios.post(API_URL, newCountryData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log('Add Response:', response.data);
      if (response.status === 201) {
        await fetchCountries(); // Refresh the list
        alert("Country added successfully!");
      }
    } catch (error) {
      console.error("Error adding country:", error.response ? error.response.data : error.message);
      setError(`Failed to add country: ${error.response ? error.response.data.message : error.message}`);
      alert(`Failed to add country: ${error.response ? error.response.data.message : error.message}`);
    } finally {
      setIsLoading(false);
    }
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
      </div>

      {/* Add Country Modal */}
      <div className="modal fade" id="addCountryModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" ref={addModalRef}>
            <div className="modal-body">
              <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                Add Country
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </h6>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleAddCountry}>
                <div className="row mb-3">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Code <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Country Code"
                      value={newCountry.code}
                      onChange={(e) => setNewCountry({ ...newCountry, code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Country Name"
                      value={newCountry.name}
                      onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })}
                      required
                    />
                  </div>
                </div>
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
                    {currencies.length > 0 ? (
                      currencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>Loading...</option>
                    )}
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

      {/* Edit Country Modal */}
      <div className="modal fade" id="editCountryModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" ref={editModalRef}>
            <div className="modal-body">
              <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                Edit Country
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </h6>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleEditSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Code <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Country Code"
                      value={editCountry.code}
                      onChange={(e) => setEditCountry({ ...editCountry, code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Country Name"
                      value={editCountry.name}
                      onChange={(e) => setEditCountry({ ...editCountry, name: e.target.value })}
                      required
                    />
                  </div>
                </div>
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
                        {currency.code} - {currency.name}
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
  );
};

export default CountriesLayer;