import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "https://api.bizchain.co.ke/v1/pricing-categories";
const STATUS_API_URL = "https://api.bizchain.co.ke/v1/pricing-categories/update-status";

const PricingCategoriesLayer = () => {
  const [pricingCategories, setPricingCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [editPricingCategory, setEditPricingCategory] = useState(null);
  const [newPricingCategory, setNewPricingCategory] = useState({ name: "" });
  const [pricingCategoryToDelete, setPricingCategoryToDelete] = useState(null);
  const [pricingCategoryToView, setPricingCategoryToView] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPricingCategories = useCallback(async (page = 1, searchQuery = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: page - 1,
          size: itemsPerPage,
          searchValue: searchQuery,
          _t: new Date().getTime(),
        },
      });

      console.log("Fetch API Response:", response.data);
      const responseData = response.data;
      if (responseData.status.code === 0) {
        const data = responseData.data || [];
        console.log("Fetched Categories Data:", data);
        setPricingCategories(data);
        setTotalItems(responseData.totalElements || 0);
      } else {
        throw new Error(responseData.status.message);
      }
    } catch (error) {
      console.error("Error fetching pricingCategories:", error);
      setError(error.message || "Failed to fetch categories. Please try again.");
      setPricingCategories([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchPricingCategories(currentPage, query);
  }, [currentPage, query, fetchPricingCategories]);

  const handleEditClick = (pricingCategory) => {
    setEditPricingCategory({
      id: pricingCategory.id,
      name: pricingCategory.name,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editPricingCategory.name) {
      setError("Please fill in the name field before saving.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("token");
      const payload = {
        name: editPricingCategory.name,
      };
      await axios.put(`${API_URL}/${editPricingCategory.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditPricingCategory(null);
      fetchPricingCategories(currentPage, query);
      document.getElementById("editModal").classList.remove("show");
      document.body.classList.remove("modal-open");
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) backdrop.remove();
    } catch (error) {
      console.error("Error updating pricing category:", error);
      setError(error.response?.data?.status?.message || "Failed to update category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (pricingCategory) => {
    setPricingCategoryToDelete(pricingCategory);
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`${API_URL}/${pricingCategoryToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPricingCategoryToDelete(null);
      fetchPricingCategories(currentPage, query);
    } catch (error) {
      console.error("Error deleting pricing category:", error);
      setError("Failed to delete category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (pricingCategory) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("token");
      const newStatusCode = pricingCategory.status.name === "Active" ? "INACTV" : "ACTV";

      console.log(`Toggling status for category ${pricingCategory.id} to ${newStatusCode}`);

      const response = await axios.put(
        STATUS_API_URL,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            id: pricingCategory.id,
            status: newStatusCode,
          },
        }
      );

      console.log("Status update response:", response.data);
      await fetchPricingCategories(currentPage, query);
    } catch (error) {
      console.error("Error toggling status:", error);
      console.error("Error response:", error.response?.data);
      setError(error.response?.data?.status?.message || error.response?.data?.message || "Failed to toggle status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPricingCategory = async (e) => {
    e.preventDefault();
    if (!newPricingCategory.name) {
      setError("Please fill in the name field before saving.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("token");
      const payload = {
        name: newPricingCategory.name,
      };
      await axios.post(API_URL, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewPricingCategory({ name: "" });
      fetchPricingCategories(currentPage, query);
      document.getElementById("exampleModal").classList.remove("show");
      document.body.classList.remove("modal-open");
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) backdrop.remove();
    } catch (error) {
      console.error("Error adding pricing category:", error);
      setError("Failed to add category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewClick = (pricingCategory) => {
    setPricingCategoryToView(pricingCategory);
  };

  const handleSearchInputChange = (e) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
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
              placeholder="Search Name"
              value={query}
              onChange={handleSearchInputChange}
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
          Add Pricing Category
        </button>
      </div>

      <div className="card-body p-24">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="table-responsive scroll-sm">
          <table className="table table-borderless sm-table mb-0">
            <thead>
              <tr>
                <th scope="col" className="text-center py-3 px-6">#</th>
                <th scope="col" className="text-start py-3 px-4">Name</th>
                <th scope="col" className="text-start py-3 px-4">Status</th>
                <th scope="col" className="text-start py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center py-3">
                    <div>
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : pricingCategories.length > 0 ? (
                pricingCategories.map((pricingCategory, index) => (
                  <tr key={pricingCategory.id} style={{ transition: "background-color 0.2s" }}>
                    <td className="text-center small-text py-3 px-6">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="text-start small-text py-3 px-4">{pricingCategory.name}</td>
                    <td className="text-start small-text py-3 px-4">
                      <span
                        className={`bg-${
                          pricingCategory.status.name === "Inactive" ? "danger-focus" : "success-focus"
                        } text-${
                          pricingCategory.status.name === "Inactive" ? "danger-600" : "success-600"
                        } px-24 py-4 radius-8 fw-medium text-sm`}
                      >
                        {pricingCategory.status.name}
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
                                onClick={() => handleViewClick(pricingCategory)}
                              >
                                Details
                              </button>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item"
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#editModal"
                                onClick={() => handleEditClick(pricingCategory)}
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleToggleStatus(pricingCategory)}
                              >
                                {pricingCategory.status.name === "Active" ? "Deactivate" : "Activate"}
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(pricingCategory)}
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
                  <td colSpan="4" className="text-center py-3">No pricing categories found</td>
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

      {/* Add Pricing Category Modal */}
      <div className="modal fade" id="exampleModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                Add Pricing Category
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </h6>
              <form onSubmit={handleAddPricingCategory}>
                <div className="mb-3">
                  <label className="form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="Enter Pricing Category Name"
                    value={newPricingCategory.name}
                    onChange={(e) => setNewPricingCategory({ ...newPricingCategory, name: e.target.value })}
                    required
                  />
                </div>
                <div className="text-muted small mt-3">
                  Fields marked with <span className="text-danger">*</span> are required.
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Pricing Category Modal */}
      <div className="modal fade" id="editModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                Edit Pricing Category
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </h6>
              {editPricingCategory && (
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Pricing Category Name"
                      value={editPricingCategory.name}
                      onChange={(e) =>
                        setEditPricingCategory({ ...editPricingCategory, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="text-muted small mt-3">
                    Fields marked with <span className="text-danger">*</span> are required.
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Category Details Modal */}
      <div className="modal fade" id="viewModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-5">
                Details
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </h6>
              {pricingCategoryToView && (
                <div className="mt-3">
                  <p>
                    <strong>Name:</strong> {pricingCategoryToView.name}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`bg-${
                        pricingCategoryToView.status.name === "Inactive" ? "danger-focus" : "success-focus"
                      } text-${
                        pricingCategoryToView.status.name === "Inactive" ? "danger-600" : "success-600"
                      } px-24 py-4 radius-8 fw-medium text-sm`}
                    >
                      {pricingCategoryToView.status.name}
                    </span>
                  </p>
                  <p>
                    <strong>Description:</strong> {pricingCategoryToView.description || "-"}
                  </p>
                  <p>
                    <strong>Date Created:</strong>{" "}
                    {new Date(pricingCategoryToView.dateCreated).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Created By:</strong> {pricingCategoryToView.createdBy.name}
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

      {/* Delete Confirmation Modal */}
      <div className="modal fade" id="deleteModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body pt-3 ps-18 pe-18">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="modal-title fs-6">Delete Pricing Category</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <p className="pb-3 mb-0">
                Are you sure you want to delete the <strong>{pricingCategoryToDelete?.name}</strong> pricing
                category permanently? This action cannot be undone.
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
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCategoriesLayer;