import React, { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const API_URL = "https://biz-system-production.up.railway.app/v1/countries";
const CURRENCY_API_URL = "https://biz-system-production.up.railway.app/v1/currencies";

const CountriesLayer = () => {
  const [countries, setCountries] = useState([]);
  const [editCountries, setEditCountries] = useState({ code: "", name: "", currencyCode: "" });
  const [newCountry, setNewCountry] = useState({ code: "", name: "", currencyCode: "" });
  const [searchItem, setSearchItem] = useState("");
  const [CountriesToDelete, setCountriesToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [currencies, setCurrencies] = useState([]);

  const addModalRef = useRef(null);
  const editModalRef = useRef(null);

  // Fetching countries and currencies on mount
  useEffect(() => {
    fetchCountries();
    fetchCurrencies();
  }, []);

  const fetchCountries = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response Data:", response.data.data);
      setCountries(response.data.data);
    } catch (error) {
      console.error("Error fetching Countries:", error);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(CURRENCY_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched currencies:", response.data.data);
      setCurrencies(response.data.data);
    } catch (error) {
      console.error("Error fetching currencies", error);
    }
  };

  const handleEditClick = (Countries) => {
    setEditCountries(Countries);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/${editCountries.code}`, editCountries, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const updatedCountries = countries.map((r) =>
          r.code === editCountries.code ? { ...r, ...editCountries } : r
        );
        setCountries(updatedCountries);
        alert("Country updated successfully!");
      }
    } catch (error) {
      console.error("Error updating Country:", error);
      alert("Failed to update Country");
    }
  };

  const handleDeleteClick = (Countries) => {
    setCountriesToDelete(Countries);
  };

  const handleDeleteConfirm = async () => {
    if (!CountriesToDelete) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_URL}/${CountriesToDelete.code}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const updatedCountries = countries.filter((r) => r.code !== CountriesToDelete.code);
        setCountries(updatedCountries);
        setCountriesToDelete(null);
        alert("Country deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting country:", error);
      alert("Failed to delete country.");
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = countries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(countries.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddCountry = async (e) => {
    e.preventDefault();
    if (!newCountry.code || !newCountry.name || !newCountry.currencyCode) {
      alert("Please fill in all fields before saving.");
      return;
    }

    const newCountryData = {
      code: newCountry.code,
      name: newCountry.name,
      currencyCode: newCountry.currencyCode,
    };

    try {
      console.log("DATA:", newCountryData);
      const token = localStorage.getItem("token");
      const response = await axios.post(API_URL, newCountryData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        setCountries([...countries, response.data.data]);
        setNewCountry({ code: "", name: "", currencyCode: "" });
      }
      await fetchCountries();
    } catch (error) {
      console.error("Error adding Country:", error.response ? error.response.data : error.message);
      alert(`Failed to add Country: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const currentDate = new Date();

  // Reset functions for the forms
  const resetAddForm = () => {
    setNewCountry({ code: "", name: "", currencyCode: "" });
  };

  const resetEditForm = () => {
    setEditCountries({ code: "", name: "", currencyCode: "" });
  };

  // Click outside handler for Add Modal
  useEffect(() => {
    const handleClickOutsideAdd = (event) => {
      if (addModalRef.current && !addModalRef.current.contains(event.target)) {
        resetAddForm();
      }
    };

    const addModalElement = document.getElementById("addModal");
    if (addModalElement && addModalElement.classList.contains("show")) {
      document.addEventListener("mousedown", handleClickOutsideAdd);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideAdd);
    };
  }, [newCountry]);

  // Click outside handler for Edit Modal
  useEffect(() => {
    const handleClickOutsideEdit = (event) => {
      if (editModalRef.current && !editModalRef.current.contains(event.target)) {
        resetEditForm();
      }
    };

    const editModalElement = document.getElementById("editModal");
    if (editModalElement && editModalElement.classList.contains("show")) {
      document.addEventListener("mousedown", handleClickOutsideEdit);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideEdit);
    };
  }, [editCountries]);

  return (
    <div className="page-wrapper">
      <div className="row">
        {/* Add New Country */}
        <div className="d-flex align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="ms-auto">
            <button
              type="button"
              className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
              data-bs-toggle="modal"
              data-bs-target="#addModal"
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add Country
            </button>
          </div>
        </div>

        {/* Countries table */}
        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">
            <div>
              <form
                className="navbar-search"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "20px",
                  width: "32px",
                }}
              >
                <input
                  type="text"
                  name="search"
                  placeholder="Search"
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                />
                <Icon icon="ion:search-outline" className="icon" style={{ width: "16px", height: "16px" }} />
              </form>
            </div>
            <div className="table-responsive" style={{ overflow: "visible" }}>
              <table className="table table-borderless text-start small-text" style={{ width: "100%" }}>
                <thead className="table-light text-start small-text">
                  <tr>
                    <th className="text-start">#</th>
                    <th className="text-start">Code</th>
                    <th className="text-start">Name</th>
                    <th className="text-start">Currency</th>
                    <th className="text-start">Date Created</th>
                    <th className="text-start">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((Countries, index) => (
                    <tr key={index}>
                      <th scope="row" className="text-start small-text">
                        {indexOfFirstItem + index + 1}
                      </th>
                      <td className="text-start small-text">{Countries.code}</td>
                      <td className="text-start small-text">{Countries.name}</td>
                      <td className="text-start small-text">{Countries.currency.name}</td>
                      <td className="text-start small-text">{formatDate(currentDate)}</td>
                      <td className="text-start small-text">
                        <div className="dropdown">
                          <button className="btn btn-light dropdown-toggle btn-sm" type="button" data-bs-toggle="dropdown">
                            Actions
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <Link
                                className="dropdown-item"
                                to={`/countries/${Countries.name}`}
                                data-bs-toggle="modal"
                                data-bs-target="#editModal"
                                state={{ Countries }}
                                onClick={() => handleEditClick(Countries)}
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(Countries)}
                                data-bs-toggle="modal"
                                data-bs-target="#deleteModal"
                              >
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-start mt-3">
              <div className="text-muted">
                <span>
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, countries.length)} of {countries.length} entries
                </span>
              </div>
              <nav aria-label="Page navigation">
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <Icon icon="ep:d-arrow-left" />
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                      <button
                        className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px"
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                      className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <Icon icon="ep:d-arrow-right" />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        {/* Add Country Modal */}
        <div className="modal fade" id="addModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content" ref={addModalRef}>
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Add Country
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                <form onSubmit={handleAddCountry}>
                  <div className="mb-3">
                    <label className="form-label">
                      Code <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control w-100"
                      name="code"
                      placeholder="Enter Code"
                      value={newCountry.code}
                      onChange={(e) => setNewCountry({ ...newCountry, code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control w-100"
                      name="name"
                      placeholder="Enter name"
                      value={newCountry.name}
                      onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="dropdown form-label">
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
                  <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Country Modal */}
        <div className="modal fade" id="editModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content" ref={editModalRef}>
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Edit Country
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Code</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Country Code"
                      value={editCountries.code}
                      onChange={(e) => setEditCountries({ ...editCountries, code: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Name"
                      value={editCountries.name}
                      onChange={(e) => setEditCountries({ ...editCountries, name: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="dropdown form-label">Currency</label>
                    <select
                      className="form-control"
                      value={editCountries.currencyCode}
                      onChange={(e) => setEditCountries({ ...editCountries, currencyCode: e.target.value })}
                    >
                      <option value="">Select Currency</option>
                      {currencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                      Save
                    </button>
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
                  <h6 className="modal-title fs-6">Delete Country</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <p className="pb-3 mb-0">
                  Are you sure you want to delete <strong>{CountriesToDelete?.name}</strong> Country permanently? This action cannot be undone.
                </p>
              </div>
              <div className="d-flex justify-content-end gap-2 px-12 pb-3">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDeleteConfirm}>
                  Delete
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