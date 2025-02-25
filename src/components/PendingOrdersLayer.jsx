import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

const PendingOrdersLayer = () => {
  const [pendingOrders, setPendingOrders] = useState([
    { orderNumber: "ORD001", customer: "Alice Brown", outletName: "Main Store", customerType: "Retail", pricingCategories: "Standard", amount: 150.00, dateOrdered: "2023-01-15", status: "Pending" },
    { orderNumber: "ORD002", customer: "Bob White", outletName: "West Branch", customerType: "Wholesale", pricingCategories: "Premium", amount: 500.00, dateOrdered: "2023-02-20", status: "Pending" },
    { orderNumber: "ORD003", customer: "Charlie Green", outletName: "East Outlet", customerType: "Retail", pricingCategories: "Discount", amount: 75.00, dateOrdered: "2023-03-10", status: "Pending" },
  ]);

  const [editPendingOrder, setEditPendingOrder] = useState({ orderNumber: '', customer: '', outletName: '', customerType: '', pricingCategories: '', amount: '', status: '' });
  const [pendingOrderToDelete, setPendingOrderToDelete] = useState(null);
  const [pendingOrderToView, setPendingOrderToView] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleEditClick = (pendingOrder) => {
    setEditPendingOrder(pendingOrder);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedPendingOrders = pendingOrders.map((r) =>
      r.orderNumber === editPendingOrder.orderNumber ? { ...r, ...editPendingOrder } : r
    );
    setPendingOrders(updatedPendingOrders);
    setEditPendingOrder({ orderNumber: '', customer: '', outletName: '', customerType: '', pricingCategories: '', amount: '', status: '' });
  };

  const handleDeleteClick = (pendingOrder) => {
    setPendingOrderToDelete(pendingOrder);
  };

  const handleDeleteConfirm = () => {
    const updatedPendingOrders = pendingOrders.filter((r) => r.orderNumber !== pendingOrderToDelete.orderNumber);
    setPendingOrders(updatedPendingOrders);
    setPendingOrderToDelete(null);
  };

  const handleViewClick = (pendingOrder) => {
    setPendingOrderToView(pendingOrder);
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
  const currentItems = pendingOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pendingOrders.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="page-wrapper">
      <div className="row">
        {/* Pending Orders table */}
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
                    <th className="text-start">Order Number</th>
                    <th className="text-start">Customer</th>
                    <th className="text-start">Outlet Name</th>
                    <th className="text-start">Customer Type</th>
                    <th className="text-start">Pricing Categories</th>
                    <th className="text-start">Amount</th>
                    <th className="text-start">Date Ordered</th>
                    <th className="text-start">Status</th>
                    <th className="text-start">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((pendingOrder, index) => (
                    <tr key={index}>
                      <th scope="row" className="text-start small-text">{indexOfFirstItem + index + 1}</th>
                      <td className="text-start small-text">{pendingOrder.orderNumber}</td>
                      <td className="text-start small-text">{pendingOrder.customer}</td>
                      <td className="text-start small-text">{pendingOrder.outletName}</td>
                      <td className="text-start small-text">{pendingOrder.customerType}</td>
                      <td className="text-start small-text">{pendingOrder.pricingCategories}</td>
                      <td className="text-start small-text">{pendingOrder.amount.toFixed(2)}</td>
                      <td className="text-start small-text">{formatDate(pendingOrder.dateOrdered)}</td>
                      <td className="text-start small-text">{pendingOrder.status}</td>
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
                                onClick={() => handleViewClick(pendingOrder)}
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
                                onClick={() => handleEditClick(pendingOrder)}
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(pendingOrder)}
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
                <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, pendingOrders.length)} of {pendingOrders.length} entries</span>
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

        {/* Edit Pending Order Modal */}
        <div className="modal fade" id="editModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Edit Pending Order
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                <form onSubmit={handleEditSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">
                        Order Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Order Number"
                        value={editPendingOrder.orderNumber}
                        onChange={(e) => setEditPendingOrder({ ...editPendingOrder, orderNumber: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Customer <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Customer Name"
                        value={editPendingOrder.customer}
                        onChange={(e) => setEditPendingOrder({ ...editPendingOrder, customer: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">
                        Outlet Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Outlet Name"
                        value={editPendingOrder.outletName}
                        onChange={(e) => setEditPendingOrder({ ...editPendingOrder, outletName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Customer Type <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Customer Type"
                        value={editPendingOrder.customerType}
                        onChange={(e) => setEditPendingOrder({ ...editPendingOrder, customerType: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">
                        Pricing Categories <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Pricing Categories"
                        value={editPendingOrder.pricingCategories}
                        onChange={(e) => setEditPendingOrder({ ...editPendingOrder, pricingCategories: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Amount <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        placeholder="Enter Amount"
                        value={editPendingOrder.amount}
                        onChange={(e) => setEditPendingOrder({ ...editPendingOrder, amount: parseFloat(e.target.value) || '' })}
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
                        value={editPendingOrder.status}
                        onChange={(e) => setEditPendingOrder({ ...editPendingOrder, status: e.target.value })}
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Processed">Processed</option>
                        <option value="Cancelled">Cancelled</option>
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

        {/* View Pending Order Modal */}
        <div className="modal fade" id="viewModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  View Pending Order
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                {pendingOrderToView && (
                  <div className="mt-3">
                    <p><strong>Order Number:</strong> {pendingOrderToView.orderNumber}</p>
                    <p><strong>Customer:</strong> {pendingOrderToView.customer}</p>
                    <p><strong>Outlet Name:</strong> {pendingOrderToView.outletName}</p>
                    <p><strong>Customer Type:</strong> {pendingOrderToView.customerType}</p>
                    <p><strong>Pricing Categories:</strong> {pendingOrderToView.pricingCategories}</p>
                    <p><strong>Amount:</strong> {pendingOrderToView.amount.toFixed(2)}</p>
                    <p><strong>Date Ordered:</strong> {formatDate(pendingOrderToView.dateOrdered)}</p>
                    <p><strong>Status:</strong> {pendingOrderToView.status}</p>
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
                  <h6 className="modal-title fs-6">Delete Pending Order</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <p className="pb-3 mb-0">
                  Are you sure you want to delete the order <strong>{pendingOrderToDelete?.orderNumber}</strong> permanently? This action cannot be undone.
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

export default PendingOrdersLayer;