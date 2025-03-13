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
  const [editSubCategory, setEditSubCategory] = useState({ id: null, name: "", categoryId: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return "N/A";
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
    if (!token) {
      setError("Authentication token not found");
      return;
    }
    try {
      const response = await axios.get(CATEGORY_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 0, size: 100 },
      });
      
      if (response.data.status.code === 0) {
        setCategories(response.data.data);
      } else {
        setError(`Failed to fetch categories: ${response.data.status.message}`);
      }
    } catch (error) {
      setError(`Error fetching categories: ${error.message}`);
    }
  }, []);

  const fetchSubCategories = useCallback(async (page = 1, searchQuery = "") => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.get(SUBCATEGORY_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: page - 1,
          limit: itemsPerPage,
          searchValue: searchQuery,
        },
      });

      if (response.data.status.code === 0) {
        const mappedSubCategories = response.data.data.map((subCategory) => ({
          id: subCategory.id,
          name: subCategory.name,
          categoryId: subCategory.category.id,
          categoryName: subCategory.category.name,
          dateCreated: subCategory.dateCreated,
        }));
        // Store all fetched data but we'll paginate on client-side
        setSubCategories(mappedSubCategories);
        setTotalItems(response.data.totalElements || response.data.data.length);
      } else {
        setError(`Failed to fetch subcategories: ${response.data.status.message}`);
        setSubCategories([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching sub-categories:", error);
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

  const handleEditClick = (subCategory) => {
    setEditSubCategory({
      id: subCategory.id,
      name: subCategory.name,
      categoryId: subCategory.categoryId.toString()
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editSubCategory.name.trim() || !editSubCategory.categoryId) {
      setError("Please provide both name and category");
      return;
    }
    
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${SUBCATEGORY_API_URL}/${editSubCategory.id}`,
        {
          subCategoryRequests: [{
            name: editSubCategory.name,
            categoryId: parseInt(editSubCategory.categoryId),
          }],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status.code === 0) {
        setIsEditModalOpen(false);
        fetchSubCategories(currentPage, debouncedQuery);
        toast.success("Subcategory updated successfully!");
      } else {
        setError(`Update failed: ${response.data.status.message}`);
      }
    } catch (error) {
      setError(`Error updating subcategory: ${error.message}`);
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
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `${SUBCATEGORY_API_URL}/${subCategoryToDelete.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status.code === 0) {
        setIsDeleteModalOpen(false);
        fetchSubCategories(currentPage, debouncedQuery);
        toast.success("Subcategory deleted successfully!");
      } else {
        setError(`Delete failed: ${response.data.status.message}`);
      }
    } catch (error) {
      setError(`Error deleting subcategory: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  // Client-side pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSubCategories = subCategories.slice(startIndex, endIndex);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <ToastContainer />
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <form className="navbar-search">
          <input
            type="text"
            className="bg-base h-40-px w-auto"
            placeholder="Search Subcategories"
            value={query}
            onChange={handleSearchInputChange}
          />
          <Icon icon="ion:search-outline" className="icon" />
        </form>
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
                <th className="text-center py-3 px-6">#</th>
                <th className="text-start py-3 px-4">Name</th>
                <th className="text-start py-3 px-4">Category</th>
                <th className="text-start py-3 px-4">Date Created</th>
                <th className="text-start py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-3">Loading...</td>
                </tr>
              ) : paginatedSubCategories.length > 0 ? (
                paginatedSubCategories.map((subCategory, index) => (
                  <tr key={subCategory.id}>
                    <td className="text-center py-3 px-6">
                      {startIndex + index + 1}
                    </td>
                    <td className="text-start py-3 px-4">{subCategory.name}</td>
                    <td className="text-start py-3 px-4">{subCategory.categoryName}</td>
                    <td className="text-start py-3 px-4">{formatDate(subCategory.dateCreated)}</td>
                    <td className="text-start py-3 px-4">
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-3">No subcategories found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && totalItems > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="text-muted" style={{ fontSize: "13px" }}>
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, totalItems)} of {totalItems} entries
            </div>
            <nav>
              <ul className="pagination mb-0" style={{ gap: "6px" }}>
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link btn btn-outline-primary rounded-circle"
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
                      } rounded-circle`}
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
                    className="page-link btn btn-outline-primary rounded-circle"
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

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Edit Subcategory
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setIsEditModalOpen(false)}
                  ></button>
                </h6>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label className="form-label">
                      Subcategory Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editSubCategory.name}
                      onChange={(e) =>
                        setEditSubCategory({ ...editSubCategory, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Category <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      value={editSubCategory.categoryId}
                      onChange={(e) =>
                        setEditSubCategory({ ...editSubCategory, categoryId: e.target.value })
                      }
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
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setIsEditModalOpen(false)}
                    >
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

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body pt-3 ps-18 pe-18">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="modal-title fs-6">Delete Subcategory</h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setIsDeleteModalOpen(false)}
                  ></button>
                </div>
                <p>
                  Are you sure you want to delete <strong>{subCategoryToDelete?.name}</strong>?
                </p>
              </div>
              <div className="d-flex justify-content-end gap-2 px-12 pb-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteConfirm}
                  disabled={isLoading}
                >
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