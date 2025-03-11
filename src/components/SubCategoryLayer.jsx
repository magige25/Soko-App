import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SUBCATEGORY_API_URL = "https://api.bizchain.co.ke/v1/sub-categories";
const CATEGORY_API_URL = "https://api.bizchain.co.ke/v1/categories";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

const SubCategoryLayer = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);
  const [newSubCategory, setNewSubCategory] = useState({ name: "", categoryId: "" });
  const [editSubCategory, setEditSubCategory] = useState({ id: null, name: "", categoryId: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getFullYear();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";
    return `${day}${suffix} ${month} ${year}`;
  };

  const fetchCategories = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const params = { page: 0, size: 100 }; // Try 0-based indexing
      console.log("Fetching categories with params:", params);
      const response = await axios.get(CATEGORY_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      console.log("Categories Response:", response.data);
      if (response.data.status.code === 0) {
        setCategories(response.data.data);
      } else {
        setError(`Failed to fetch categories: ${response.data.status.message}`);
      }
    } catch (error) {
      console.error("Error fetching categories:", error.response?.data || error.message);
      setError(`Error fetching categories: ${error.response?.data?.message || error.message}`);
    }
  }, []);

  const fetchSubCategories = useCallback(async (page = 1, searchQuery = "") => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    if (!token || token.trim() === "") {
      setError("No authentication token found. Please log in.");
      setIsLoading(false);
      return;
    }
    try {
      const params = {
        page: page, // 1-based indexing
        size: itemsPerPage,
        searchValue: searchQuery,
      };
      console.log("Fetching subcategories with params:", params);
      console.log("Request Headers:", { Authorization: `Bearer ${token}` });
      const url = new URL(SUBCATEGORY_API_URL);
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
      console.log("Full Request URL:", url.toString());
      const response = await axios.get(SUBCATEGORY_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      console.log("Full Subcategories Response:", response);
      console.log("Subcategories Data:", response.data);
      const result = response.data;
      if (result.status.code === 0) {
        if (result.data.length === 0) {
          console.log("No subcategories returned from API. Retrying with page=0...");
          const retryResponse = await axios.get(SUBCATEGORY_API_URL, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page: 0, size: itemsPerPage, searchValue: searchQuery },
          });
          console.log("Retry Response:", retryResponse.data);
          if (retryResponse.data.status.code === 0 && retryResponse.data.data.length > 0) {
            const mappedSubCategories = retryResponse.data.data.map((subCategory) => ({
              id: subCategory.id,
              name: subCategory.name,
              category: subCategory.category.name,
              categoryId: subCategory.category.id,
              date: subCategory.dateCreated,
            }));
            console.log("Mapped Subcategories (retry):", mappedSubCategories);
            setSubCategories(mappedSubCategories);
            setTotalItems(retryResponse.data.totalElements);
          } else {
            setSubCategories([]);
            setTotalItems(0);
          }
        } else {
          const mappedSubCategories = result.data.map((subCategory) => ({
            id: subCategory.id,
            name: subCategory.name,
            category: subCategory.category.name,
            categoryId: subCategory.category.id,
            date: subCategory.dateCreated,
          }));
          console.log("Mapped Subcategories:", mappedSubCategories);
          setSubCategories(mappedSubCategories);
          setTotalItems(result.totalElements);
        }
      } else {
        setError(`Failed to fetch subcategories: ${result.status.message}`);
        setSubCategories([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      setError(`Error fetching subcategories: ${error.response?.data?.message || error.message}`);
      setSubCategories([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchCategories();
    fetchSubCategories(currentPage, debouncedQuery);
  }, [currentPage, debouncedQuery, fetchSubCategories, fetchCategories]);

  const handleAddSubCategory = async (e) => {
    e.preventDefault();
    if (!newSubCategory.name.trim() || !newSubCategory.categoryId) {
      setError("Subcategory name and category are required");
      return;
    }
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      const payload = {
        subCategoryRequests: [
          {
            name: newSubCategory.name,
            categoryId: parseInt(newSubCategory.categoryId),
          },
        ],
      };
      console.log("Adding subcategory with payload:", payload);
      const response = await axios.post(SUBCATEGORY_API_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Add Response:", response.data);
      if (response.data.status.code === 0) {
        setNewSubCategory({ name: "", categoryId: "" });
        fetchSubCategories(currentPage, debouncedQuery);
        toast.success("Subcategory added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setIsAddModalOpen(false);
      } else {
        setError(`Failed to add subcategory: ${response.data.status.message}`);
      }
    } catch (error) {
      console.error("Error adding subcategory:", error.response?.data || error.message);
      setError(`Error adding subcategory: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (subCategory) => {
    setEditSubCategory({
      id: subCategory.id,
      name: subCategory.name,
      categoryId: subCategory.categoryId || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editSubCategory.name.trim() || !editSubCategory.categoryId) {
      setError("Subcategory name and category are required");
      return;
    }
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      const payload = {
        subCategoryRequests: [
          {
            name: editSubCategory.name,
            categoryId: parseInt(editSubCategory.categoryId),
          },
        ],
      };
      console.log("Editing subcategory with payload:", payload);
      const response = await axios.put(`${SUBCATEGORY_API_URL}/${editSubCategory.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Edit Response:", response.data);
      if (response.data.status.code === 0) {
        setEditSubCategory({ id: null, name: "", categoryId: "" });
        fetchSubCategories(currentPage, debouncedQuery);
        toast.success("Subcategory updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setIsEditModalOpen(false);
      } else {
        setError(`Failed to update subcategory: ${response.data.status.message}`);
      }
    } catch (error) {
      console.error("Error updating subcategory:", error.response?.data || error.message);
      setError(`Error updating subcategory: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (subCategory) => {
    setSubCategoryToDelete(subCategory);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      console.log("Deleting subcategory with ID:", subCategoryToDelete.id);
      const response = await axios.delete(`${SUBCATEGORY_API_URL}/${subCategoryToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Delete Response:", response.data);
      if (response.data.status.code === 0) {
        setSubCategoryToDelete(null);
        fetchSubCategories(currentPage, debouncedQuery);
        toast.success("Subcategory deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setIsDeleteModalOpen(false);
      } else {
        setError(`Failed to delete subcategory: ${response.data.status.message}`);
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error.response?.data || error.message);
      setError(`Error deleting subcategory: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
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
      <ToastContainer />
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <form className="navbar-search">
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              name="search"
              placeholder="Search Subcategories"
              value={query}
              onChange={handleSearchInputChange}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
        </div>
        <Link
          to="/sub-category/add-subcategory"
          className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
        >
          <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
          Add Sub Category
        </Link>
      </div>

      <div className="card-body p-24">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="table-responsive scroll-sm">
          <table className="table table-borderless sm-table mb-0">
            <thead>
              <tr>
                <th scope="col" className="text-center py-3 px-6">#</th>
                <th scope="col" className="text-start py-3 px-4">Name</th>
                <th scope="col" className="text-start py-3 px-4">Category</th>
                <th scope="col" className="text-start py-3 px-4">Date Created</th>
                <th scope="col" className="text-start py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-3">
                    <div>Loading...</div>
                  </td>
                </tr>
              ) : subCategories.length > 0 ? (
                subCategories.map((subCategory, index) => (
                  <tr key={subCategory.id} style={{ transition: "background-color 0.2s" }}>
                    <td className="text-center small-text py-3 px-6">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="text-start small-text py-3 px-4">{subCategory.name}</td>
                    <td className="text-start small-text py-3 px-4">{subCategory.category}</td>
                    <td className="text-start small-text py-3 px-4">{formatDate(subCategory.date)}</td>
                    <td className="text-start small-text py-3 px-4">
                      <div className="action-dropdown">
                        <div className="dropdown">
                          <button
                            className="btn btn-outline-secondary btn-sm dropdown-toggle"
                            type="button"
                            onClick={(e) => e.currentTarget.nextElementSibling.classList.toggle("show")}
                          >
                            Actions
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <Link
                                className="dropdown-item"
                                to={`/sub-category/${subCategory.id}`}
                                state={{ subCategory }}
                              >
                                View
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleEditClick(subCategory)}
                              >
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(subCategory)}
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
                  <td colSpan="5" className="text-center py-3">
                    No subcategories found
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

      {/* Add Subcategory Modal */}
      {isAddModalOpen && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Create Subcategory
                  <button type="button" className="btn-close" onClick={() => setIsAddModalOpen(false)}></button>
                </h6>
                <form onSubmit={handleAddSubCategory}>
                  <div className="mb-3">
                    <label className="form-label">
                      Subcategory Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Subcategory Name"
                      value={newSubCategory.name}
                      onChange={(e) => setNewSubCategory({ ...newSubCategory, name: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Category <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      value={newSubCategory.categoryId}
                      onChange={(e) => setNewSubCategory({ ...newSubCategory, categoryId: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Subcategory Modal */}
      {isEditModalOpen && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Edit Subcategory
                  <button type="button" className="btn-close" onClick={() => setIsEditModalOpen(false)}></button>
                </h6>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label className="form-label">
                      Subcategory Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Subcategory Name"
                      value={editSubCategory.name}
                      onChange={(e) => setEditSubCategory({ ...editSubCategory, name: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Category <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      value={editSubCategory.categoryId}
                      onChange={(e) => setEditSubCategory({ ...editSubCategory, categoryId: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body pt-3 ps-18 pe-18">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="modal-title fs-6">Delete Subcategory</h6>
                  <button type="button" className="btn-close" onClick={() => setIsDeleteModalOpen(false)}></button>
                </div>
                <p className="pb-3 mb-0">
                  Are you sure you want to delete the <strong>{subCategoryToDelete?.name}</strong> subcategory permanently?
                  This action cannot be undone.
                </p>
              </div>
              <div className="d-flex justify-content-end gap-2 px-12 pb-3">
                <button type="button" className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm} disabled={isLoading}>
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubCategoryLayer;