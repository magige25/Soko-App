import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const CategoryLayer = () => {
  const [categories, setCategories] = useState([
    { name: "Electronics", numberOfSubCategories: "24", date: "17 Feb 2025" },
    { name: "Home Goods", numberOfSubCategories: "12", date: "17 Feb 2025" },
    { name: "Beauty Products", numberOfSubCategories: "18", date: "17 Feb 2025" },
    { name: "Sports Wear", numberOfSubCategories: "35", date: "17 Feb 2025" },
  ]);

  const [editCategory, setEditCategory] = useState({ name: '', numberOfSubCategories: '', date: '' });
  const [newCategory, setNewCategory] = useState({ name: '' });
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Set items per page to 10

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
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
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

  // Handle input change for date
  const handleDateChange = (e) => {
    setEditCategory({ ...editCategory, date: e.target.value });
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      alert("Please fill in all fields before saving.");
      return;
    }
    const newCategoryData = {
      name: newCategory.name,
      numberOfSubCategories: "0",
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    setCategories([...categories, newCategoryData]);
    setNewCategory({ name: '' }); // Reset form state
  };

  const handleEditClick = (category) => {
    console.log("Editing category:", category); // Debugging
    setEditCategory({
      ...category,
      date: convertToDateInputFormat(category.date), // Convert date to "yyyy-MM-dd" for the input
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting edited category:", editCategory); // Debugging

    // Convert the date back to "dd MMM yyyy" format
    const updatedCategory = {
      ...editCategory,
      date: convertToDisplayFormat(editCategory.date),
    };

    const updatedCategories = categories.map((category) =>
      category.name === editCategory.name ? updatedCategory : category
    );

    console.log("Updated categories:", updatedCategories); // Debugging
    setCategories(updatedCategories);
    setEditCategory({ name: '', numberOfSubCategories: '', date: '' }); // Reset edit form state
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
        {/* Flex container for table and modal */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          {/* Categories table */}
          <div className="card shadow-sm mt-3" style={{ width: '850px' }}>
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
                      <th className="text-start" style={{ width: '200px' }}>Date Created</th>
                      <th className="text-start">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((category, index) => (
                      <tr key={index}>
                        <th scope="row" className="text-start small-text">{index + 1}</th>
                        <td className="text-start small-text" style={{ width: '200px' }}>{category.name} </td>
                        <td className="text-start small-text" style={{ width: '200px' }}>{category.numberOfSubCategories}</td>
                        <td className="text-start small-text" style={{ width: '200px' }}>{formatDate(category.date)}</td>
                        <td className="text-start small-text">
                          <div className="dropdown">
                            <button className="btn btn-light dropdown-toggle btn-sm" type="button" data-bs-toggle="dropdown">
                              Actions
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <Link
                                  className="dropdown-item"
                                  to={`/category/${category.name}`}
                                  state={{ category }}
                                  onClick={() => console.log("Link clicked:", category)} // Debugging
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

          {/* Create Category Modal (visible by default) */}
          <div className="card shadow-sm mt-3" style={{ width: '350px', padding: '20px' }}>
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Create Category
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
                      onChange={(e) => setNewCategory({ name: e.target.value })}
                    />
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-primary">Save</button>
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
                      onChange={(e) => setEditCategory({ ...editCategory, numberOfSubCategories: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Date Created <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control w-100"
                      name="date"
                      placeholder="Enter Date Created"
                      value={editCategory.date}
                      onChange={handleDateChange}
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