import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Icon } from '@iconify/react/dist/iconify.js';

const API_URL = "https://biz-system-production.up.railway.app/v1/user";
const ROL_URL = "https://biz-system-production.up.railway.app/v1/roles";

const UsersListLayer = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToView, setUserToView] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Component mounted, fetching users and roles...');
    fetchUsers();
    fetchRolesAndModules();

    const editModal = document.getElementById("editUserModal");
    const resetEditForm = () => {
      if (!isLoading) {
        console.log('Resetting edit form');
        setEditUser({
          id: '',
          firstName: '',
          lastName: '',
          email: '',
          phoneNo: '',
          roleId: '',
          countryCode: '',
          userModelModulePermissions: [],
        });
      }
    };

    editModal?.addEventListener("hidden.bs.modal", resetEditForm);
    return () => editModal?.removeEventListener("hidden.bs.modal", resetEditForm);
  }, [isLoading]);

  useEffect(() => {
  }, [editUser]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching users with token:', token);
      const response = await axios.get(`${API_URL}/system`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetch Users Response:', response.data);
      const data = response.data.data || [];
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError("Failed to fetch users. Please try again.");
      setUsers([]);
      setFilteredUsers([]);
    }
  };

  const fetchRolesAndModules = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching roles with token:', token);
      const response = await axios.get(ROL_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetch Roles Response:', response.data);
      const rolesData = Array.isArray(response.data) ? response.data : response.data.data || [];
      const roleList = rolesData.map(role => ({
        roleId: role.roleId,
        roleName: role.roleName,
      }));
      setRoles(roleList);

      const allModules = [];
      const permissionsMap = {};
      rolesData.forEach((role) => {
        permissionsMap[role.roleId] = {};
        role.roleModulePermissions.forEach((module) => {
          if (!allModules.some((m) => m.moduleId === module.moduleId)) {
            allModules.push({
              moduleId: module.moduleId,
              name: module.name,
            });
          }
          permissionsMap[role.roleId][module.moduleId] = module.rolePermissions.map((p) => ({
            code: p.code,
            name: p.name || p.code,
            assigned: p.assigned,
          }));
        });
      });
      console.log('Modules:', allModules);
      console.log('Role Permissions:', permissionsMap);
      setModules(allModules);
      setRolePermissions(permissionsMap);
    } catch (error) {
      console.error('Error fetching roles and modules:', error);
      setRoles([]);
      setModules([]);
      setRolePermissions({});
    }
  };

  const handlePermissionChange = (moduleId, permissionCode, isChecked) => {
    console.log(`Permission Change: moduleId=${moduleId}, code=${permissionCode}, checked=${isChecked}`);
    setEditUser((prev) => {
      const updatedPermissions = [...prev.userModelModulePermissions];
      const moduleIndex = updatedPermissions.findIndex((up) => up.moduleId === moduleId);

      if (moduleIndex === -1) {
        updatedPermissions.push({
          moduleId,
          moduleName: modules.find(m => m.moduleId === moduleId)?.name || '',
          permissions: [{ code: permissionCode, name: permissionCode, assigned: isChecked }],
        });
      } else {
        const permissions = updatedPermissions[moduleIndex].permissions;
        const permIndex = permissions.findIndex(p => p.code === permissionCode);
        if (permIndex === -1) {
          permissions.push({ code: permissionCode, name: permissionCode, assigned: isChecked });
        } else {
          permissions[permIndex].assigned = isChecked;
        }
      }

      console.log('Updated Permissions after change:', updatedPermissions);
      return { ...prev, userModelModulePermissions: updatedPermissions };
    });
  };

  const handleEditClick = async (user) => {
    console.log('Edit clicked for user:', user);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/system/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data.data;
      console.log('User Data:', userData);

      const roleId = userData.role?.id || user.role?.id || '';
      const rolePerms = rolePermissions[roleId] || {};
      console.log('Role Permissions for roleId', roleId, ':', rolePerms);

      const userPerms = userData.userModelModulePermissions?.reduce((acc, module) => {
        acc[module.moduleId] = module.permissions.map(perm => ({
          code: perm.code,
          name: perm.name || perm.code,
          assigned: true, // Server-side assigned permissions are true
        }));
        return acc;
      }, {}) || {};
      console.log('User Permissions:', userPerms);

      const mergedPermissions = modules.map(module => {
        const roleModulePerms = rolePerms[module.moduleId] || [];
        const userModulePerms = userPerms[module.moduleId] || [];
        const permissions = roleModulePerms.map(rolePerm => ({
          code: rolePerm.code,
          name: rolePerm.name,
          assigned: userModulePerms.some(up => up.code === rolePerm.code), // Only check if explicitly assigned by user data
        }));
        return {
          moduleId: module.moduleId,
          moduleName: module.name,
          permissions,
        };
      }).filter(m => m.permissions.length > 0);
      console.log('Merged Permissions:', mergedPermissions);

      const updatedEditUser = {
        id: userData.id || user.id,
        firstName: userData.firstName || user.firstName || '',
        lastName: userData.lastName || user.lastName || '',
        email: userData.email || user.email || '',
        phoneNo: userData.phoneNo || user.phoneNo || '',
        roleId: roleId,
        countryCode: userData.countryCode || user.countryCode || 'KE',
        userModelModulePermissions: mergedPermissions,
      };
      setEditUser(updatedEditUser);
      
    } catch (error) {
      console.error('Error fetching user details:', error);
      setEditUser({
        id: user.id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNo: user.phoneNo || '',
        roleId: user.role?.id || '',
        countryCode: user.countryCode || 'KE',
        userModelModulePermissions: [],
      });
      setError('Failed to fetch user details.');
    }
  };

  const handleViewClick = async (user) => {
    console.log('View clicked for user:', user);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/system/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data.data;
      console.log('View User Data:', userData);
      setUserToView(userData);
    } catch (error) {
      console.error('Error fetching user details for view:', error);
      setUserToView(user);
      setError('Failed to fetch detailed user data.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editUser) return;
    console.log('Submitting edit form:', editUser);

    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      const payload = {
        firstName: editUser.firstName,
        lastName: editUser.lastName,
        email: editUser.email,
        phoneNumber: editUser.phoneNo,
        roleId: parseInt(editUser.roleId),
        countryCode: editUser.countryCode,
        userPermissions: editUser.userModelModulePermissions
          .map(module => ({
            moduleId: module.moduleId,
            permissionsCodes: module.permissions
              .filter(perm => perm.assigned)
              .map(perm => perm.code),
          }))
          .filter(module => module.permissionsCodes.length > 0),
      };
      console.log('Submit Payload:', payload);

      const response = await axios.put(`${API_URL}/register/update/${editUser.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Update Response:', response.data);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editUser.id ? { ...user, ...response.data.data } : user
        )
      );

      await fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.response?.data?.message || "Failed to update user.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    console.log('Delete clicked for user:', user);
    setUserToDelete(user);
  };

  const handleDeleteConfirm = async () => {
    console.log('Confirming delete for user:', userToDelete);
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/system/${userToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUsers = users.filter((user) => user.id !== userToDelete.id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.response?.data?.message || "Failed to delete user.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterUsers(query);
  };

  const handleSearchInputChange = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
    filterUsers(searchQuery);
  };

  const filterUsers = (searchQuery) => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.firstName?.toLowerCase().includes(lowerQuery) ||
        user.lastName?.toLowerCase().includes(lowerQuery) ||
        user.email?.toLowerCase().includes(lowerQuery) ||
        user.phoneNo?.toLowerCase().includes(lowerQuery) ||
        user.role?.name?.toLowerCase().includes(lowerQuery)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const getPermissionOptionsForModule = (moduleId, isEditMode = false) => {
    const roleId = isEditMode ? editUser.roleId : userToView?.role?.id;
    const perms = rolePermissions[roleId]?.[moduleId] || [];
    console.log(`Permissions for module ${moduleId} for role ${roleId} (Edit Mode: ${isEditMode}):`, perms);
    return perms;
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

        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <div>
              <form
                className="navbar-search mb-3"
                onSubmit={handleSearch}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <input
                  type="text"
                  name="search"
                  placeholder="Search by name, email, or phone"
                  value={query}
                  onChange={handleSearchInputChange}
                  className="form-control"
                  style={{ maxWidth: "300px" }}
                />
                <Icon icon='ion:search-outline' className='icon' style={{ width: '16px', height: '16px' }} />
              </form>
            </div>
            <div className="table-responsive" style={{ overflow: "visible" }}>
              <table className="table table-borderless table-hover text-start small-text" style={{ width: "100%" }}>
                <thead className="table-light text-start small-text">
                  <tr>
                    <th className="text-start py-3 px-4">#</th>
                    <th className="text-start py-3 px-4">First Name</th>
                    <th className="text-start py-3 px-4">Last Name</th>
                    <th className="text-start py-3 px-4">Email</th>
                    <th className="text-start py-3 px-4">Phone Number</th>
                    <th className="text-start py-3 px-4">Role</th>
                    <th className="text-start py-3 px-4">Status</th>
                    <th className="text-start py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((user) => (
                      <tr key={user.id} style={{ transition: "background-color 0.2s" }}>
                        <td className="text-start small-text py-3 px-4">
                          {indexOfFirstItem + currentItems.indexOf(user) + 1}
                        </td>
                        <td className="text-start small-text py-3 px-4">{user.firstName}</td>
                        <td className="text-start small-text py-3 px-4">{user.lastName}</td>
                        <td className="text-start small-text py-3 px-4">{user.email}</td>
                        <td className="text-start small-text py-3 px-4">{user.phoneNo}</td>
                        <td className="text-start small-text py-3 px-4">{user.role?.name || ''}</td>
                        <td className="text-start small-text py-3 px-4">
                          <span className={`bg-${user.status === 'Active' ? 'success-focus' : 'neutral-200'} text-${user.status === 'Active' ? 'success-600' : 'neutral-600'} px-24 py-4 radius-8 fw-medium text-sm`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="text-start small-text py-3 px-4">
                          <div className="dropdown">
                            <button
                              className="btn btn-outline-secondary btn-sm dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                              style={{ padding: "4px 8px" }}
                            >
                              Actions
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <Link
                                  className="dropdown-item"
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#viewUserModal"
                                  onClick={() => handleViewClick(user)}
                                >
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

            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted">
                <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} entries</span>
              </div>
              <nav aria-label="Page navigation">
                <ul className="pagination mb-0" style={{ gap: "8px" }}>
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "36px", height: "36px", padding: "0", transition: "all 0.2s" }}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <Icon icon="ep:d-arrow-left" style={{ fontSize: "18px" }} />
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                      <button
                        className={`page-link btn ${currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"} rounded-circle d-flex align-items-center justify-content-center`}
                        style={{
                          width: "36px",
                          height: "36px",
                          padding: "0",
                          transition: "all 0.2s",
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
                      style={{ width: "36px", height: "36px", padding: "0", transition: "all 0.2s" }}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <Icon icon="ep:d-arrow-right" style={{ fontSize: "18px" }} />
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
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </h6>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleEditSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6 mb-3">
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
                  <div className="col-md-6 mb-3">
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
                  <div className="col-md-6 mb-3">
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
                  <div className="col-md-6 mb-3">
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
                    value={editUser.roleId || ''}
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
                  {console.log('Current roleId in select:', editUser.roleId)}
                </div>

                {editUser.roleId ? (
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
                          {modules.length > 0 ? (
                            modules.map((module) => {
                              const perms = getPermissionOptionsForModule(module.moduleId, true);
                              if (perms.length === 0) return null;
                              const userModule = editUser.userModelModulePermissions.find(
                                (up) => up.moduleId === module.moduleId
                              ) || { permissions: [] };
                              return (
                                <tr key={module.moduleId}>
                                  <td>{module.name}</td>
                                  <td>
                                    <div className="d-flex flex-wrap gap-3">
                                      {perms.map((perm) => {
                                        const isChecked = userModule.permissions.some(
                                          (p) => p.code === perm.code && p.assigned
                                        );
                                        console.log(`Module: ${module.name}, Perm: ${perm.code}, Assigned: ${perm.assigned}, Checked: ${isChecked}`);
                                        return (
                                          <div key={perm.code} className="form-check" style={{ display: 'flex', alignItems: 'center' }}>
                                            <input
                                              type="checkbox"
                                              className="form-check-input me-2"
                                              checked={isChecked}
                                              onChange={(e) => handlePermissionChange(module.moduleId, perm.code, e.target.checked)}
                                            />
                                            <label className="form-check-label" style={{ marginBottom: 0 }}>{perm.name}</label>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan="2">No modules available</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <p>Select a role to view permissions</p>
                )}

                <div className="text-muted small mt-3">
                  Fields marked with <span className="text-danger">*</span> are required.
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                    data-bs-dismiss={!isLoading && !error ? "modal" : undefined}
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* View User Modal */}
      <div className="modal fade" id="viewUserModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                User Details
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </h6>
              {userToView && (
                <div className="mt-3">
                  <p className="mb-2"><strong>ID:</strong> {userToView.id}</p>
                  <p className="mb-2"><strong>First Name:</strong> {userToView.firstName}</p>
                  <p className="mb-2"><strong>Last Name:</strong> {userToView.lastName}</p>
                  <p className="mb-2"><strong>Email:</strong> {userToView.email}</p>
                  <p className="mb-2"><strong>Phone Number:</strong> {userToView.phoneNo}</p>
                  <p className="mb-2"><strong>Role:</strong> {userToView.role?.name || 'N/A'}</p>
                  <p className="mb-2"><strong>Status:</strong> {userToView.status || 'N/A'}</p>
                  <p className="mb-2"><strong>Country Code:</strong> {userToView.countryCode || 'N/A'}</p>

                  <div className="mt-4">
                    <h6 className="mb-3">Module Permissions</h6>
                    {userToView.userModelModulePermissions && userToView.userModelModulePermissions.length > 0 ? (
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Module</th>
                            <th>Permissions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userToView.userModelModulePermissions.map((module) => {
                            const rolePerms = getPermissionOptionsForModule(module.moduleId);
                            const activePerms = module.permissions.map(p => p.code);
                            const permissionsList = rolePerms.map(perm => ({
                              name: perm.name,
                              active: activePerms.includes(perm.code),
                            }));
                            return (
                              <tr key={module.moduleId}>
                                <td>{module.moduleName}</td>
                                <td>
                                  {permissionsList.length > 0 ? (
                                    permissionsList.map((perm, index) => (
                                      <span key={index} className={perm.active ? 'text-success' : 'text-muted'}>
                                        {perm.name}{perm.active ? '' : ' (Inactive)'}{index < permissionsList.length - 1 ? ', ' : ''}
                                      </span>
                                    ))
                                  ) : (
                                    'No permissions assigned'
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <p>No module permissions assigned to this user.</p>
                    )}
                  </div>
                </div>
              )}
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal">
                  Close
                </button>
              </div>
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