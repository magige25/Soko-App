import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

const SuppliersLayer = () => {
  const [suppliers, setSuppliers] = useState([
    { name: "Apexio Company", email: "apexio@gmail.com", phoneNo: "756453475", country: "Kenya", paymentMethod: "Cash", status: "Active" },
    { name: "Joy Link Ventures", email: "joylink@gmail.com", phoneNo: "756453475", country: "Uganda", paymentMethod: "Bank", status: "Active" },
    { name: "Charmie Enterprises", email: "charmie@gmail.com", phoneNo: "756453475", country: "Tanzania", paymentMethod: "Cash", status: "Active" },
    { name: "Customs Limited", email: "customs@gmail.com", phoneNo: "756453475", country: "USA", paymentMethod: "Paybill", status: "Inactive" },
    { name: "Plastic Company", email: "plastic@gmail.com", phoneNo: "756453475", country: "Nigeria", paymentMethod: "Cash", status: "Active" },
    { name: "Wesa Ventures", email: "wesa@gmail.com", phoneNo: "756453475", country: "United Kingdom", paymentMethod: "Paybill", status: "Active" },
  ]);

  const [editSupplier, setEditSupplier] = useState({ name: '', email: '', phoneNo: '', country: '', paymentMethod: '', status: '' });
  const [newSupplier, setNewSupplier] = useState({ name: '', email: '', phoneNo: '', country: '', paymentMethod: '', status: '' });
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleEditClick = (supplier) => {
    setEditSupplier(supplier);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedSuppliers = suppliers.map((r) =>
      r.name === editSupplier.name ? { ...r, ...editSupplier } : r
    );
    setSuppliers(updatedSuppliers);
    setEditSupplier({ name: '', email: '', phoneNo: '', country: '', paymentMethod: '', status: '' });
  };

  const handleDeleteClick = (supplier) => {
    setSupplierToDelete(supplier);
  };

  const handleDeleteConfirm = () => {
    const updatedSuppliers = suppliers.filter((r) => r.name !== supplierToDelete.name);
    setSuppliers(updatedSuppliers);
    setSupplierToDelete(null);
  };

  const handleAddSupplier = (e) => {
    e.preventDefault();
    if (!newSupplier.name || !newSupplier.email || !newSupplier.phoneNo || !newSupplier.country || !newSupplier.paymentMethod || !newSupplier.status) {
      alert("Please fill in all required fields before saving.");
      return;
    }
    const newSupplierData = {
      name: newSupplier.name,
      email: newSupplier.email,
      phoneNo: newSupplier.phoneNo,
      country: newSupplier.country,
      paymentMethod: newSupplier.paymentMethod,
      status: newSupplier.status,
    };
    setSuppliers([...suppliers, newSupplierData]);
    setNewSupplier({ name: '', email: '', phoneNo: '', country: '', paymentMethod: '', status: '' });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = suppliers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(suppliers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="page-wrapper">
      <div className="row">
        {/* Add Supplier */}
        <div className="d-flex align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="ms-auto">
            <button
              type="button"
              className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add Supplier
            </button>
          </div>
        </div>

        {/* Suppliers table */}
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
                    <th className="text-start">Country</th>
                    <th className="text-start">Payment Method</th>
                    <th className="text-start">Status</th>
                    <th className="text-start">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((supplier, index) => (
                    <tr key={index}>
                      <th scope="row" className="text-start small-text">{indexOfFirstItem + index + 1}</th>
                      <td className="text-start small-text">{supplier.name}</td>
                      <td className="text-start small-text">{supplier.email}</td>
                      <td className="text-start small-text">{supplier.phoneNo}</td>
                      <td className="text-start small-text">{supplier.country}</td>
                      <td className="text-start small-text">{supplier.paymentMethod}</td>
                      <td className="text-start small-text">{supplier.status}</td>
                      <td className="text-start small-text">
                        <div className="dropdown">
                          <button className="btn btn-light dropdown-toggle btn-sm" type="button" data-bs-toggle="dropdown">
                            Actions
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <Link
                                className="dropdown-item"
                                to={`/suppliers/${supplier.name}`}
                                state={{ supplier }}
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
                                onClick={() => handleEditClick(supplier)}
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(supplier)}
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
                <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, suppliers.length)} of {suppliers.length} entries</span>
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

        {/* Add Supplier Modal */}
        <div className="modal fade" id="exampleModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Add Supplier
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                <form onSubmit={handleAddSupplier}>
                  <div className="mb-3">
                    <label className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control w-100"
                      name="name"
                      placeholder="Enter Supplier Name"
                      value={newSupplier.name}
                      onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control w-100"
                      name="email"
                      placeholder="Enter Email"
                      value={newSupplier.email}
                      onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Phone No <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control w-100"
                      name="phoneNo"
                      placeholder="Enter Phone Number"
                      value={newSupplier.phoneNo}
                      onChange={(e) => setNewSupplier({ ...newSupplier, phoneNo: e.target.value })}
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
                        <span>{newSupplier.country || "Select Country"}</span>
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
                                  setNewSupplier({ ...newSupplier, country });
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
                    <div className="position-relative">
                      <label className="form-label">
                        Payment Method <span className="text-danger">*</span>
                      </label>
                      <div
                        className="form-control d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
                      >
                        <span>{newSupplier.paymentMethod || "Select Payment Method"}</span>
                        <i className="dropdown-toggle ms-2"></i>
                      </div>
                      {showPaymentDropdown && (
                        <ul className="dropdown-menu w-100 show" style={{ position: "absolute", top: "100%", left: 0, zIndex: 1000 }}>
                          {["Cash", "Bank", "Paybill"].map((paymentMethod, index) => (
                            <li key={index}>
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => {
                                  setNewSupplier({ ...newSupplier, paymentMethod });
                                  setShowPaymentDropdown(false);
                                }}
                              >
                                {paymentMethod}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Status <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      name="status"
                      value={newSupplier.status}
                      onChange={(e) => setNewSupplier({ ...newSupplier, status: e.target.value })}
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

        {/* Edit Supplier Modal */}
        <div className="modal fade" id="editModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Edit Supplier
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
                      placeholder="Enter Supplier Name"
                      value={editSupplier.name}
                      onChange={(e) => setEditSupplier({ ...editSupplier, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter Email"
                      value={editSupplier.email}
                      onChange={(e) => setEditSupplier({ ...editSupplier, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Phone No <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Phone Number"
                      value={editSupplier.phoneNo}
                      onChange={(e) => setEditSupplier({ ...editSupplier, phoneNo: e.target.value })}
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
                      value={editSupplier.country}
                      onChange={(e) => setEditSupplier({ ...editSupplier, country: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Payment Method <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Payment Method"
                      value={editSupplier.paymentMethod}
                      onChange={(e) => setEditSupplier({ ...editSupplier, paymentMethod: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Status <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      value={editSupplier.status}
                      onChange={(e) => setEditSupplier({ ...editSupplier, status: e.target.value })}
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

        {/* Delete Confirmation Modal */}
        <div className="modal fade" id="deleteModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body pt-3 ps-18 pe-18">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="modal-title fs-6">Delete Supplier</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <p className="pb-3 mb-0">
                  Are you sure you want to delete the <strong>{supplierToDelete?.name}</strong> supplier permanently? This action cannot be undone.
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

export default SuppliersLayer;