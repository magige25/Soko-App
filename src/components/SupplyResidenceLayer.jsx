import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import { Spinner } from "../hook/spinner-utils";
import { formatDate } from "../hook/format-utils";

const API_URL = "https://api.bizchain.co.ke/v1/supplier-residence";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

const SupplyResidenceLayer = () => {
  const [residence, setResidence] = useState([]);
  const [newResidence, setNewResidence] = useState({ name: "", tarmacked: false, storageFacility: false });
  const [editResidence, setEditResidence] = useState(null);
  const [selectedResidence, setSelectedResidence] = useState(null);
  const [residenceToDelete, setResidenceToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const debouncedQuery = useDebounce(query, 300);

  const fetchResidence = useCallback(async (page = 1, searchQuery = "") => {
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
        params: { page: page, limit: itemsPerPage, searchValue: searchQuery },
      });
      const result = response.data;
      if (result.status.code === 0 && Array.isArray(result.data)) {
        const cleanData = result.data.map(item => ({
          id: item.id,
          name: item.name,
          tarmacked: item.tarmacked,
          storageFacility: item.storageFacility,
          dateCreated: item.dateCreated,
          suppliers: item.suppliers,
          createdBy: item.createdBy?.name || "Unknown",
        }));
        setResidence(cleanData);
        setTotalItems(result.totalElements); // Use server-provided total
      } else {
        setError(`Failed to fetch residence: ${result.status.message || "Invalid response"}`);
        setResidence([]);
        setTotalItems(0);
      }
    } catch (err) {
      setError(`Failed to fetch supply residence: ${err.response?.data?.message || err.message}`);
      setResidence([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchResidence(currentPage, debouncedQuery);
  }, [currentPage, debouncedQuery, fetchResidence]);

  const handleAddResidence = async (e) => {
    e.preventDefault();
    if (!newResidence.name) {
      setError("Please fill in the name field.");
      return;
    }
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(API_URL, newResidence, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      fetchResidence(currentPage, debouncedQuery);
      setNewResidence({ name: "", tarmacked: false, storageFacility: false });
      e.target.closest(".modal").querySelector('[data-bs-dismiss="modal"]').click();
    } catch (err) {
      setError(`Failed to add residence: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editResidence.name) {
      setError("Please fill in the name field.");
      return;
    }
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const payload = {
        name: editResidence.name,
        tarmacked: editResidence.tarmacked,
        storageFacility: editResidence.storageFacility,
      };
      await axios.put(`${API_URL}/${editResidence.id}`, payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      fetchResidence(currentPage, debouncedQuery);
      setEditResidence(null);
      e.target.closest(".modal").querySelector('[data-bs-dismiss="modal"]').click();
    } catch (err) {
      setError(`Failed to update residence: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`${API_URL}/${residenceToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchResidence(currentPage, debouncedQuery);
      setResidenceToDelete(null);
      document.querySelector("#deleteModal [data-bs-dismiss='modal']").click();
    } catch (err) {
      setError(`Failed to delete residence: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <form className="navbar-search">
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              name="search"
              placeholder="Search residence name"
              value={query}
              onChange={handleSearchInputChange}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
        </div>
        <button
          className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
          data-bs-toggle="modal"
          data-bs-target="#addresiModal"
        >
          <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
          Add Residence
        </button>
      </div>

      <div className="card-body-table p-24">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="table-responsive scroll-sm">
          <table className="table table-borderless sm-table mb-0">
            <thead>
              <tr>
                <th scope="col" className="text-center py-3 px-6">ID</th>
                <th scope="col" className="text-start py-3 px-4">Name</th>
                <th scope="col" className="text-start py-3 px-4">Tarmacked</th>
                <th scope="col" className="text-start py-3 px-4">Storage Facility</th>
                <th scope="col" className="text-start py-3 px-4">Date Created</th>
                <th scope="col" className="text-start py-3 px-4">Suppliers</th>
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
              ) : residence.length > 0 ? (
                residence.map((residence, index) => (
                  <tr key={residence.id} style={{ transition: "background-color 0.2s" }}>
                    <td className="text-center small-text py-3 px-6">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="text-start small-text py-3 px-4">{residence.name}</td>
                    <td className="text-start small-text py-3 px-4">{residence.tarmacked ? "Yes" : "No"}</td>
                    <td className="text-start small-text py-3 px-4">{residence.storageFacility ? "Yes" : "No"}</td>
                    <td className="text-start small-text py-3 px-4">{formatDate(residence.dateCreated)}</td>
                    <td className="text-start small-text py-3 px-4">{residence.suppliers}</td>
                    <td className="text-start small-text py-3 px-4">{residence.createdBy}</td>
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
                                data-bs-target="#viewModal"
                                onClick={() => setSelectedResidence(residence)}
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
                                onClick={() => setEditResidence(residence)}
                              >
                                <Icon icon="ri-edit-line" />
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                data-bs-toggle="modal"
                                data-bs-target="#deleteModal"
                                onClick={() => setResidenceToDelete(residence)}
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
                  <td colSpan="8" className="text-center py-3">No residence found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="text-muted" style={{ fontSize: "13px" }}>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
            </div>
            <nav aria-label="Page navigation">
              <ul className="pagination mb-0" style={{ gap: "6px" }}>
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "24px", height: "24px", padding: "0", transition: "all 0.2s" }}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <Icon icon="ri-arrow-drop-left-line" style={{ fontSize: "12px" }} />
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                    <button
                      className={`page-link btn ${currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"} rounded-circle d-flex align-items-center justify-content-center`}
                      style={{
                        width: "30px",
                        height: "30px",
                        padding: "0",
                        transition: "all 0.2s",
                        fontSize: "10px",
                        color: currentPage === i + 1 ? "#fff" : "",
                      }}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "24px", height: "24px", padding: "0", transition: "all 0.2s" }}
                    onClick={() => setCurrentPage(currentPage + 1)}
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

      {/* Add Residence Modal */}
      <div className="modal fade" id="addresiModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                Add Residence
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </h6>
              <form onSubmit={handleAddResidence}>
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={newResidence.name}
                      onChange={(e) => setNewResidence({ ...newResidence, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <label className="form-label d-flex align-items-center gap-2">
                      Tarmacked
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={newResidence.tarmacked}
                        onChange={(e) => setNewResidence({ ...newResidence, tarmacked: e.target.checked })}
                        style={{ width: "20px", height: "20px" }}
                      />
                    </label>
                  </div>
                  <div className="col-md-12 mb-3">
                    <label className="form-label d-flex align-items-center gap-2">
                      Storage Facility
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={newResidence.storageFacility}
                        onChange={(e) => setNewResidence({ ...newResidence, storageFacility: e.target.checked })}
                        style={{ width: "20px", height: "20px" }}
                      />
                    </label>
                  </div>
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

      {/* View Residence Modal */}
      <div className="modal fade" id="viewModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                Supply Details
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </h6>
              {selectedResidence && (
                <>
                  <div className="mb-3"><strong>Name:</strong> {selectedResidence.name}</div>
                  <div className="mb-3"><strong>Tarmacked:</strong> {selectedResidence.tarmacked ? "Yes" : "No"}</div>
                  <div className="mb-3"><strong>Storage Facility:</strong> {selectedResidence.storageFacility ? "Yes" : "No"}</div>
                  <div className="mb-3"><strong>Date Created:</strong> {formatDate(selectedResidence.dateCreated)}</div>
                  <div className="mb-3"><strong>Suppliers:</strong> {selectedResidence.suppliers}</div>
                  <div className="mb-3"><strong>Created By:</strong> {selectedResidence.createdBy}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Residence Modal */}
      <div className="modal fade" id="editModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                Edit Supply Residence
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </h6>
              {editResidence && (
                <form onSubmit={handleEditSubmit}>
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        value={editResidence.name}
                        onChange={(e) => setEditResidence({ ...editResidence, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label d-flex align-items-center gap-2">
                        Tarmacked
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={editResidence.tarmacked}
                          onChange={(e) => setEditResidence({ ...editResidence, tarmacked: e.target.checked })}
                          style={{ width: "20px", height: "20px" }}
                        />
                      </label>
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label d-flex align-items-center gap-2">
                        Storage Facility
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={editResidence.storageFacility}
                          onChange={(e) => setEditResidence({ ...editResidence, storageFacility: e.target.checked })}
                          style={{ width: "20px", height: "20px" }}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div className="modal fade" id="deleteModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body pt-3 ps-18 pe-18">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="modal-title fs-6">Delete Residence</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <p className="pb-3 mb-0">
                Are you sure you want to delete <strong>{residenceToDelete?.name}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="d-flex justify-content-end gap-2 px-12 pb-3">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm} disabled={isLoading}>
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyResidenceLayer;