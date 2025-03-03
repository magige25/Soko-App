import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const CategoryLayer = () => {
  const [categories, setCategories] = useState([
    { name: "Electronics", numberOfSubCategories: "24", numberOfProducts: "200", date: "17 Feb 2025" },
    { name: "Home Goods", numberOfSubCategories: "12", numberOfProducts: "200", date: "17 Feb 2025" },
    { name: "Beauty Products", numberOfSubCategories: "18", numberOfProducts: "200", date: "17 Feb 2025" },
    { name: "Sports Wear", numberOfSubCategories: "35", numberOfProducts: "200", date: "17 Feb 2025" },
  ]);

  const [editCategory, setEditCategory] = useState({ name: '', numberOfSubCategories: '', numberOfProducts: '' });
  const [newCategory, setNewCategory] = useState({ name: '', numberOfSubCategories: '', numberOfProducts: '' });
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Function to format the date as "24 Jan 2025"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Convert "dd MMM yyyy" to "yyyy-MM-dd" for the date input
  const convertToDateInputFormat = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Convert "yyyy-MM-dd" back to "dd MMM yyyy"
  const convertToDisplayFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.name.trim() || !newCategory.numberOfProducts.trim()) {
      alert("Please fill in all required fields before saving.");
      return;
    }
    const newCategoryData = {
      name: newCategory.name,
      numberOfSubCategories: "0",
      numberOfProducts: newCategory.numberOfProducts,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    setCategories([...categories, newCategoryData]);
    setNewCategory({ name: '', numberOfProducts: '' });
  };

  const handleEditClick = (category) => {
    setEditCategory({
      ...category,
      date: convertToDateInputFormat(category.date),
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedCategory = {
      ...editCategory,
      date: convertToDisplayFormat(editCategory.date),
    };
    const updatedCategories = categories.map((category) =>
      category.name === editCategory.name ? updatedCategory : category
    );
    setCategories(updatedCategories);
    setEditCategory({ name: '', numberOfSubCategories: '', numberOfProducts: '' });
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
  };

  const handleDeleteConfirm = () => {
    const updatedCategories = categories.filter((category) => category.name !== categoryToDelete.name);
    setCategories(updatedCategories);
    setCategoryToDelete(null);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="page-wrapper">
      <div className="row">
        {/* Add Category Button */}
        <div className="d-flex align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="ms-auto">
            <button
              type="button"
              className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
              data-bs-toggle="modal"
              data-bs-target="#addCategoryModal"
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add Category
            </button>
          </div>
        </div>

        {/* Categories table */}
        <div className="card shadow-sm mt-3" style={{ width: '100%' }}>
          <div className="card-body">
            <div>
              <form className="navbar-search" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', width: "32px" }}>
                <input type='text' name='search' placeholder='Search' />
                <Icon icon='ion:search-outline' className='icon' style={{ width: '16px', height: '16px' }} />
              </form>
            </div>
            <div className="table-responsive" style={{ overflow: 'visible' }}>
              <table className="table table-borderless text-start small-text" style={{ width: '100%' }}>
                <thead className="table-light text-start small-text" style={{ backgroundColor: '#f8f9fa' }}>
                  <tr>
                    <th className="text-start">#</th>
                    <th className="text-start" style={{ width: '200px' }}>Name</th>
                    <th className="text-start" style={{ width: '200px' }}>No. of Sub Categories</th>
                    <th className="text-start" style={{ width: '200px' }}>No. of Products</th>
                    <th className="text-start" style={{ width: '200px' }}>Date Created</th>
                    <th className="text-start">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((category, index) => (
                    <tr key={index}>
                      <th scope="row" className="text-start small-text">{index + 1}</th>
                      <td className="text-start small-text" style={{ width: '200px' }}>{category.name}</td>
                      <td className="text-start small-text" style={{ width: '200px' }}>{category.numberOfSubCategories}</td>
                      <td className="text-start small-text" style={{ width: '200px' }}>{category.numberOfProducts}</td>
                      <td className="text-start small-text" style={{ width: '200px' }}>{formatDate(category.date)}</td>
                      <td className="text-start small-text">
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
                                to={`/category/${category.name}`}
                                state={{ category }}
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
                                onClick={() => handleEditClick(category)}
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(category)}
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
                <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, categories.length)} of {categories.length} entries</span>
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

        {/* Add Category Modal */}
        <div className="modal fade" id="addCategoryModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Add Category
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                <form onSubmit={handleAddCategory}>
                  <div className="mb-3">
                    <label className="form-label">
                      Category <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Category Name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Number of Products <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter Number of Products"
                      value={newCategory.numberOfProducts}
                      onChange={(e) => setNewCategory({ ...newCategory, numberOfProducts: e.target.value })}
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

        {/* Edit Category Modal */}
        <div className="modal fade" id="editModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Edit Category
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label className="form-label">
                      Category Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Category Name"
                      value={editCategory.name}
                      onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Number of Sub Categories <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Number of Sub Categories"
                      value={editCategory.numberOfSubCategories}
                      onChange={(e) => setEditCategory({ ...editCategory, numberOfSubCategories: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Number of Products <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter Number of Products"
                      value={editCategory.numberOfProducts}
                      onChange={(e) => setEditCategory({ ...editCategory, numberOfProducts: e.target.value })}
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
                  <h6 className="modal-title fs-6">Delete Category</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <p className="pb-3 mb-0">
                  Are you sure you want to delete the <strong>{categoryToDelete?.name}</strong> category permanently? This action cannot be undone.
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

export default CategoryLayer;