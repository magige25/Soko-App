import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

const PendingSuppliesLayer = () => {
  const [pendingSupplies, setPendingSupplies] = useState([
    { name: "Apexio Company", country: "Kenya", orderNo: "ORD123", numberOfItems: 22, amount: 1025, dateOrdered: "2025-01-24", status: "Received" },
    { name: "Joy Link Ventures", country: "Uganda", orderNo: "ORD124", numberOfItems: 11, amount: 455, dateOrdered: "2025-01-24", status: "Received" },
    { name: "Charmie Enterprises", country: "Tanzania", orderNo: "ORD125", numberOfItems: 15, amount: 675, dateOrdered: "2025-01-24", status: "Received" },
    { name: "Customs Limited", country: "USA", orderNo: "ORD126", numberOfItems: 45, amount: 965, dateOrdered: "2025-01-24", status: "Not Received" },
    { name: "Plastic Company", country: "Nigeria", orderNo: "ORD127", numberOfItems: 21, amount: 1500, dateOrdered: "2025-01-24", status: "Not Received" },
    { name: "Wesa Ventures", country: "United Kingdom", orderNo: "ORD128", numberOfItems: 90, amount: 755, dateOrdered: "2025-01-24", status: "Received" },
  ]);

  const [editPendingSupplies, setEditPendingSupplies] = useState({ name: '', country: '', orderNo: '', numberOfItems: '', amount: '', status: '' });
  const [newPendingSupplies, setNewPendingSupplies] = useState({ name: '', country: '', orderNo: '', numberOfItems: '', amount: '', status: '' });
  const [pendingSuppliesToDelete, setPendingSuppliesToDelete] = useState(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Function to format amount as dollars
  const formatAmount = (amount) => {
    return `$${Number(amount).toLocaleString()}`;
  };

  // Function to format the date as "24 Jan 2025"
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

  // Handle form submission for adding new pending supplies
  const handleAddPendingSupplies = (e) => {
    e.preventDefault();
    if (!newPendingSupplies.name || !newPendingSupplies.country || !newPendingSupplies.orderNo || 
        !newPendingSupplies.numberOfItems || !newPendingSupplies.amount || !newPendingSupplies.status) {
      alert("Please fill in all required fields before saving.");
      return;
    }
    const newPendingSuppliesData = {
      name: newPendingSupplies.name,
      country: newPendingSupplies.country,
      orderNo: newPendingSupplies.orderNo,
      numberOfItems: Number(newPendingSupplies.numberOfItems),
      amount: Number(newPendingSupplies.amount),
      dateOrdered: newPendingSupplies.dateOrdered,
      status: newPendingSupplies.status,
    };
    setPendingSupplies([...pendingSupplies, newPendingSuppliesData]);
    setNewPendingSupplies({ name: '', country: '', orderNo: '', numberOfItems: '', amount: '', status: '' });
  };

  // Handle edit click
  const handleEditClick = (pendingSupply) => {
    setEditPendingSupplies(pendingSupply);
  };

  // Handle edit submission
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedPendingSupplies = pendingSupplies.map((r) =>
      r.name === editPendingSupplies.name && r.orderNo === editPendingSupplies.orderNo ? { ...r, ...editPendingSupplies } : r
    );
    setPendingSupplies(updatedPendingSupplies);
    setEditPendingSupplies({ name: '', country: '', orderNo: '', numberOfItems: '', amount: '', status: '' });
  };

  // Handle delete click
  const handleDeleteClick = (pendingSupply) => {
    setPendingSuppliesToDelete(pendingSupply);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    const updatedPendingSupplies = pendingSupplies.filter((r) => r.name !== pendingSuppliesToDelete.name || r.orderNo !== pendingSuppliesToDelete.orderNo);
    setPendingSupplies(updatedPendingSupplies);
    setPendingSuppliesToDelete(null);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pendingSupplies.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pendingSupplies.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="page-wrapper">
      <div className="row">
        {/* Add Supply */}
        <div className="d-flex align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="ms-auto">
            <button
              type="button"
              className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add Supply
            </button>
          </div>
        </div>

        {/* Pending Supplies table */}
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
                  {currentItems.map((pendingSupply, index) => (
                    <tr key={index}>
                      <th scope="row" className="text-start small-text">{indexOfFirstItem + index + 1}</th>
                      <td className="text-start small-text">{pendingSupply.name}</td>
                      <td className="text-start small-text">{pendingSupply.country}</td>
                      <td className="text-start small-text">{pendingSupply.orderNo}</td>
                      <td className="text-start small-text">{pendingSupply.numberOfItems}</td>
                      <td className="text-start small-text">{formatAmount(pendingSupply.amount)}</td>
                      <td className="text-start small-text">{formatDate(pendingSupply.dateOrdered)}</td>
                      <td className="text-start small-text">{pendingSupply.status}</td>
                      <td className="text-start small-text">
                        <div className="dropdown">
                          <button className="btn btn-light dropdown-toggle btn-sm" type="button" data-bs-toggle="dropdown">
                            Actions
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <Link
                                className="dropdown-item"
                                to={`/pending-supplies/${pendingSupply.orderNo}`}
                                state={{ pendingSupply }}
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
                                onClick={() => handleEditClick(pendingSupply)}
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(pendingSupply)}
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
                <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, pendingSupplies.length)} of {pendingSupplies.length} entries</span>
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

        {/* Add Pending Supplies Modal */}
        <div className="modal fade" id="exampleModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Add Supply
                  <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => setNewPendingSupplies({ name: '', country: '', orderNo: '', numberOfItems: '', amount: '', status: '' })}></button>
                </h6>
                <form onSubmit={handleAddPendingSupplies}>
                  <div className="mb-3">
                    <label className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control w-100"
                      name="name"
                      placeholder="Enter Supplier Name"
                      value={newPendingSupplies.name}
                      onChange={(e) => setNewPendingSupplies({ ...newPendingSupplies, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <div className="position-relative">
                      <label className="form-label">
                        Country <span className="text-danger">*</span>
                      </label>
                      <div
                        className="form-control d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      >
                        <span>{newPendingSupplies.country || "Select Country"}</span>
                        <i className="dropdown-toggle ms-2"></i>
                      </div>
                      {showCountryDropdown && (
                        <ul className="dropdown-menu w-100 show" style={{ position: "absolute", top: "100%", left: 0, zIndex: 1000 }}>
                          {["Kenya", "Uganda", "Tanzania", "USA", "Nigeria", "United Kingdom"].map((country, index) => (
                            <li key={index}>
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => {
                                  setNewPendingSupplies({ ...newPendingSupplies, country });
                                  setShowCountryDropdown(false);
                                }}
                              >
                                {country}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Order No. <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control w-100"
                      name="orderNo"
                      placeholder="Enter Order Number"
                      value={newPendingSupplies.orderNo}
                      onChange={(e) => setNewPendingSupplies({ ...newPendingSupplies, orderNo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      No. Of Items <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control w-100"
                      name="numberOfItems"
                      placeholder="Enter No. Of Items"
                      value={newPendingSupplies.numberOfItems}
                      onChange={(e) => setNewPendingSupplies({ ...newPendingSupplies, numberOfItems: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Amount <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control w-100"
                      name="amount"
                      placeholder="Enter Amount"
                      value={newPendingSupplies.amount}
                      onChange={(e) => setNewPendingSupplies({ ...newPendingSupplies, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <div className="position-relative">
                      <label className="form-label">
                        Status <span className="text-danger">*</span>
                      </label>
                      <div
                        className="form-control d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                      >
                        <span>{newPendingSupplies.status || "Select Status"}</span>
                        <i className="dropdown-toggle ms-2"></i>
                      </div>
                      {showStatusDropdown && (
                        <ul className="dropdown-menu w-100 show" style={{ position: "absolute", top: "100%", left: 0, zIndex: 1000 }}>
                          {["Received", "Not Received"].map((status, index) => (
                            <li key={index}>
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => {
                                  setNewPendingSupplies({ ...newPendingSupplies, status });
                                  setShowStatusDropdown(false);
                                }}
                              >
                                {status}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
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

        {/* Edit Pending Supplies Modal */}
        <div className="modal fade" id="editModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Edit Supply
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label className="form-label">
                      Supplier Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Supplier Name"
                      value={editPendingSupplies.name}
                      onChange={(e) => setEditPendingSupplies({ ...editPendingSupplies, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Country <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Country"
                      value={editPendingSupplies.country}
                      onChange={(e) => setEditPendingSupplies({ ...editPendingSupplies, country: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Order No. <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Order Number"
                      value={editPendingSupplies.orderNo}
                      onChange={(e) => setEditPendingSupplies({ ...editPendingSupplies, orderNo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      No. Of Items <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter No. Of Items"
                      value={editPendingSupplies.numberOfItems}
                      onChange={(e) => setEditPendingSupplies({ ...editPendingSupplies, numberOfItems: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Amount <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter Amount"
                      value={editPendingSupplies.amount}
                      onChange={(e) => setEditPendingSupplies({ ...editPendingSupplies, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Status <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      value={editPendingSupplies.status}
                      onChange={(e) => setEditPendingSupplies({ ...editPendingSupplies, status: e.target.value })}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Received">Received</option>
                      <option value="Not Received">Not Received</option>
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

        {/* Delete Confirmation Modal */}
        <div className="modal fade" id="deleteModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body pt-3 ps-18 pe-18">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="modal-title fs-6">Delete Pending Supply</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <p className="pb-3 mb-0">
                  Are you sure you want to delete the <strong>{pendingSuppliesToDelete?.name} (Order {pendingSuppliesToDelete?.orderNo})</strong> pending supply permanently? This action cannot be undone.
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

export default PendingSuppliesLayer;