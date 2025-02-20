import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://192.168.100.45:8098/v1/user/system';

const UsersListLayer = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editUser, setEditUser] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    roleId: '',
    userPermissions: [], // Array of { moduleId, permissionsCodes }
  });

  // Permissions data
  const permissionsData = [
    {
      moduleId: 1,
      moduleName: 'User Management',
      permissions: [
        { code: 'RD', label: 'Read' },
        { code: 'WR', label: 'Write' },
        { code: 'CR', label: 'Create' },
        { code: 'DL', label: 'Delete' },
      ],
    },
    {
      moduleId: 2,
      moduleName: 'Financial Management',
      permissions: [
        { code: 'RD', label: 'Read' },
        { code: 'WR', label: 'Write' },
        { code: 'CR', label: 'Create' },
        { code: 'DL', label: 'Delete' },
      ],
    },
    {
      moduleId: 3,
      moduleName: 'User Management',
      permissions: [
        { code: 'RD', label: 'Read' },
        { code: 'WR', label: 'Write' },
        { code: 'CR', label: 'Create' },
        { code: 'DL', label: 'Delete' },
      ],
    },
    // Add more modules as needed
  ];

  // Fetch users from the API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('API Response (Fetch Users):', response.data);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Open Edit Modal
  const openEditModal = (user) => {
    setEditUser({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNo,
      roleId: user.role.id,
      userPermissions: user.userPermissions || [], // Ensure this matches your API response
    });
  };

  // Handle Permission Changes
  const handlePermissionChange = (moduleId, permissionCode, isChecked) => {
    setEditUser((prev) => {
      const updatedPermissions = [...prev.userPermissions];
      const moduleIndex = updatedPermissions.findIndex((up) => up.moduleId === moduleId);

      if (moduleIndex === -1) {
        updatedPermissions.push({
          moduleId,
          permissionsCodes: isChecked ? [permissionCode] : [],
        });
      } else {
        // Update existing module permissions
        const permissionsCodes = updatedPermissions[moduleIndex].permissionsCodes;
        if (isChecked) {
          permissionsCodes.push(permissionCode);
        } else {
          updatedPermissions[moduleIndex].permissionsCodes = permissionsCodes.filter(
            (code) => code !== permissionCode
          );
        }
      }

      return { ...prev, userPermissions: updatedPermissions };
    });
  };

  // Handle Edit Form Submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/${editUser.id}`, // Update the endpoint as needed
        editUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('User updated successfully:', response.data);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Handle Delete Click
  const handleDeleteClick = (user) => {
    if (!user) return;
    setUserToDelete(user);
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${userToDelete.code}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('API Response (Delete User):', 'User deleted successfully');

      // Update the state
      const updatedUsers = users.filter((c) => c.code !== userToDelete.code);
      setUsers(updatedUsers);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="row">
        <div className="d-flex align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="ms-auto">
            <Link
              to="/add-users"
              className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add New User
            </Link>
          </div>
        </div>

        <div className="card shadow-sm mt-3 full-width-card" style={{ width: '100%' }}>
          <div className="card-body">
            <div>
              <form className="navbar-search" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', width: '32px' }}>
                <input
                  type="text"
                  name="search"
                  placeholder="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Icon icon="ion:search-outline" className="icon" style={{ width: '16px', height: '16px' }} />
              </form>
            </div>
            <div className="table-responsive" style={{ overflow: 'visible' }}>
              <table className="table table-borderless text-start small-text" style={{ width: '100%' }}>
                <thead className="table-light text-start small-text">
                  <tr>
                    <th className="text-start">#</th>
                    <th className="text-start">First Name</th>
                    <th className="text-start">Last Name</th>
                    <th className="text-start">Email</th>
                    <th className="text-start">Phone Number</th>
                    <th className="text-start">Role</th>
                    <th className="text-start">Status</th>
                    <th className="text-start">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((user, index) => (
                    <tr key={index}>
                      <th scope="row" className="text-start small-text">{index + 1}</th>
                      <td className="text-start small-text">{user.firstName}</td>
                      <td className="text-start small-text">{user.lastName}</td>
                      <td className="text-start small-text">{user.email}</td>
                      <td className="text-start small-text">{user.phoneNo}</td>
                      <td className="text-start small-text">{user.role.name}</td>
                      <td className="text-start small-text">
                        <span className={`bg-${user.status === 'Active' ? 'success-focus' : 'neutral-200'} text-${user.status === 'Active' ? 'success-600' : 'neutral-600'} px-24 py-4 radius-8 fw-medium text-sm`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="text-start small-text">
                        <div className="dropdown">
                          <button className="btn btn-light dropdown-toggle btn-sm" type="button" data-bs-toggle="dropdown">
                            Actions
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <Link className="dropdown-item" to={`/users/${user.id}`}>
                                View
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#editUserModal"
                                onClick={() => openEditModal(user)}
                              >
                                Edit
                              </button>
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-start mt-3">
              <div className="text-muted">
                <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, users.length)} of {users.length} entries</span>
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
      </div>

      {/* Edit User Modal */}
      <div className="modal fade" id="editUserModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                Edit User
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </h6>
              <form onSubmit={handleEditSubmit}>
                {/* First Name and Last Name */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">
                      First Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter First Name"
                      value={editUser.firstName}
                      onChange={(e) => setEditUser({ ...editUser, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      Last Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Last Name"
                      value={editUser.lastName}
                      onChange={(e) => setEditUser({ ...editUser, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Phone Number and Email */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Enter Phone Number"
                      value={editUser.phoneNumber}
                      onChange={(e) => setEditUser({ ...editUser, phoneNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter Email"
                      value={editUser.email}
                      onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Role Dropdown */}
                <div className="mb-3">
                  <label className="form-label">
                    Role <span className="text-danger">*</span>
                  </label>
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-primary-600 not-active px-18 py-11 dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {editUser.roleId === 1
                        ? 'Admin'
                        : editUser.roleId === 2
                        ? 'Manager'
                        : editUser.roleId === 3
                        ? 'User'
                        : 'Select Role'}
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <button
                          className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                          onClick={() => setEditUser({ ...editUser, roleId: 1 })}
                        >
                          Admin
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                          onClick={() => setEditUser({ ...editUser, roleId: 2 })}
                        >
                          Manager
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                          onClick={() => setEditUser({ ...editUser, roleId: 3 })}
                        >
                          User
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Permissions Table */}
                <div className="mb-3">
                  <label className="form-label">
                    Permissions <span className="text-danger">*</span>
                  </label>
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead>
                        <tr>
                          <th>Module</th>
                          <th>Permissions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {permissionsData.map((module) => (
                          <tr key={module.moduleId}>
                            <td>{module.moduleName}</td>
                            <td>
                              <div className="d-flex flex-wrap gap-3">
                                {module.permissions.map((perm) => (
                                  <div key={perm.code} className="form-check" style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                      type="checkbox"
                                      className="form-check-input me-2"
                                      checked={editUser.userPermissions
                                        .find((up) => up.moduleId === module.moduleId)
                                        ?.permissionsCodes.includes(perm.code)}
                                      onChange={(e) => handlePermissionChange(module.moduleId, perm.code, e.target.checked)}
                                    />
                                    <label className="form-check-label" style={{ marginBottom: 0 }}>{perm.label}</label>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div className="modal fade" id="deleteUserModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body pt-3 ps-18 pe-18">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="modal-title fs-6">Delete User</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <p className="pb-3 mb-0">
                Are you sure you want to delete the <strong>{userToDelete?.name}</strong> user permanently? This action cannot be undone.
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