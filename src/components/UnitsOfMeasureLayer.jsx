import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

const UnitsOfMeasureLayer = () => {
  const [unitsOfMeasure, setUnitsOfMeasure] = useState([
    { name: "Kilogram", numberOfPieces: 1000, status: "Active" },
    { name: "Liter", numberOfPieces: 500, status: "Active" },
    { name: "Piece", numberOfPieces: 1, status: "Inactive" },
  ]);

  const [editUnitOfMeasure, setEditUnitOfMeasure] = useState({ name: '', numberOfPieces: '', status: '' });
  const [newUnitOfMeasure, setNewUnitOfMeasure] = useState({ name: '', numberOfPieces: '', status: '' });
  const [unitOfMeasureToDelete, setUnitOfMeasureToDelete] = useState(null);
  const [unitOfMeasureToView, setUnitOfMeasureToView] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleEditClick = (unitOfMeasure) => {
    setEditUnitOfMeasure(unitOfMeasure);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedUnitsOfMeasure = unitsOfMeasure.map((r) =>
      r.name === editUnitOfMeasure.name ? { ...r, ...editUnitOfMeasure } : r
    );
    setUnitsOfMeasure(updatedUnitsOfMeasure);
    setEditUnitOfMeasure({ name: '', numberOfPieces: '', status: '' });
  };

  const handleDeleteClick = (unitOfMeasure) => {
    setUnitOfMeasureToDelete(unitOfMeasure);
  };

  const handleDeleteConfirm = () => {
    const updatedUnitsOfMeasure = unitsOfMeasure.filter((r) => r.name !== unitOfMeasureToDelete.name);
    setUnitsOfMeasure(updatedUnitsOfMeasure);
    setUnitOfMeasureToDelete(null);
  };

  const handleAddUnitOfMeasure = (e) => {
    e.preventDefault();
    if (!newUnitOfMeasure.name || !newUnitOfMeasure.numberOfPieces || !newUnitOfMeasure.status) {
      alert("Please fill in all required fields before saving.");
      return;
    }
    const newUnitOfMeasureData = { ...newUnitOfMeasure, numberOfPieces: parseInt(newUnitOfMeasure.numberOfPieces) };
    setUnitsOfMeasure([...unitsOfMeasure, newUnitOfMeasureData]);
    setNewUnitOfMeasure({ name: '', numberOfPieces: '', status: '' });
  };

  const handleViewClick = (unitOfMeasure) => {
    setUnitOfMeasureToView(unitOfMeasure);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = unitsOfMeasure.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(unitsOfMeasure.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="page-wrapper">
      <div className="row">
        {/* Add Unit of Measure */}
        <div className="d-flex align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="ms-auto">
            <button
              type="button"
              className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add Unit of Measure
            </button>
          </div>
        </div>

        {/* Units of Measure table */}
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
                    <th className="text-start">Number of Pieces</th>
                    <th className="text-start">Status</th>
                    <th className="text-start">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((unitOfMeasure, index) => (
                    <tr key={index}>
                      <th scope="row" className="text-start small-text">{indexOfFirstItem + index + 1}</th>
                      <td className="text-start small-text">{unitOfMeasure.name}</td>
                      <td className="text-start small-text">{unitOfMeasure.numberOfPieces}</td>
                      <td className="text-start small-text">{unitOfMeasure.status}</td>
                      <td className="text-start small-text">
                        <div className="dropdown">
                          <button className="btn btn-light dropdown-toggle btn-sm" type="button" data-bs-toggle="dropdown">
                            Actions
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#viewModal"
                                onClick={() => handleViewClick(unitOfMeasure)}
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
                                onClick={() => handleEditClick(unitOfMeasure)}
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(unitOfMeasure)}
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
                <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, unitsOfMeasure.length)} of {unitsOfMeasure.length} entries</span>
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

        {/* Add Unit of Measure Modal */}
        <div className="modal fade" id="exampleModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Add Unit of Measure
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                <form onSubmit={handleAddUnitOfMeasure}>
                  <div className="mb-3">
                    <label className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Enter Unit Name"
                      value={newUnitOfMeasure.name}
                      onChange={(e) => setNewUnitOfMeasure({ ...newUnitOfMeasure, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Number of Pieces <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="numberOfPieces"
                      placeholder="Enter Number of Pieces"
                      value={newUnitOfMeasure.numberOfPieces}
                      onChange={(e) => setNewUnitOfMeasure({ ...newUnitOfMeasure, numberOfPieces: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Status <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      name="status"
                      value={newUnitOfMeasure.status}
                      onChange={(e) => setNewUnitOfMeasure({ ...newUnitOfMeasure, status: e.target.value })}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
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

        {/* Edit Unit of Measure Modal */}
        <div className="modal fade" id="editModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Edit Unit of Measure
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Unit Name"
                      value={editUnitOfMeasure.name}
                      onChange={(e) => setEditUnitOfMeasure({ ...editUnitOfMeasure, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Number of Pieces <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter Number of Pieces"
                      value={editUnitOfMeasure.numberOfPieces}
                      onChange={(e) => setEditUnitOfMeasure({ ...editUnitOfMeasure, numberOfPieces: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Status <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      value={editUnitOfMeasure.status}
                      onChange={(e) => setEditUnitOfMeasure({ ...editUnitOfMeasure, status: e.target.value })}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
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

        {/* View Unit of Measure Modal */}
        <div className="modal fade" id="viewModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  View Unit of Measure
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                {unitOfMeasureToView && (
                  <div className="mt-3">
                    <p><strong>Name:</strong> {unitOfMeasureToView.name}</p>
                    <p><strong>Number of Pieces:</strong> {unitOfMeasureToView.numberOfPieces}</p>
                    <p><strong>Status:</strong> {unitOfMeasureToView.status}</p>
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
                  <h6 className="modal-title fs-6">Delete Unit of Measure</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <p className="pb-3 mb-0">
                  Are you sure you want to delete the <strong>{unitOfMeasureToDelete?.name}</strong> unit of measure permanently? This action cannot be undone.
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

export default UnitsOfMeasureLayer;