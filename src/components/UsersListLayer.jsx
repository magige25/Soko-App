import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Icon } from '@iconify/react/dist/iconify.js';

const API_URL = "https://api.bizchain.co.ke/v1/user";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

const UsersListLayer = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const debouncedQuery = useDebounce(query, 300);

  const fetchUsers = useCallback(async (page = 1, searchQuery = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/system`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: page,
          limit: itemsPerPage,
          searchValue: searchQuery
        }
      });
      
      const data = response.data.data || [];
      const total = response.data.totalElements || 0;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = Math.min(page * itemsPerPage, total);
      const paginatedData = data.slice(startIndex, endIndex);
      
      setUsers(paginatedData);
      setTotalItems(total);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError("Failed to fetch users. Please try again.");
      setUsers([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchUsers(currentPage, debouncedQuery);
  }, [currentPage, debouncedQuery, fetchUsers]);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/system/${userToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserToDelete(null);
      fetchUsers(currentPage, debouncedQuery);
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.response?.data?.message || "Failed to delete user.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  console.log('Rendering with action-dropdown class');
  console.log('CSS imported')

  return (
    <div className="page-wrapper">
      <div className="row">
        <div className="d-flex align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="ms-auto">
            <Link
              to="/users/add-user"
              className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add New User
            </Link>
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
                  placeholder="Search Name"
                  value={query}
                  onChange={handleSearchInputChange}
                  className="form-control"
                  style={{ maxWidth: "300px" }}
                />
                <Icon icon="ion:search-outline" className="icon" style={{ width: "16px", height: "16px" }} />
              </form>
            </div>
            <div className="table-responsive" style={{ overflow: "visible" }}>
              <table className="table table-borderless table-hover text-start small-text">
                <thead className="table-light text-start small-text">
                  <tr>
                    <th className="text-center py-3 px-6" style={{ width: "50px" }}>#</th>
                    <th className="text-start py-3 px-4">First Name</th>
                    <th className="text-start py-3 px-4">Last Name</th>
                    <th className="text-start py-3 px-4">Email</th>
                    <th className="text-start py-3 px-4">Phone Number</th>
                    <th className="text-start py-3 px-4">Role</th>
                    <th className="text-start py-3 px-4">Status</th>
                    <th className="text-start py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: "14px" }}>
                  {isLoading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-3">
                        <div>
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={user.id} style={{ transition: "background-color 0.2s" }}>
                        <td className="text-center small-text py-3 px-6">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="text-start small-text py-3 px-4">{user.firstName}</td>
                        <td className="text-start small-text py-3 px-4">{user.lastName}</td>
                        <td className="text-start small-text py-3 px-4">{user.email}</td>
                        <td className="text-start small-text py-3 px-4">{user.phoneNo}</td>
                        <td className="text-start small-text py-3 px-4">{user.role?.name || ''}</td>
                        <td className="text-start small-text py-3 px-4">
                          <span className={`bg-${user.blocked ? 'neutral-200' : 'success-focus'} text-${user.blocked ? 'neutral-600' : 'success-600'} px-24 py-4 radius-8 fw-medium text-sm`}>
                            {user.blocked ? 'Blocked' : 'Active'}
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
                                  <Link
                                    className="dropdown-item"
                                    to="/users/details"
                                    state={{ userId: user.id }}
                                  >
                                    Details
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to="/users/edit-user"
                                    state={{ userId: user.id }}
                                  >
                                    Edit
                                  </Link>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item text-danger"
                                    onClick={() => handleDeleteClick(user)}
                                    data-bs-toggle="modal"
                                    data-bs-target="#deleteUserModal"
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
                      <td colSpan="8" className="text-center py-3">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {!isLoading && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-muted" style={{ fontSize: "13px"}}>
                  <span>
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
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
                          className={`page-link btn ${currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"} rounded-circle d-flex align-items-center justify-content-center`}
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
      </div>

      <div className="modal fade" id="deleteUserModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body pt-3 ps-18 pe-18">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="modal-title fs-6">Delete User</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <p className="pb-3 mb-0">
                Are you sure you want to delete the <strong>{userToDelete?.firstName} {userToDelete?.lastName}</strong> user permanently? This action cannot be undone.
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

export default UsersListLayer;