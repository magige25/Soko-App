import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://192.168.100.45:8098/v1/currencies";

const CurrenciesLayer = () => {
  const [currencies, setCurrencies] = useState([]);
  const [editCurrency, setEditCurrency] = useState({ code: "", name: "", sign: "", dateCreated: "" });
  const [newCurrency, setNewCurrency] = useState({ code: '', name: '', sign: '', dateCreated: "" });
  const [currencyToDelete, setCurrencyToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch currencies from the API
  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      console.log("API Response (Fetch Currencies):", response.data);
      setCurrencies(response.data.data);
    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return ""; // Handle invalid dates
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const year = date.getFullYear();

    // Simple ordinal suffix logic
    const suffix = (day % 10 === 1 && day !== 11) ? "st" :
      (day % 10 === 2 && day !== 12) ? "nd" :
      (day % 10 === 3 && day !== 13) ? "rd" : "th";

    return `${day}${suffix} ${month} ${year}`;
  };

  const handleAddCurrency = async (e) => {
    e.preventDefault();
    if (!newCurrency.code.trim()) {
      alert("Please fill in all fields before saving.");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(API_URL, newCurrency, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      console.log("API Response (Add Currency):", response.data);

      // Update the state
      setCurrencies((prevCurrencies) => [
        ...prevCurrencies,
        { ...response.data.data, dateCreated: new Date().toISOString() }, // Add default date if missing
      ]);

      // Reset the form
      setNewCurrency({ code: '', name: '', sign: '', dateCreated: '' });

      // Delay modal closure
      setTimeout(() => {
        document.getElementById("addCurrencyModal").classList.remove("show"); // Close modal
      }, 2000); // Adjust the delay as needed
    } catch (error) {
      console.error("Error adding currency:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (currency) => {
    setEditCurrency(currency);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editCurrency) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/${editCurrency.code}`, editCurrency, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      console.log("API Response (Edit Currency):", response.data);

      // Update the state
      setCurrencies((prevCurrencies) =>
        prevCurrencies.map((c) =>
          c.code === editCurrency.code ? response.data.data : c
        )
      );

      // Delay modal closure
      setTimeout(() => {
        document.getElementById("editCurrencyModal").classList.remove("show"); // Close modal
      }, 2000); // Adjust the delay as needed
    } catch (error) {
      console.error("Error updating currency:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (currency) => {
    if (!currency) return;
    setCurrencyToDelete(currency);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${currencyToDelete.code}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      console.log("API Response (Delete Currency):", "Currency deleted successfully");

      // Update the state
      const updatedCurrencies = currencies.filter((c) => c.code !== currencyToDelete.code);
      setCurrencies(updatedCurrencies);
      setCurrencyToDelete(null);
    } catch (error) {
      console.error("Error deleting currency:", error);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = currencies.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(currencies.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="page-wrapper">
      <div className="row">
        {/* Add Currency */}
        <div className="d-flex align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="ms-auto">
            <button
              type="button"
              className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
              data-bs-toggle="modal"
              data-bs-target="#addCurrencyModal"
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add Currency
            </button>
          </div>
        </div>

        {/* Currencies table */}
        <div className="card shadow-sm mt-3 full-width-card" style={{ width: '100%' }}>
          <div className="card-body">
            <div>
              <form className="navbar-search" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', width: "32px" }}>
                <input type='text' name='search' placeholder='Search' />
                <Icon icon='ion:search-outline' className='icon' style={{ width: '16px', height: '16px' }} />
              </form>
            </div>
            <div className="table-responsive" style={{ overflow: 'visible' }}>
              <table className="table table-borderless text-start small-text" style={{ width: '100%' }}>
                <thead className="table-light text-start small-text">
                  <tr>
                    <th className="text-start">#</th>
                    <th className="text-start">Currency Code</th>
                    <th className="text-start" style={{ width: "220px" }}>Currency Name</th>
                    <th className="text-start">Currency Sign</th>
                    <th className="text-start" style={{ width: "220px" }}>Date Created</th>
                    <th className="text-start">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((currency, index) => (
                    <tr key={index}>
                      <th scope="row" className="text-start small-text">{indexOfFirstItem + index + 1}</th>
                      <td className="text-start small-text">{currency.code}</td>
                      <td className="text-start small-text">{currency.name}</td>
                      <td className="text-start small-text">{currency.sign}</td>
                      <td className="text-start small-text">{formatDate(currency.dateCreated)}</td>
                      <td className="text-start small-text">
                        <div className="dropdown">
                          <button className="btn btn-light dropdown-toggle btn-sm" type="button" data-bs-toggle="dropdown">
                            Actions
                          </button>
                          <ul className="dropdown-menu">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-start mt-3">
              <div className="text-muted">
                <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, currencies.length)} of {currencies.length} entries</span>
              </div>
              <nav aria-label="Page navigation">
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <Icon icon="ep:d-arrow-left" />
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button
                        className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px"
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
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

        {/* Add Currency Modal */}
        <div className="modal fade" id="addCurrencyModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Add Currency
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                <form onSubmit={handleAddCurrency}>
                  <div className="mb-3">
                    <label className="form-label">
                      Code <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Currency Code"
                      value={newCurrency.code}
                      onChange={(e) => setNewCurrency({ ...newCurrency, code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Currency Name"
                      value={newCurrency.name}
                      onChange={(e) => setNewCurrency({ ...newCurrency, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Sign <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Currency Sign"
                      value={newCurrency.sign}
                      onChange={(e) => setNewCurrency({ ...newCurrency, sign: e.target.value })}
                      required
                    />
                  </div>
                  <div className="text-muted small mt-3">
                    Fields marked with <span className="text-danger">*</span> are required.
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      data-bs-dismiss={!isLoading ? "modal" : undefined}
                      disabled={isLoading}
                    >
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
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label className="form-label">
                      Code <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Currency Code"
                      value={editCurrency.code}
                      onChange={(e) => setEditCurrency({ ...editCurrency, code: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Currency Name"
                      value={editCurrency.name}
                      onChange={(e) => setEditCurrency({ ...editCurrency, name: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Sign <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Currency Sign"
                      value={editCurrency.sign}
                      onChange={(e) => setEditCurrency({ ...editCurrency, sign: e.target.value })}
                    />
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
        <div className="modal fade" id="deleteCurrencyModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body pt-3 ps-18 pe-18">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="modal-title fs-6">Delete Currency</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <p className="pb-3 mb-0">
                  Are you sure you want to delete the <strong>{currencyToDelete?.name}</strong> currency permanently? This action cannot be undone.
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
    </div>
  );
};

export default CurrenciesLayer;