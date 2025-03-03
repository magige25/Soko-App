import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

const SalespersonsLayer = () => {
  const [salespersons, setSalespersons] = useState([
    { name: "John Doe", email: "john.doe@example.com", phoneNo: "0754323149", region: "North", route: "Route A", performance: "Excellent", dateCreated: "2023-01-15", status: "Active" },
    { name: "Jane Smith", email: "jane.smith@example.com", phoneNo: "0765459087", region: "South", route: "Route B", performance: "Good", dateCreated: "2023-02-20", status: "Active" },
    { name: "Mike Johnson", email: "mike.j@example.com", phoneNo: "0765341232", region: "East", route: "Route C", performance: "Average", dateCreated: "2023-03-10", status: "Inactive" },
  ]);

  const [editSalesperson, setEditSalesperson] = useState({ name: '', email: '', phoneNo: '', region: '', route: '', performance: '', status: '' });
  const [newSalesperson, setNewSalesperson] = useState({ name: '', email: '', phoneNo: '', region: '', route: '', performance: '', status: '' });
  const [salespersonToDelete, setSalespersonToDelete] = useState(null);
  const [salespersonToView, setSalespersonToView] = useState(null);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showPerformanceDropdown, setShowPerformanceDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleEditClick = (salesperson) => {
    setEditSalesperson(salesperson);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedSalespersons = salespersons.map((r) =>
      r.name === editSalesperson.name ? { ...r, ...editSalesperson } : r
    );
    setSalespersons(updatedSalespersons);
    setEditSalesperson({ name: '', email: '', phoneNo: '', region: '', route: '', performance: '', status: '' });
  };

  const handleDeleteClick = (salesperson) => {
    setSalespersonToDelete(salesperson);
  };

  const handleDeleteConfirm = () => {
    const updatedSalespersons = salespersons.filter((r) => r.name !== salespersonToDelete.name);
    setSalespersons(updatedSalespersons);
    setSalespersonToDelete(null);
  };

  const handleAddSalesperson = (e) => {
    e.preventDefault();
    if (!newSalesperson.name || !newSalesperson.email || !newSalesperson.phoneNo || !newSalesperson.region || !newSalesperson.route || !newSalesperson.performance || !newSalesperson.status) {
      alert("Please fill in all required fields before saving.");
      return;
    }
    const newSalespersonData = {
      ...newSalesperson,
      dateCreated: "TBD", // Placeholder until server integration
    };
    setSalespersons([...salespersons, newSalespersonData]);
    setNewSalesperson({ name: '', email: '', phoneNo: '', region: '', route: '', performance: '', status: '' });
  };

  const handleViewClick = (salesperson) => {
    setSalespersonToView(salesperson);
  };

  // Format date as day month year (e.g., "15 Jan 2023")
  const formatDate = (dateString) => {
    if (dateString === "TBD") return "TBD"; // Placeholder for new entries
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = salespersons.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(salespersons.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="page-wrapper">
      <div className="row">
        {/* Add Salesperson */}
        <div className="d-flex align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="ms-auto">
            <button
              type="button"
              className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add Salesperson
            </button>
          </div>
        </div>

        {/* Salespersons table */}
        <div className="card shadow-sm mt-3 full-width-card" style={{ width: '100%' }}>
          <div className="card-body">
            <div>
              <form className="navbar-search" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', width: "32px" }}>
                <input type="text" name="search" placeholder="Search" />
                <Icon icon="ion:search-outline" className="icon" style={{ width: '16px', height: '16px' }} />
              </form>
            </div>
            <div className="table-responsive" style={{ overflow: 'visible' }}>
              <table className="table table-borderless text-start small-text" style={{ width: '100%' }}>
                <thead className="table-light text-start small-text">
                  <tr>
                    <th className="text-start">#</th>
                    <th className="text-start">Name</th>
                    <th className="text-start">Email</th>
                    <th className="text-start">Phone No.</th>
                    <th className="text-start">Region</th>
                    <th className="text-start">Route</th>
                    <th className="text-start">Performance</th>
                    <th className="text-start">Date Created</th>
                    <th className="text-start">Status</th>
                    <th className="text-start">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((salesperson, index) => (
                    <tr key={index}>
                      <th scope="row" className="text-start small-text">{indexOfFirstItem + index + 1}</th>
                      <td className="text-start small-text">{salesperson.name}</td>
                      <td className="text-start small-text">{salesperson.email}</td>
                      <td className="text-start small-text">{salesperson.phoneNo}</td>
                      <td className="text-start small-text">{salesperson.region}</td>
                      <td className="text-start small-text">{salesperson.route}</td>
                      <td className="text-start small-text">{salesperson.performance}</td>
                      <td className="text-start small-text">{formatDate(salesperson.dateCreated)}</td>
                      <td className="text-start small-text">{salesperson.status}</td>
                      <td className="text-start small-text">
                        <div className="dropdown">
                          <button 
                            className="btn btn-outline-secondary btn-sm dropdown-toggle" 
                            type="button" 
                            data-bs-toggle="dropdown">
                            Actions
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#viewModal"
                                onClick={() => handleViewClick(salesperson)}
                              >
                                View
                              </button>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item"
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#editModal"
                                onClick={() => handleEditClick(salesperson)}
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(salesperson)}
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
                <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, salespersons.length)} of {salespersons.length} entries</span>
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

        {/* Add Salesperson Modal */}
        <div className="modal fade" id="exampleModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered"> {/* Increased size to modal-lg */}
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Add Salesperson
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                <form onSubmit={handleAddSalesperson}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">
                        Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        placeholder="Enter Salesperson Name"
                        value={newSalesperson.name}
                        onChange={(e) => setNewSalesperson({ ...newSalesperson, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        placeholder="Enter Email"
                        value={newSalesperson.email}
                        onChange={(e) => setNewSalesperson({ ...newSalesperson, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">
                        Phone No <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="phoneNo"
                        placeholder="Enter Phone Number"
                        value={newSalesperson.phoneNo}
                        onChange={(e) => setNewSalesperson({ ...newSalesperson, phoneNo: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Region <span className="text-danger">*</span>
                      </label>
                      <div className="position-relative">
                        <div
                          className="form-control d-flex justify-content-between align-items-center"
                          style={{ cursor: "pointer" }}
                          onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                        >
                          <span>{newSalesperson.region || "Select Region"}</span>
                          <i className="dropdown-toggle ms-2"></i>
                        </div>
                        {showRegionDropdown && (
                          <ul className="dropdown-menu w-100 show" style={{ position: "absolute", top: "100%", left: 0, zIndex: 1000 }}>
                            {["North", "South", "East", "West"].map((region, index) => (
                              <li key={index}>
                                <button
                                  type="button"
                                  className="dropdown-item"
                                  onClick={() => {
                                    setNewSalesperson({ ...newSalesperson, region });
                                    setShowRegionDropdown(false);
                                  }}
                                >
                                  {region}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">
                        Route <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="route"
                        placeholder="Enter Route"
                        value={newSalesperson.route}
                        onChange={(e) => setNewSalesperson({ ...newSalesperson, route: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Performance <span className="text-danger">*</span>
                      </label>
                      <div className="position-relative">
                        <div
                          className="form-control d-flex justify-content-between align-items-center"
                          style={{ cursor: "pointer" }}
                          onClick={() => setShowPerformanceDropdown(!showPerformanceDropdown)}
                        >
                          <span>{newSalesperson.performance || "Select Performance"}</span>
                          <i className="dropdown-toggle ms-2"></i>
                        </div>
                        {showPerformanceDropdown && (
                          <ul className="dropdown-menu w-100 show" style={{ position: "absolute", top: "100%", left: 0, zIndex: 1000 }}>
                            {["Excellent", "Good", "Average", "Poor"].map((performance, index) => (
                              <li key={index}>
                                <button
                                  type="button"
                                  className="dropdown-item"
                                  onClick={() => {
                                    setNewSalesperson({ ...newSalesperson, performance });
                                    setShowPerformanceDropdown(false);
                                  }}
                                >
                                  {performance}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">
                        Status <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-control"
                        name="status"
                        value={newSalesperson.status}
                        onChange={(e) => setNewSalesperson({ ...newSalesperson, status: e.target.value })}
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    {/* Empty column to maintain layout */}
                    <div className="col-md-6"></div>
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

        {/* Edit Salesperson Modal */}
        <div className="modal fade" id="editModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered"> {/* Increased size to modal-lg */}
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Edit Salesperson
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                <form onSubmit={handleEditSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">
                        Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Salesperson Name"
                        value={editSalesperson.name}
                        onChange={(e) => setEditSalesperson({ ...editSalesperson, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter Email"
                        value={editSalesperson.email}
                        onChange={(e) => setEditSalesperson({ ...editSalesperson, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">
                        Phone No <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Phone Number"
                        value={editSalesperson.phoneNo}
                        onChange={(e) => setEditSalesperson({ ...editSalesperson, phoneNo: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Region <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Region"
                        value={editSalesperson.region}
                        onChange={(e) => setEditSalesperson({ ...editSalesperson, region: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">
                        Route <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Route"
                        value={editSalesperson.route}
                        onChange={(e) => setEditSalesperson({ ...editSalesperson, route: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Performance <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Performance"
                        value={editSalesperson.performance}
                        onChange={(e) => setEditSalesperson({ ...editSalesperson, performance: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">
                        Status <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-control"
                        value={editSalesperson.status}
                        onChange={(e) => setEditSalesperson({ ...editSalesperson, status: e.target.value })}
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    {/* Empty column to maintain layout */}
                    <div className="col-md-6"></div>
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

        {/* View Salesperson Modal */}
        <div className="modal fade" id="viewModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  View Salesperson
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                {salespersonToView && (
                  <div className="mt-3">
                    <p><strong>Name:</strong> {salespersonToView.name}</p>
                    <p><strong>Email:</strong> {salespersonToView.email}</p>
                    <p><strong>Phone No:</strong> {salespersonToView.phoneNo}</p>
                    <p><strong>Region:</strong> {salespersonToView.region}</p>
                    <p><strong>Route:</strong> {salespersonToView.route}</p>
                    <p><strong>Performance:</strong> {salespersonToView.performance}</p>
                    <p><strong>Date Created:</strong> {formatDate(salespersonToView.dateCreated)}</p>
                    <p><strong>Status:</strong> {salespersonToView.status}</p>
                  </div>
                )}
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
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
                  <h6 className="modal-title fs-6">Delete Salesperson</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <p className="pb-3 mb-0">
                  Are you sure you want to delete the <strong>{salespersonToDelete?.name}</strong> salesperson permanently? This action cannot be undone.
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

export default SalespersonsLayer;