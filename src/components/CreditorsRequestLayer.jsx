import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const CreditorsRequestLayer = () => {
  const [creditorsRequests, setCreditorsRequests] = useState([
    { name: "Alice Brown", phoneNo: "0732145656", pricingCategory: "Standard", customerType: "Retail", route: "Route A", salesperson: "John Doe", dateCreated: "2023-01-15", status: "Pending" },
    { name: "Bob White", phoneNo: "0786352347", pricingCategory: "Premium", customerType: "Wholesale", route: "Route B", salesperson: "Jane Smith", dateCreated: "2023-02-20", status: "Approved" },
    { name: "Charlie Green", phoneNo: "0798651345", pricingCategory: "Discount", customerType: "Retail", route: "Route C", salesperson: "Mike Johnson", dateCreated: "2023-03-10", status: "Rejected" },
  ]);

  const [creditorRequestToView, setCreditorRequestToView] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleViewClick = (creditorRequest) => {
    setCreditorRequestToView(creditorRequest);
  };

  const handleApproveClick = (creditorRequest) => {
    const updatedCreditorsRequests = creditorsRequests.map((r) =>
      r.name === creditorRequest.name ? { ...r, status: "Approved" } : r
    );
    setCreditorsRequests(updatedCreditorsRequests);
  };

  const handleRejectClick = (creditorRequest) => {
    const updatedCreditorsRequests = creditorsRequests.map((r) =>
      r.name === creditorRequest.name ? { ...r, status: "Rejected" } : r
    );
    setCreditorsRequests(updatedCreditorsRequests);
  };

  // Format date as day month year (e.g., "15 Jan 2023")
  const formatDate = (dateString) => {
    if (dateString === "TBD") return "TBD";
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
  const currentItems = creditorsRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(creditorsRequests.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to determine status class with tighter padding
  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "bg-success text-white px-1 py-0 rounded";
      case "Pending":
        return "bg-warning text-dark px-1 py-0 rounded";
      case "Rejected":
        return "bg-danger text-white px-1 py-0 rounded";
      default:
        return "bg-secondary text-white px-1 py-0 rounded";
    }
  };

  return (
    <div className="page-wrapper">
      <div className="row">
        {/* Creditors Requests table */}
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
                    <th className="text-start">Phone No.</th>
                    <th className="text-start">Pricing Category</th>
                    <th className="text-start">Customer Type</th>
                    <th className="text-start">Route</th>
                    <th className="text-start">Salesperson</th>
                    <th className="text-start">Date Created</th>
                    <th className="text-start">Status</th>
                    <th className="text-start">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((creditorRequest, index) => (
                    <tr key={index}>
                      <th scope="row" className="text-start small-text">{indexOfFirstItem + index + 1}</th>
                      <td className="text-start small-text">{creditorRequest.name}</td>
                      <td className="text-start small-text">{creditorRequest.phoneNo}</td>
                      <td className="text-start small-text">{creditorRequest.pricingCategory}</td>
                      <td className="text-start small-text">{creditorRequest.customerType}</td>
                      <td className="text-start small-text">{creditorRequest.route}</td>
                      <td className="text-start small-text">{creditorRequest.salesperson}</td>
                      <td className="text-start small-text">{formatDate(creditorRequest.dateCreated)}</td>
                      <td className="text-start small-text">
                        <span className={getStatusClass(creditorRequest.status)}>{creditorRequest.status}</span>
                      </td>
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
                                onClick={() => handleViewClick(creditorRequest)}
                              >
                                View
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleApproveClick(creditorRequest)}
                              >
                                Approve
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleRejectClick(creditorRequest)}
                              >
                                Reject
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
                <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, creditorsRequests.length)} of {creditorsRequests.length} entries</span>
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

        {/* View Creditor Request Modal */}
        <div className="modal fade" id="viewModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  View Creditor Request
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                {creditorRequestToView && (
                  <div className="mt-3">
                    <p><strong>Name:</strong> {creditorRequestToView.name}</p>
                    <p><strong>Phone No:</strong> {creditorRequestToView.phoneNo}</p>
                    <p><strong>Pricing Category:</strong> {creditorRequestToView.pricingCategory}</p>
                    <p><strong>Customer Type:</strong> {creditorRequestToView.customerType}</p>
                    <p><strong>Route:</strong> {creditorRequestToView.route}</p>
                    <p><strong>Salesperson:</strong> {creditorRequestToView.salesperson}</p>
                    <p><strong>Date Created:</strong> {formatDate(creditorRequestToView.dateCreated)}</p>
                    <p>
                      <strong>Status:</strong>
                      <span className={getStatusClass(creditorRequestToView.status)} style={{ marginLeft: '8px' }}>
                        {creditorRequestToView.status}
                      </span>
                    </p>
                  </div>
                )}
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditorsRequestLayer;