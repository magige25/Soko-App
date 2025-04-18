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

  const formatDate = (dateString) => {
    if (dateString === "TBD") return "TBD";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = creditorsRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(creditorsRequests.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "bg-success-focus text-success-600 px-24 py-4 radius-8 fw-medium text-sm";
      case "Pending":
        return "bg-warning-focus text-warning-600 px-24 py-4 radius-8 fw-medium text-sm";
      case "Rejected":
        return "bg-danger-focus text-danger-600 px-24 py-4 radius-8 fw-medium text-sm";
      default:
        return "bg-neutral-200 text-neutral-600 px-24 py-4 radius-8 fw-medium text-sm";
    }
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <form className="navbar-search">
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              name="search"
              placeholder="Search"
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
        </div>
      </div>

      <div className="card-body-table p-24">
        <div className="table-responsive scroll-sm">
          <table className="table table-borderless sm-table mb-0">
            <thead>
              <tr>
                <th scope="col" className="text-center py-3 px-6">ID</th>
                <th scope="col" className="text-start py-3 px-4">Name</th>
                <th scope="col" className="text-start py-3 px-4">Phone No.</th>
                <th scope="col" className="text-start py-3 px-4">Pricing Category</th>
                <th scope="col" className="text-start py-3 px-4">Customer Type</th>
                <th scope="col" className="text-start py-3 px-4">Route</th>
                <th scope="col" className="text-start py-3 px-4">Salesperson</th>
                <th scope="col" className="text-start py-3 px-4">Date Created</th>
                <th scope="col" className="text-start py-3 px-4">Status</th>
                <th scope="col" className="text-start py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((creditorRequest, index) => (
                  <tr key={index} style={{ transition: "background-color 0.2s" }}>
                    <td className="text-center small-text py-3 px-6">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="text-start small-text py-3 px-4">{creditorRequest.name}</td>
                    <td className="text-start small-text py-3 px-4">{creditorRequest.phoneNo}</td>
                    <td className="text-start small-text py-3 px-4">{creditorRequest.pricingCategory}</td>
                    <td className="text-start small-text py-3 px-4">{creditorRequest.customerType}</td>
                    <td className="text-start small-text py-3 px-4">{creditorRequest.route}</td>
                    <td className="text-start small-text py-3 px-4">{creditorRequest.salesperson}</td>
                    <td className="text-start small-text py-3 px-4">{formatDate(creditorRequest.dateCreated)}</td>
                    <td className="text-start small-text py-3 px-4">
                      <span className={getStatusClass(creditorRequest.status)}>
                        {creditorRequest.status}
                      </span>
                    </td>
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
                              <button
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#viewModal"
                                onClick={() => handleViewClick(creditorRequest)}
                              >
                                <Icon icon="ri-eye-line" />
                                View
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleApproveClick(creditorRequest)}
                              >
                                <Icon icon="ri-checkbox-circle-line" />
                                Approve
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleRejectClick(creditorRequest)}
                              >
                                <Icon icon="ri-close-circle-line" />
                                Reject                                
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
                  <td colSpan="10" className="text-center py-3">
                    No creditors requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="text-muted" style={{ fontSize: "13px" }}>
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, creditorsRequests.length)} of {creditorsRequests.length} entries
            </span>
          </div>
          <nav aria-label="Page navigation">
            <ul className="pagination mb-0" style={{ gap: "6px" }}>
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "24px", height: "24px", padding: "0", transition: "all 0.2s" }}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <Icon icon="ri-arrow-drop-left-line" style={{ fontSize: "12px" }} />
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                  <button
                    className={`page-link btn ${
                      currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"
                    } rounded-circle d-flex align-items-center justify-content-center`}
                    style={{
                      width: "30px",
                      height: "30px",
                      padding: "0",
                      transition: "all 0.2s",
                      fontSize: "10px",
                      color: currentPage === i + 1 ? "#fff" : "",
                    }}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "24px", height: "24px", padding: "0", transition: "all 0.2s" }}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <Icon icon="ri-arrow-drop-right-line" style={{ fontSize: "12px" }} />
                </button>
              </li>
            </ul>
          </nav>
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
  );
};

export default CreditorsRequestLayer;