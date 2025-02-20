import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Icon } from '@iconify/react/dist/iconify.js';

const API_URL = "https://biz-system-production.up.railway.app/v1/user";
const ROL_URL = "https://biz-system-production.up.railway.app/v1/roles";

const UsersListLayer = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [editUser, setEditUser] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    roleId: '',
    countryCode: '',
    userModelModulePermissions: [],
  });

  useEffect(() => {
    fetchUsers();
    fetchRolesAndModules();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/system`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetch Users Response:', response.data);
      setUsers(response.data.data.map(user => ({
        ...user,
        countryCode: user.countryCode || '',
      })) || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const fetchRolesAndModules = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(ROL_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetch Roles Response:', response.data);
      const roleList = response.data.data.map(role => ({
        roleId: role.roleId,
        roleName: role.roleName,
      }));
      setRoles(roleList);

      const moduleMap = new Map();
      response.data.data.forEach(role => {
        role.roleModulePermissions.forEach(module => {
          if (!moduleMap.has(module.moduleId)) {
            moduleMap.set(module.moduleId, {
              moduleId: module.moduleId,
              name: module.name,
              rolePermissions: module.rolePermissions || [],
            });
          }
        });
      });
      setModules(Array.from(moduleMap.values()));
    } catch (error) {
      console.error('Error fetching roles and modules:', error);
      setRoles([]);
      setModules([]);
    }
  };

  const handlePermissionChange = (moduleId, permissionCode, isChecked) => {
    setEditUser((prev) => {
      const updatedPermissions = [...prev.userModelModulePermissions];
      const moduleIndex = updatedPermissions.findIndex((up) => up.moduleId === moduleId);

      if (moduleIndex === -1) {
        updatedPermissions.push({
          moduleId,
          moduleName: modules.find(m => m.moduleId === moduleId)?.name || '',
          permissions: isChecked ? [{ code: permissionCode, name: '', assigned: true }] : [],
        });
      } else {
        const permissions = updatedPermissions[moduleIndex].permissions;
        if (isChecked) {
          const permName = modules
            .find(m => m.moduleId === moduleId)
            ?.rolePermissions.find(p => p.code === permissionCode)?.name || '';
          permissions.push({ code: permissionCode, name: permName, assigned: true });
        } else {
          updatedPermissions[moduleIndex].permissions = permissions.filter(
            (perm) => perm.code !== permissionCode
          );
        }
      }

      return { ...prev, userModelModulePermissions: updatedPermissions };
    });
  };

  const handleEditClick = async (user) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/system/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('User Details Response:', response.data);
      const userData = response.data.data;

      setEditUser({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNo: user.phoneNo,
        roleId: userData.roleId || user.role.id,
        countryCode: userData.countryCode || user.countryCode || 'KE',
        userModelModulePermissions: userData.roleModulePermissions.map(module => ({
          moduleId: module.moduleId,
          moduleName: module.name,
          permissions: module.rolePermissions.map(perm => ({
            code: perm.code,
            name: perm.name,
            assigned: perm.assigned,
          })),
        })) || [],
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
      setEditUser({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNo: user.phoneNo,
        roleId: user.role.id,
        countryCode: user.countryCode || 'KE',
        userModelModulePermissions: [],
      });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editUser) return;

    try {
      const token = localStorage.getItem('token');
      console.log('Submitting changes:', editUser);

      const payload = {
        firstName: editUser.firstName,
        lastName: editUser.lastName,
        email: editUser.email,
        phoneNumber: editUser.phoneNo,
        roleId: parseInt(editUser.roleId),
        countryCode: editUser.countryCode,
        userPermissions: editUser.userModelModulePermissions.map(module => ({
          moduleId: module.moduleId,
          permissionsCodes: module.permissions
            .filter(perm => perm.assigned)
            .map(perm => perm.code),
        })).filter(module => module.permissionsCodes.length > 0),
      };

      console.log('Transformed payload:', payload);

      const response = await axios.put(`${API_URL}/register/update/${editUser.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editUser.id ? { ...user, ...response.data.data } : user
        )
      );
      console.log('User updated successfully:', response.data);
      fetchUsers();
      document.getElementById('editUserModal').classList.remove('show');
    } catch (error) {
      console.error('Error updating user:', error);
      if (error.response) {
        console.log('Server error response:', JSON.stringify(error.response.data, null, 2));
      }
    }
  };

  const handleDeleteClick = (user) => {
    if (!user) return;
    setUserToDelete(user);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Deleting user ID:', userToDelete.id);
      const response = await axios.delete(`${API_URL}/register/update/${userToDelete.id}`, { // Updated endpoint
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('API Response (Delete User):', response.data);
      const updatedUsers = users.filter((user) => user.id !== userToDelete.id);
      setUsers(updatedUsers);
      setUserToDelete(null);
      document.getElementById('deleteUserModal').classList.remove('show'); // Close modal on success
    } catch (error) {
      console.error('Error deleting user:', error);
      if (error.response) {
        console.log('Server error response:', JSON.stringify(error.response.data, null, 2));
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
                    <tr key={user.id}>
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
                              <Link
                                className="dropdown-item"
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#editUserModal"
                                onClick={() => handleEditClick(user)}
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
                />
              </h6>
              <form onSubmit={handleEditSubmit}>
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

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Enter Phone Number"
                      value={editUser.phoneNo}
                      onChange={(e) => setEditUser({ ...editUser, phoneNo: e.target.value })}
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

                <div className="mb-3">
                  <label className="form-label">
                    Role <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={editUser.roleId}
                    onChange={(e) => setEditUser({ ...editUser, roleId: e.target.value })}
                    required
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.roleId} value={role.roleId}>
                        {role.roleName}
                      </option>
                    ))}
                  </select>
                </div>

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
                        {modules.map((module) => (
                          <tr key={module.moduleId}>
                            <td>{module.name}</td>
                            <td>
                              <div className="d-flex flex-wrap gap-3">
                                {module.rolePermissions.map((perm) => (
                                  <div key={perm.code} className="form-check" style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                      type="checkbox"
                                      className="form-check-input me-2"
                                      checked={editUser.userModelModulePermissions
                                        .find((up) => up.moduleId === module.moduleId)
                                        ?.permissions.some((p) => p.code === perm.code && p.assigned) || false}
                                      onChange={(e) => handlePermissionChange(module.moduleId, perm.code, e.target.checked)}
                                    />
                                    <label className="form-check-label" style={{ marginBottom: 0 }}>{perm.name}</label>
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
              <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersListLayer;