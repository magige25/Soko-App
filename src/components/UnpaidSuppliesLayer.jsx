import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

const UnpaidSuppliesLayer = () => {
  const [UnpaidSupplies, setUnpaidSupplies] = useState([
    { name: "Kantaram Company", country: "MALI", orderNo: "ORD123", numberOfItems: "22", amount: 1025, dateOrdered: "2024 Jan 20", status: "Unpaid" },
    { name: "Morwabe Ventures", country: "MALI", orderNo: "ORD123", numberOfItems: "11", amount: 455, dateOrdered: "2024 Jan 5", status: "Unpaid" },
    { name: "Kireki Enterprises", country: "MALI", orderNo: "ORD123", numberOfItems: "15", amount: 675, dateOrdered: "2024 Jan 25", status: "Unpaid" },
    { name: "Nuru Limited", country: "MALI", orderNo: "ORD123", numberOfItems: "45", amount: 965, dateOrdered: "2024 Jan 2", status: "Unpaid" },
    { name: "Monte Company", country: "MALI", orderNo: "ORD123", numberOfItems: "21", amount: 1500, dateOrdered: "2024 Jan 5", status: "Unpaid" },
    { name: "Mayuo Ventures", country: "MALI", orderNo: "ORD123", numberOfItems: "90", amount: 755, dateOrdered: "2024 Jan 5", status: "Unpaid" },
  ]);

  const [editUnpaidSupplies, setEditUnpaidSupplies] = React.useState({ name: '', country: '', orderNo: '', numberOfItems: '', amount: '', dateOrdered: '', status: '' });
  const [UnpaidSuppliesToDelete, setUnpaidSuppliesToDelete] = React.useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleEditClick = (supply) => {
    setEditUnpaidSupplies(supply);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedUnpaidSupplies = UnpaidSupplies.map((r) =>
      r.name === editUnpaidSupplies.name ? { ...r, ...editUnpaidSupplies } : r
    );
    setUnpaidSupplies(updatedUnpaidSupplies);
  };

  const handleDeleteClick = (supply) => {
    setUnpaidSuppliesToDelete(supply);
  };

  const handleDeleteConfirm = () => {
    const updatedUnpaidSupplies = UnpaidSupplies.filter((r) => r.name !== UnpaidSuppliesToDelete.name);
    setUnpaidSupplies(updatedUnpaidSupplies);
    setUnpaidSuppliesToDelete(null);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = UnpaidSupplies.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(UnpaidSupplies.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="page-wrapper">
      <div className="row">
        {/* Unpaid Supplies table */}
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
                    <th className="text-start">Name</th>
                    <th className="text-start">Country</th>
                    <th className="text-start">Order No.</th>
                    <th className="text-start">No. Of Items</th>
                    <th className="text-start">Amount</th>
                    <th className="text-start">Date Ordered</th>
                    <th className="text-start">Status</th>
                    <th className="text-start">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((supply, index) => (
                    <tr key={index}>
                      <th scope="row" className="text-start small-text">{indexOfFirstItem + index + 1}</th>
                      <td className="text-start small-text">{supply.name}</td>
                      <td className="text-start small-text">{supply.country}</td>
                      <td className="text-start small-text">{supply.orderNo}</td>
                      <td className="text-start small-text">{supply.numberOfItems}</td>
                      <td className="text-start small-text">{supply.amount}</td>
                      <td className="text-start small-text">{supply.dateOrdered}</td>
                      <td className="text-start small-text">{supply.status}</td>
                      <td className="text-start small-text">
                        <div className="dropdown">
                          <button className="btn btn-light dropdown-toggle btn-sm" type="button" data-bs-toggle="dropdown">
                            Actions
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <Link
                                className="dropdown-item"
                                to={`/Unpaid-supplies/${supply.name}`}
                                state={{ supply }}
                                onClick={() => console.log("Link clicked:", supply)}
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
                                onClick={() => handleEditClick(supply)}
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(supply)}
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
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, UnpaidSupplies.length)} of {UnpaidSupplies.length} entries
                </span>
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

        {/* Edit Unpaid Supplies Modal */}
        <div className="modal fade" id="editModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Edit Unpaid Supplies
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Unpaid Supplies Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Unpaid Supplies Name"
                      value={editUnpaidSupplies.name}
                      onChange={(e) => setEditUnpaidSupplies({ ...editUnpaidSupplies, name: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Country"
                      value={editUnpaidSupplies.country}
                      onChange={(e) => setEditUnpaidSupplies({ ...editUnpaidSupplies, country: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Order No.</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Order No."
                      value={editUnpaidSupplies.orderNo}
                      onChange={(e) => setEditUnpaidSupplies({ ...editUnpaidSupplies, orderNo: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">No. of Items</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter Number of Items"
                      value={editUnpaidSupplies.numberOfItems}
                      onChange={(e) => setEditUnpaidSupplies({ ...editUnpaidSupplies, numberOfItems: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter Amount"
                      value={editUnpaidSupplies.amount}
                      onChange={(e) => setEditUnpaidSupplies({ ...editUnpaidSupplies, amount: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date Ordered</label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Enter Date"
                      value={editUnpaidSupplies.dateOrdered}
                      onChange={(e) => setEditUnpaidSupplies({ ...editUnpaidSupplies, dateOrdered: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Status"
                      value={editUnpaidSupplies.status}
                      onChange={(e) => setEditUnpaidSupplies({ ...editUnpaidSupplies, status: e.target.value })}
                    />
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
                  <h6 className="modal-title fs-6">Delete Unpaid Supplies</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <p className="pb-3 mb-0">
                  Are you sure you want to delete the <strong>{UnpaidSuppliesToDelete?.name}</strong> Unpaid Supply permanently? This action cannot be undone.
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

export default UnpaidSuppliesLayer;