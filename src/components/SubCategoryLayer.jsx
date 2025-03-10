import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const SubCategoryLayer = () => {
  const [subCategories, setSubCategories] = useState([
    { name: "Laptops", category: "Electronics", numberOfProducts: "200", date: "27 Feb 2025" },
    { name: "Furniture", category: "Home Goods", numberOfProducts: "200", date: "27 Feb 2025" },
    { name: "Skin Care", category: "Beauty Products", numberOfProducts: "200", date: "27 Feb 2025" },
    { name: "Swimming Gear", category: "Sports Wear", numberOfProducts: "200", date: "27 Feb 2025" },
  ]);

  const [editSubCategory, setEditSubCategory] = useState({ name: '', category: '', numberOfProducts: '' });
  const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);
  const [newSubCategory, setNewSubCategory] = useState({ name: '', category: '', numberOfProducts: '' });
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleEditClick = (subCategory) => {
    setEditSubCategory(subCategory);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedSubCategories = subCategories.map((subCategory) =>
      subCategory.name === editSubCategory.name ? { ...subCategory, ...editSubCategory } : subCategory
    );
    setSubCategories(updatedSubCategories);
    setEditSubCategory({ name: '', category: '', numberOfProducts: '' });
  };

  const handleDeleteClick = (subCategory) => {
    setSubCategoryToDelete(subCategory);
  };

  const handleDeleteConfirm = () => {
    const updatedSubCategories = subCategories.filter((subCategory) => subCategory.name !== subCategoryToDelete.name);
    setSubCategories(updatedSubCategories);
    setSubCategoryToDelete(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleAddSubCategory = (e) => {
    e.preventDefault();
    if (!newSubCategory.name.trim()) {
      alert("Please fill in all fields before saving.");
      return;
    }
    const newSubCategoryData = {
      name: newSubCategory.name,
      category: newSubCategory.category,
      numberOfProducts: newSubCategory.numberOfProducts || "0", // Default to 0 if not provided
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    setSubCategories([...subCategories, newSubCategoryData]);
    setNewSubCategory({ name: '', category: '', numberOfProducts: '' });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = subCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(subCategories.length / itemsPerPage);
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
          className="btn btn-primary text-sm btn-md px-12 py-12 radius-8 d-flex align-items-center gap-2"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
          Create Sub Category
        </button>
      </div>

      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          <table className="table table-borderless sm-table mb-0">
            <thead>
              <tr>
                <th scope="col" className="text-center py-3 px-6">#</th>
                <th scope="col" className="text-start py-3 px-4">Name</th>
                <th scope="col" className="text-start py-3 px-4">Category</th>
                <th scope="col" className="text-start py-3 px-4">No. of Products</th>
                <th scope="col" className="text-start py-3 px-4">Date Created</th>
                <th scope="col" className="text-start py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((subCategory, index) => (
                  <tr key={index} style={{ transition: "background-color 0.2s" }}>
                    <td className="text-center small-text py-3 px-6">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="text-start small-text py-3 px-4">{subCategory.name}</td>
                    <td className="text-start small-text py-3 px-4">{subCategory.category}</td>
                    <td className="text-start small-text py-3 px-4">{subCategory.numberOfProducts}</td>
                    <td className="text-start small-text py-3 px-4">{formatDate(subCategory.date)}</td>
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
                              <Link
                                className="dropdown-item"
                                to={`/sub-category/${subCategory.name}`}
                                state={{ subCategory }}
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
                                onClick={() => handleEditClick(subCategory)}
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(subCategory)}
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
                  <td colSpan="6" className="text-center py-3">
                    No sub-categories found
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
              {Math.min(currentPage * itemsPerPage, subCategories.length)} of {subCategories.length} entries
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

      {/* Add Sub Category Modal */}
      <div className="modal fade" id="exampleModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                Create Sub Category
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </h6>
              <form onSubmit={handleAddSubCategory}>
                <div className="mb-3">
                  <label className="form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control w-100"
                    name="name"
                    placeholder="Enter Sub Category Name"
                    value={newSubCategory.name}
                    onChange={(e) => setNewSubCategory({ ...newSubCategory, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Category <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <div
                      className="form-control d-flex justify-content-between align-items-center"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <span>{newSubCategory.category || "Select Category"}</span>
                      <i className="dropdown-toggle ms-2"></i>
                    </div>
                    {showDropdown && (
                      <ul className="dropdown-menu w-100 show" style={{ position: "absolute", top: "100%", left: 0, zIndex: 1000 }}>
                        {["Electronics", "Home Goods", "Beauty Products", "Sports Wear"].map((category, index) => (
                          <li key={index}>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => {
                                setNewSubCategory({ ...newSubCategory, category });
                                setShowDropdown(false);
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
                <div className="mb-3">
                  <label className="form-label">
                    Number of Products <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Number of Products"
                    value={newSubCategory.numberOfProducts}
                    onChange={(e) => setNewSubCategory({ ...newSubCategory, numberOfProducts: e.target.value })}
                  />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Sub Category Modal */}
      <div className="modal fade" id="editModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                Edit Sub Category
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </h6>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    Sub Category <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Sub Category Name"
                    value={editSubCategory.name}
                    onChange={(e) => setEditSubCategory({ ...editSubCategory, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Category <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Category Name"
                    value={editSubCategory.category}
                    onChange={(e) => setEditSubCategory({ ...editSubCategory, category: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Number of Products <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control w-100"
                    placeholder="Enter Number of Products"
                    value={editSubCategory.numberOfProducts}
                    onChange={(e) => setEditSubCategory({ ...editSubCategory, numberOfProducts: e.target.value })}
                    required
                  />
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
                <h6 className="modal-title fs-6">Delete Sub Category</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <p className="pb-3 mb-0">
                Are you sure you want to delete the <strong>{subCategoryToDelete?.name}</strong> sub category permanently? This action cannot be undone.
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

export default SubCategoryLayer;