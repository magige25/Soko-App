import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

const CustomersLayer = () => {
  const [customers, setCustomers] = useState([
    { name: "Alice Brown", phoneNo: "0789875432", pricingCategory: "Standard", customerType: "Retail", route: "Route A", salesperson: "John Doe", dateCreated: "2023-01-15" },
    { name: "Bob White", phoneNo: "0715647698", pricingCategory: "Premium", customerType: "Wholesale", route: "Route B", salesperson: "Jane Smith", dateCreated: "2023-02-20" },
    { name: "Charlie Green", phoneNo: "0743569012", pricingCategory: "Discount", customerType: "Retail", route: "Route C", salesperson: "Mike Johnson", dateCreated: "2023-03-10" },
  ]);

  const [editCustomer, setEditCustomer] = useState({ name: '', phoneNo: '', pricingCategory: '', customerType: '', route: '', salesperson: '' });
  const [newCustomer, setNewCustomer] = useState({ name: '', phoneNo: '', pricingCategory: '', customerType: '', route: '', salesperson: '' });
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [customerToView, setCustomerToView] = useState(null);
  const [showPricingCategoryDropdown, setShowPricingCategoryDropdown] = useState(false);
  const [showCustomerTypeDropdown, setShowCustomerTypeDropdown] = useState(false);
  const [showSalespersonDropdown, setShowSalespersonDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const salespeople = ["John Doe", "Jane Smith", "Mike Johnson"];

  const handleEditClick = (customer) => {
    setEditCustomer(customer);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedCustomers = customers.map((r) =>
      r.name === editCustomer.name ? { ...r, ...editCustomer } : r
    );
    setCustomers(updatedCustomers);
    setEditCustomer({ name: '', phoneNo: '', pricingCategory: '', customerType: '', route: '', salesperson: '' });
  };

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
  };

  const handleDeleteConfirm = () => {
    const updatedCustomers = customers.filter((r) => r.name !== customerToDelete.name);
    setCustomers(updatedCustomers);
    setCustomerToDelete(null);
  };

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phoneNo || !newCustomer.pricingCategory || !newCustomer.customerType || !newCustomer.route || !newCustomer.salesperson) {
      alert("Please fill in all required fields before saving.");
      return;
    }
    const newCustomerData = {
      ...newCustomer,
      dateCreated: "TBD",
    };
    setCustomers([...customers, newCustomerData]);
    setNewCustomer({ name: '', phoneNo: '', pricingCategory: '', customerType: '', route: '', salesperson: '' });
  };

  const handleViewClick = (customer) => {
    setCustomerToView(customer);
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
  const currentItems = customers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(customers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
        <button
          type="button"
          className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
          Add Customer
        </button>
      </div>

      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          <table className="table table-borderless sm-table mb-0">
            <thead>
              <tr>
                <th scope="col" className="text-center py-3 px-6">#</th>
                <th scope="col" className="text-start py-3 px-4">Name</th>
                <th scope="col" className="text-start py-3 px-4">Phone No.</th>
                <th scope="col" className="text-start py-3 px-4">Pricing Category</th>
                <th scope="col" className="text-start py-3 px-4">Customer Type</th>
                <th scope="col" className="text-start py-3 px-4">Route</th>
                <th scope="col" className="text-start py-3 px-4">Salesperson</th>
                <th scope="col" className="text-start py-3 px-4">Date Created</th>
                <th scope="col" className="text-start py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((customer, index) => (
                  <tr key={index} style={{ transition: "background-color 0.2s" }}>
                    <td className="text-center small-text py-3 px-6">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="text-start small-text py-3 px-4">{customer.name}</td>
                    <td className="text-start small-text py-3 px-4">{customer.phoneNo}</td>
                    <td className="text-start small-text py-3 px-4">{customer.pricingCategory}</td>
                    <td className="text-start small-text py-3 px-4">{customer.customerType}</td>
                    <td className="text-start small-text py-3 px-4">{customer.route}</td>
                    <td className="text-start small-text py-3 px-4">{customer.salesperson}</td>
                    <td className="text-start small-text py-3 px-4">{formatDate(customer.dateCreated)}</td>
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
                                onClick={() => handleViewClick(customer)}
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
                                onClick={() => handleEditClick(customer)}
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(customer)}
                                data-bs-toggle="modal"
                                data-bs-target="#deleteModal"
                              >
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
                  <td colSpan="9" className="text-center py-3">
                    No customers found
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
              {Math.min(currentPage * itemsPerPage, customers.length)} of {customers.length} entries
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

      {/* Add Customer Modal */}
      <div className="modal fade" id="exampleModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                Add Customer
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </h6>
              <form onSubmit={handleAddCustomer}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Enter Customer Name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      Phone No <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="phoneNo"
                      placeholder="Enter Phone Number"
                      value={newCustomer.phoneNo}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phoneNo: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">
                      Pricing Category <span className="text-danger">*</span>
                    </label>
                    <div className="position-relative">
                      <div
                        className="form-control d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowPricingCategoryDropdown(!showPricingCategoryDropdown)}
                      >
                        <span>{newCustomer.pricingCategory || "Select Pricing Category"}</span>
                        <i className="dropdown-toggle ms-2"></i>
                      </div>
                      {showPricingCategoryDropdown && (
                        <ul className="dropdown-menu w-100 show" style={{ position: "absolute", top: "100%", left: 0, zIndex: 1000 }}>
                          {["Standard", "Premium", "Discount"].map((category, index) => (
                            <li key={index}>
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => {
                                  setNewCustomer({ ...newCustomer, pricingCategory: category });
                                  setShowPricingCategoryDropdown(false);
                                }}
                              >
                                {category}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      Customer Type <span className="text-danger">*</span>
                    </label>
                    <div className="position-relative">
                      <div
                        className="form-control d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowCustomerTypeDropdown(!showCustomerTypeDropdown)}
                      >
                        <span>{newCustomer.customerType || "Select Customer Type"}</span>
                        <i className="dropdown-toggle ms-2"></i>
                      </div>
                      {showCustomerTypeDropdown && (
                        <ul className="dropdown-menu w-100 show" style={{ position: "absolute", top: "100%", left: 0, zIndex: 1000 }}>
                          {["Retail", "Wholesale"].map((type, index) => (
                            <li key={index}>
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => {
                                  setNewCustomer({ ...newCustomer, customerType: type });
                                  setShowCustomerTypeDropdown(false);
                                }}
                              >
                                {type}
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
                      value={newCustomer.route}
                      onChange={(e) => setNewCustomer({ ...newCustomer, route: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      Salesperson <span className="text-danger">*</span>
                    </label>
                    <div className="position-relative">
                      <div
                        className="form-control d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowSalespersonDropdown(!showSalespersonDropdown)}
                      >
                        <span>{newCustomer.salesperson || "Select Salesperson"}</span>
                        <i className="dropdown-toggle ms-2"></i>
                      </div>
                      {showSalespersonDropdown && (
                        <ul className="dropdown-menu w-100 show" style={{ position: "absolute", top: "100%", left: 0, zIndex: 1000 }}>
                          {salespeople.map((salesperson, index) => (
                            <li key={index}>
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => {
                                  setNewCustomer({ ...newCustomer, salesperson });
                                  setShowSalespersonDropdown(false);
                                }}
                              >
                                {salesperson}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
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

      {/* Edit Customer Modal */}
      <div className="modal fade" id="editModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                Edit Customer
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
                      placeholder="Enter Customer Name"
                      value={editCustomer.name}
                      onChange={(e) => setEditCustomer({ ...editCustomer, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      Phone No <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Phone Number"
                      value={editCustomer.phoneNo}
                      onChange={(e) => setEditCustomer({ ...editCustomer, phoneNo: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">
                      Pricing Category <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Pricing Category"
                      value={editCustomer.pricingCategory}
                      onChange={(e) => setEditCustomer({ ...editCustomer, pricingCategory: e.target.value })}
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
                      value={editCustomer.customerType}
                      onChange={(e) => setEditCustomer({ ...editCustomer, customerType: e.target.value })}
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
                      value={editCustomer.route}
                      onChange={(e) => setEditCustomer({ ...editCustomer, route: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      Salesperson <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Salesperson"
                      value={editCustomer.salesperson}
                      onChange={(e) => setEditCustomer({ ...editCustomer, salesperson: e.target.value })}
                      required
                    />
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

      {/* View Customer Modal */}
      <div className="modal fade" id="viewModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                View Customer
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </h6>
              {customerToView && (
                <div className="mt-3">
                  <p><strong>Name:</strong> {customerToView.name}</p>
                  <p><strong>Phone No:</strong> {customerToView.phoneNo}</p>
                  <p><strong>Pricing Category:</strong> {customerToView.pricingCategory}</p>
                  <p><strong>Customer Type:</strong> {customerToView.customerType}</p>
                  <p><strong>Route:</strong> {customerToView.route}</p>
                  <p><strong>Salesperson:</strong> {customerToView.salesperson}</p>
                  <p><strong>Date Created:</strong> {formatDate(customerToView.dateCreated)}</p>
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
                <h6 className="modal-title fs-6">Delete Customer</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <p className="pb-3 mb-0">
                Are you sure you want to delete the <strong>{customerToDelete?.name}</strong> customer permanently? This action cannot be undone.
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
  );
};

export default CustomersLayer;