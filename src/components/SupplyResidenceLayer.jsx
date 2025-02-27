import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

const SupplyResidenceLayer = () => {
  const [residence, setResidence] = useState([]);
  const [newResidence, setNewResidence] = useState({ name: "", tarmacked: false, storageFacility: false });
  const [editResidence, setEditResidence] = useState(null);
  const [selectedResidence, setSelectedResidence] = useState(null);
  const [residenceToDelete, setResidenceToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addModalRef = useRef(null);
  const editModalRef = useRef(null);

  // Fetch supply residence from API
  const fetchResidence = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://biz-system-production.up.railway.app/v1/supplier-residence", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched residence data:", response.data.data);
      const cleanData = (response.data.data || []).filter(item => item && item.name);
      setResidence(cleanData);
    } catch (err) {
      setError("Failed to fetch supply residence. Please try again.");
      console.error("Fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidence();
  }, []);

  // Filter supply residence based on search query with null guard
  const filteredResidence = residence.filter((residence) =>
    residence?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResidence.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResidence.length / itemsPerPage);

  // Function to hide modals manually
  const hideModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("show");
      modal.style.display = "none"; // Ensure it’s hidden
      document.body.classList.remove("modal-open"); // Remove Bootstrap’s body class
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) backdrop.remove(); // Remove the backdrop
    }
  };

  // Handlers
  const handleAddResidence = async (e) => {
    e.preventDefault();
    if (!newResidence.name) {
      alert("Please fill in the name field.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Adding residence with payload:", newResidence);
      const response = await axios.post(
        "https://biz-system-production.up.railway.app/v1/supplier-residence",
        newResidence,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Add response:", response.data);
      await fetchResidence();
      resetAddForm();
      hideModal("addresiModal");
    } catch (err) {
      setError("Failed to add residence.");
      console.error("Add error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetAddForm = () => setNewResidence({ name: "", tarmacked: false, storageFacility: false });

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editResidence.name) {
      alert("Please fill in the name field.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Editing residence with payload:", editResidence);
      const response = await axios.put(
        `https://biz-system-production.up.railway.app/v1/supplier-residence/${editResidence.id}`,
        {
          name: editResidence.name,
          tarmacked: editResidence.tarmacked,
          storageFacility: editResidence.storageFacility,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Edit response:", response.data);
      await fetchResidence();
      setEditResidence(null);
      hideModal("editModal");
    } catch (err) {
      setError("Failed to update residence.");
      console.error("Edit error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Deleting residence:", residenceToDelete);
      await axios.delete(`https://biz-system-production.up.railway.app/v1/supplier-residence/${residenceToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Delete successful");
      await fetchResidence();
      setResidenceToDelete(null);
      hideModal("deleteModal");
    } catch (err) {
      setError("Failed to delete residence.");
      console.error("Delete error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="page-wrapper">
      <div className="row">
        <div className="d-flex align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="ms-auto">
            <button
              type="button"
              className="btn btn-primary btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
              data-bs-toggle="modal"
              data-bs-target="#addresiModal"
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add residence
            </button>
          </div>
        </div>

        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">
            <form className="navbar-search" style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <input
                type="text"
                placeholder="Search by residence name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ width: "200px" }}
              />
              <Icon icon="ion:search-outline" className="icon" style={{ width: "16px", height: "16px" }} />
            </form>

            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && (
              <>
                <div className="table-responsive">
                  <table className="table table-borderless text-start small-text">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Tarmacked</th>
                        <th>Storage Facility</th>
                        <th>Date Created</th>
                        <th>Suppliers</th>
                        <th>Created By</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((residence, index) => (
                        <tr key={residence.id || index}>
                          <th>{indexOfFirstItem + index + 1}</th>
                          <td>{residence.name}</td>
                          <td>{residence.tarmacked ? "Yes" : "No"}</td>
                          <td>{residence.storageFacility ? "Yes" : "No"}</td>
                          <td>{formatDate(residence.dateCreated) || "N/A"}</td>
                          <td>{residence.suppliers}</td>
                          <td>{residence.createdBy?.name || "Unknown"}</td>
                          <td>
                            <div className="dropdown">
                              <button className="btn btn-light dropdown-toggle btn-sm" data-bs-toggle="dropdown">
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

                <div className="d-flex justify-content-between align-items-start mt-3">
                  <div className="text-muted">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredResidence.length)} of{" "}
                    {filteredResidence.length} entries
                  </div>
                  <nav>
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
              </>
            )}
          </div>
        </div>

        {/* Add Residence Modal */}
        <div className="modal fade" id="addresiModal" tabIndex="-1" aria-hidden="true" ref={addModalRef}>
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Add Residence
                  <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={resetAddForm}></button>
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
                          id="tarmacked"
                          type="checkbox"
                          className="form-check-input"
                          checked={newResidence.tarmacked}
                          onChange={(e) => {
                            console.log("Tarmacked changed to:", e.target.checked);
                            setNewResidence({ ...newResidence, tarmacked: e.target.checked });
                          }}
                          style={{ width: "20px", height: "20px" }}
                        />
                      </label>
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label d-flex align-items-center gap-2">
                        Storage Facility
                        <input
                          id="storageFacility"
                          type="checkbox"
                          className="form-check-input"
                          checked={newResidence.storageFacility}
                          onChange={(e) => {
                            console.log("Storage Facility changed to:", e.target.checked);
                            setNewResidence({ ...newResidence, storageFacility: e.target.checked });
                          }}
                          style={{ width: "20px", height: "20px" }}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Saving..." : "Save"}
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
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                {selectedResidence && (
                  <>
                    <div className="mb-3"><strong>Name:</strong> {selectedResidence.name}</div>
                    <div className="mb-3"><strong>Tarmacked:</strong> {selectedResidence.tarmacked ? "Yes" : "No"}</div>
                    <div className="mb-3"><strong>Storage Facility:</strong> {selectedResidence.storageFacility ? "Yes" : "No"}</div>
                    <div className="mb-3"><strong>Date Created:</strong> {selectedResidence.dateCreated || "N/A"}</div>
                    <div className="mb-3"><strong>Suppliers:</strong> {selectedResidence.suppliers}</div>
                    <div className="mb-3"><strong>Created By:</strong> {selectedResidence.createdBy?.name || "Unknown"}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Residence Modal */}
        <div className="modal fade" id="editModal" tabIndex="-1" aria-hidden="true" ref={editModalRef}>
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Edit Supply Residence
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
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
                            id="tarmacked"
                            type="checkbox"
                            className="form-check-input"
                            checked={editResidence.tarmacked}
                            onChange={(e) => {
                              console.log("Edit Tarmacked changed to:", e.target.checked);
                              setEditResidence({ ...editResidence, tarmacked: e.target.checked });
                            }}
                            style={{ width: "20px", height: "20px" }}
                          />
                        </label>
                      </div>
                      <div className="col-md-12 mb-3">
                        <label className="form-label d-flex align-items-center gap-2">
                          Storage Facility
                          <input
                            id="storageFacility"
                            type="checkbox"
                            className="form-check-input"
                            checked={editResidence.storageFacility}
                            onChange={(e) => {
                              console.log("Edit Storage Facility changed to:", e.target.checked);
                              setEditResidence({ ...editResidence, storageFacility: e.target.checked });
                            }}
                            style={{ width: "20px", height: "20px" }}
                          />
                        </label>
                      </div>
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
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
                  <h6 className="modal-title fs-6">Delete</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <p className="pb-3 mb-0">
                  Are you sure you want to delete <strong>{residenceToDelete?.name}</strong>? This action cannot be undone.
                </p>
              </div>
              <div className="d-flex justify-content-end gap-2 px-12 pb-3">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm} disabled={loading}>
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyResidenceLayer;