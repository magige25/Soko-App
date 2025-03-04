import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_URL = "https://api.bizchain.co.ke/v1/customer-types";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

const CustomerTypeLayer = () => {
  const [customerTypes, setCustomerTypes] = useState([]);
  const [query, setQuery] = useState("");
  const [editCustomerType, setEditCustomerType] = useState({ id: "", name: "" });
  const [newCustomerType, setNewCustomerType] = useState({ name: "" });
  const [customerTypeToDelete, setCustomerTypeToDelete] = useState(null);
  const [customerTypeToView, setCustomerTypeToView] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const debouncedQuery = useDebounce(query, 300);

  const fetchCustomerTypes = useCallback(
    async (page = 1, searchQuery = "") => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found.");
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: page - 1,
            size: itemsPerPage,
            searchValue: searchQuery,
          },
        });
        const data = response.data.data || [];
        const total = response.data.totalElements || data.length;
        setCustomerTypes(data);
        setTotalItems(total);
      } catch (error) {
        console.error("Error fetching Customer Types:", error);
        setError("Failed to fetch customer types. Please try again.");
        toast.error("Failed to fetch customer types.");
        setCustomerTypes([]);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage]
  );

  useEffect(() => {
    fetchCustomerTypes(currentPage, debouncedQuery);
  }, [currentPage, debouncedQuery, fetchCustomerTypes]);

  const handleEditClick = (customerType) => {
    setEditCustomerType({ id: customerType.id, name: customerType.name });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editCustomerType.name) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        name: editCustomerType.name,        
      };
      await axios.put(`${API_URL}/${editCustomerType.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success("Customer Type updated successfully!");
      setEditCustomerType({ id: "null", name: ""});
      fetchCustomerTypes(currentPage, debouncedQuery);
    } catch (error) {
      console.error("Error updating Customer Type:", error);
      setError(error.response?.data?.message || "Failed to update customer type.");
      toast.error(error.response?.data?.message || "Failed to update customer type.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (customerType) => {
    setCustomerTypeToDelete(customerType);
  };

  const handleDeleteConfirm = async () => {
    if (!customerTypeToDelete) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${customerTypeToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Customer Type deleted successfully!");
      setCustomerTypeToDelete(null);
      fetchCustomerTypes(currentPage, debouncedQuery);
    } catch (error) {
      console.error("Error deleting Customer Type:", error);
      setError(error.response?.data?.message || "Failed to delete customer type.");
      toast.error(error.response?.data?.message || "Failed to delete customer type.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCustomerType = async (e) => {
    e.preventDefault();
    if (!newCustomerType.name) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        name: newCustomerType.name,        
      };
      const response = await axios.post(API_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        toast.success("Customer Type added successfully!");
        setNewCustomerType({ name: ""});        
        fetchCustomerTypes(currentPage, debouncedQuery);
      }
    } catch (error) {
      console.error("Error adding Customer Type:", error);
      setError(error.response?.data?.message || "Failed to add customer type.");
      toast.error(error.response?.data?.message || "Failed to add customer type.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewClick = (customerType) => {
    setCustomerTypeToView(customerType);
  };

  const handleSearchInputChange = (e) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="page-wrapper">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="row">
        <div className="d-flex align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="ms-auto">
            <button
              type="button"
              className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add Customer Type
            </button>
          </div>
        </div>

        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <div>
              <form
                className="navbar-search mb-3"
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <input
                  type="text"
                  name="search"
                  placeholder="Search by name"
                  value={query}
                  onChange={handleSearchInputChange}
                  className="form-control"
                  style={{ maxWidth: "300px" }}
                />
                <Icon icon="ion:search-outline" className="icon" style={{ width: "16px", height: "16px" }} />
              </form>
            </div>
            <div className="table-responsive" style={{ overflow: "visible" }}>
              <table className="table table-borderless table-hover text-start small-text" style={{ width: "100%" }}>
                <thead className="table-light text-start small-text" style={{ fontSize: "15px" }}>
                  <tr>
                    <th className="text-center py-3 px-6" style={{ width: "50px" }}>#</th>
                    <th className="text-start py-3 px-4">Name</th>
                    <th className="text-start py-3 px-4">Status</th>
                    <th className="text-start py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: "14px" }}>
                  {isLoading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-3">
                        <div>
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : customerTypes.length > 0 ? (
                    customerTypes.map((customerType, index) => (
                      <tr key={customerType.id}>
                        <td className="text-center small-text py-3 px-6">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="text-start small-text py-3 px-4">{customerType.name}</td>
                        <td className="text-start small-text py-3 px-4">
                          <span
                            className={`bg-${
                              customerType.status.name === "Active" ? "success-focus" : "neutral-200"
                            } text-${
                              customerType.status.name === "Inactive" ? "danger-600" : "neutral-600"
                            } px-24 py-4 radius-8 fw-medium text-sm`}
                          >
                            {customerType.status.name || "N/A"}
                          </span>
                        </td>
                        <td className="text-start small-text py-3 px-4">
                          <div className="dropdown">
                            <button
                              className="btn btn-outline-secondary btn-sm dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                              style={{ padding: "4px 8px" }}
                            >
                              Actions
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <button
                                  className="dropdown-item"
                                  data-bs-toggle="modal"
                                  data-bs-target="#viewModal"
                                  onClick={() => handleViewClick(customerType)}
                                >
                                  View
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  data-bs-toggle="modal"
                                  data-bs-target="#editModal"
                                  onClick={() => handleEditClick(customerType)}
                                >
                                  Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => handleDeleteClick(customerType)}
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-3">
                        No customer types found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {!isLoading && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-muted" style={{ fontSize: "13px" }}>
                  <span>
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
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
            )}
          </div>
        </div>

        <div className="modal fade" id="exampleModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Add Customer Type
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                <form onSubmit={handleAddCustomerType}>
                  <div className="mb-3">
                    <label className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Enter Customer Type Name"
                      value={newCustomerType.name}
                      onChange={(e) => setNewCustomerType({ ...newCustomerType, name: e.target.value })}
                      required
                    />
                  </div>                  
                  <div className="text-muted small mt-3">
                    Fields marked with <span className="text-danger">*</span> are required.
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

        <div className="modal fade" id="editModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Edit Customer Type
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
                      placeholder="Enter Customer Type Name"
                      value={editCustomerType.name}
                      onChange={(e) => setEditCustomerType({ ...editCustomerType, name: e.target.value })}
                      required
                    />
                  </div>                  
                  <div className="text-muted small mt-3">
                    Fields marked with <span className="text-danger">*</span> are required.
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

        <div className="modal fade" id="viewModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  View Customer Type
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                {customerTypeToView && (
                  <div className="mt-3">
                    <p>
                      <strong>Name:</strong> {customerTypeToView.name}
                    </p>
                    <p>
                      <strong>Status:</strong> {customerTypeToView.status.name || "N/A"}
                    </p>
                  </div>
                )}
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="deleteModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body pt-3 ps-18 pe-18">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="modal-title fs-6">Delete Customer Type</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <p className="pb-3 mb-0">
                  Are you sure you want to delete the <strong>{customerTypeToDelete?.name}</strong>{" "}
                  customer type permanently? This action cannot be undone.
                </p>
              </div>
              <div className="d-flex justify-content-end gap-2 px-12 pb-3">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  data-bs-dismiss="modal"
                  onClick={handleDeleteConfirm}
                >
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

export default CustomerTypeLayer;