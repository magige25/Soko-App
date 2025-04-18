import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from "../hook/spinner-utils";

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
  const [allUsers, setAllUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const debouncedQuery = useDebounce(query, 300);

  const fetchUsers = useCallback(async (searchQuery = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`${API_URL}/system`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          searchValue: searchQuery
        }
      });
      
      const data = response.data.data || [];
      const total = response.data.totalElements || 0;
      
      setAllUsers(data);
      setTotalItems(total);
      
    } catch (error) {
      console.error('Error fetching users:', error);
      setError("Failed to fetch users. Please try again.");
      setAllUsers([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(debouncedQuery);
  }, [debouncedQuery, fetchUsers]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedUsers = allUsers.slice(startIndex, endIndex);
    setDisplayedUsers(paginatedUsers);
  }, [currentPage, allUsers, itemsPerPage]);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`${API_URL}/system/${userToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserToDelete(null);
      fetchUsers(debouncedQuery);
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

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

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
        <Link
          to="/users/add-user"
          className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
        >
          <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
          Add New User
        </Link>
      </div>
      
      <div className="card-body-table p-24">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="table-responsive scroll-sm">
          <table className="table table-borderless sm-table mb-0">
            <thead>
              <tr>
                <th scope="col" className="text-center py-3 px-6">ID</th>
                <th scope="col" className="text-start py-3 px-4">First Name</th>
                <th scope="col" className="text-start py-3 px-4">Last Name</th>
                <th scope="col" className="text-start py-3 px-4">Email</th>
                <th scope="col" className="text-start py-3 px-4">Phone Number</th>
                <th scope="col" className="text-start py-3 px-4">Role</th>
                <th scope="col" className="text-start py-3 px-4">Status</th>
                <th scope="col" className="text-start py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="text-center py-3">
                    <Spinner />
                  </td>
                </tr>
              ) : displayedUsers.length > 0 ? (
                displayedUsers.map((user, index) => (
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
                                <Icon icon="ri-eye-line" />
                                view
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item"
                                to="/users/edit-user"
                                state={{ userId: user.id }}
                              >
                                <Icon icon="ri-edit-line" />
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
                                <Icon icon="mdi:trash-can" />
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
            <div className="text-muted" style={{ fontSize: "13px" }}>
              <span>
                Showing {startIndex} to {endIndex} of {totalItems} entries
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