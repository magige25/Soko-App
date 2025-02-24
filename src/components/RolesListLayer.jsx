import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import axios from "axios";

// Mapping of module names to IDs as per your API
const moduleMapping = {
  "User Management": 1,
  "Region Management": 2,
  "Payment Management": 3,
};

// Mapping of our permission names to API codes
const permissionMapping = {
  view: "RD",
  create: "CRT",
  delete: "DLT",
};

const modulesList = Object.keys(moduleMapping);
const permissionsList = Object.keys(permissionMapping);

const RolesLayer = () => {
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Create Role Form state
  const [newRole, setNewRole] = useState({
    name: "",
    entityType: "",
    modulePermissions: {},
  });

  // Edit Role state
  const [editRole, setEditRole] = useState(null);

  // View Role state
  const [selectedRole, setSelectedRole] = useState(null);

  // API endpoints
  const fetchRolesAPI = "https://biz-system-production.up.railway.app/v1/roles";
  const createRoleAPI = "https://biz-system-production.up.railway.app/v1/roles";
  const updateRoleAPI = (roleId) =>
    `https://biz-system-production.up.railway.app/v1/roles/${roleId}`;

  // Create a ref for the Create Role modal content
  const addModalRef = useRef(null);

  // Fetch roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(fetchRolesAPI, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoles(response.data.data);
        console.log("Roles state:", response.data.data);
      } catch (error) {
        console.error("Error fetching roles", error);
      }
    };

    fetchRoles();
  }, []);

  // Helper: Format a date (expected format: dd Month yyyy)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  // Build modulePermissions payload for API
  const buildModulePermissionsPayload = (modulesState) => {
    return Object.entries(modulesState)
      .filter(([moduleId, perms]) => perms && perms.length > 0)
      .map(([moduleId, perms]) => ({
        moduleId: Number(moduleId),
        permissions: perms,
      }));
  };

  // Handle Create Role form submission
  const handleCreateRole = () => {
    const payload = {
      name: newRole.name,
      entityType: newRole.entityType,
      modulePermissions: buildModulePermissionsPayload(newRole.modulePermissions),
    };
    console.log("Creating role with payload", payload);

    const token = localStorage.getItem("token");
    axios
      .post(createRoleAPI, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setRoles([...roles, res.data.data]);
        // Reset form
        resetCreateForm();
      })
      .catch((err) => {
        console.error("Error creating role", err);
      });
  };

  // Reset the Create Role form
  const resetCreateForm = () => {
    setNewRole({
      name: "",
      entityType: "",
      modulePermissions: {},
    });
  };

  // Click-outside handler for Create Role modal to reset the form
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addModalRef.current && !addModalRef.current.contains(event.target)) {
        resetCreateForm();
      }
    };

    const modalElement = document.getElementById("createRoleModal");
    if (modalElement && modalElement.classList.contains("show")) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [newRole]);

  // Handle Edit Role form submission
  const handleEditRoleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: editRole.name,
      entityType: editRole.entityType,
      modulePermissions: buildModulePermissionsPayload(editRole.modulePermissions),
    };
    const token = localStorage.getItem("token");
    axios
      .put(updateRoleAPI(editRole.roleId), payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const updatedRole = res.data.data;
        const updatedRoles = roles.map((role) =>
          role.roleId === editRole.roleId ? updatedRole : role
        );
        setRoles(updatedRoles);
        setEditRole(null);
      })
      .catch((err) => {
        console.error("Error updating role", err);
      });
  };

  // Open edit modal and transform API data to local edit state
  const openEditModal = (role) => {
    const modulePermissions = {};
    role.roleModulePermissions.forEach((mod) => {
      const assigned = mod.rolePermissions
        .filter((perm) => perm.assigned)
        .map((perm) => perm.code);
      modulePermissions[mod.moduleId] = assigned;
    });
    setEditRole({
      roleId: role.roleId,
      name: role.roleName,
      entityType: role.entityType.code,
      modulePermissions,
    });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = roles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(roles.length / itemsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Handle checkbox changes for both create and edit forms
  const handleCheckboxChange = (formType, moduleName, permKey, checked) => {
    const moduleId = moduleMapping[moduleName];
    const code = permissionMapping[permKey];
    if (formType === "create") {
      const updatedModules = { ...newRole.modulePermissions };
      if (!updatedModules[moduleId]) {
        updatedModules[moduleId] = [];
      }
      if (checked) {
        if (!updatedModules[moduleId].includes(code)) {
          updatedModules[moduleId].push(code);
        }
      } else {
        updatedModules[moduleId] = updatedModules[moduleId].filter((p) => p !== code);
      }
      setNewRole({ ...newRole, modulePermissions: updatedModules });
    } else if (formType === "edit") {
      const updatedModules = { ...editRole.modulePermissions };
      if (!updatedModules[moduleId]) {
        updatedModules[moduleId] = [];
      }
      if (checked) {
        if (!updatedModules[moduleId].includes(code)) {
          updatedModules[moduleId].push(code);
        }
      } else {
        updatedModules[moduleId] = updatedModules[moduleId].filter((p) => p !== code);
      }
      setEditRole({ ...editRole, modulePermissions: updatedModules });
    }
  };

  // Inline style for spacing between checkboxes and labels
  const checkboxContainerStyle = {
    marginRight: "1rem",
  };

  return (
    <div className="page-wrapper">
      <div className="row">
        {/* Header with Create Role button */}
        <div className="d-flex justify-content-end align-items-center mb-3">
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#createRoleModal"
          >
            + Add Role
          </button>
        </div>

        {/* Roles Table */}
        <div className="card shadow-sm full-width-card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-borderless">
                <thead className="table-light">
                  <tr>
                    <th>Role Name</th>
                    <th>Date Created</th>
                    <th>Entity Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((role, index) => (
                    <tr key={role.roleId || index}>
                      <td>{role.roleName}</td>
                      <td>{formatDate(role.dateCreated)}</td>
                      <td>
                        {role.entityType && role.entityType.name
                          ? role.entityType.name
                          : "N/A"}
                      </td>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn btn-light dropdown-toggle btn-sm"
                            data-bs-toggle="dropdown"
                          >
                            Actions
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <Link
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#viewRoleModal"
                                onClick={() => setSelectedRole(role)}
                              >
                                View
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#editRoleModal"
                                onClick={() => openEditModal(role)}
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Are you sure you want to delete this role?"
                                    )
                                  ) {
                                    const token = localStorage.getItem("token");
                                    axios
                                      .delete(updateRoleAPI(role.roleId), {
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                        },
                                      })
                                      .then(() => {
                                        const updatedRoles = roles.filter(
                                          (r) => r.roleId !== role.roleId
                                        );
                                        setRoles(updatedRoles);
                                      })
                                      .catch((err) =>
                                        console.error("Error deleting role", err)
                                      );
                                  }
                                }}
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
          </div>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-start mt-3">
          <div className="text-muted">
            <span>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, roles.length)} of{" "}
              {roles.length} entries
            </span>
          </div>
          <nav aria-label="Page navigation">
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <Icon icon="ep:d-arrow-left" />
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                  <button
                    className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px"
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
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

        {/* Create Role Modal */}
        <div className="modal fade" id="createRoleModal" tabIndex="-1">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content" ref={addModalRef}>
              <div className="modal-header">
                <h6 className="modal-title">Add Role</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Role Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Role Name"
                      value={newRole.name}
                      onChange={(e) =>
                        setNewRole({ ...newRole, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Entity Type</label>
                    <select
                      className="form-select"
                      value={newRole.entityType}
                      onChange={(e) =>
                        setNewRole({ ...newRole, entityType: e.target.value })
                      }
                    >
                      <option value="">Select</option>
                      <option value="S_ADM">System Admin</option>
                      <option value="ADM">Admin</option>
                      <option value="USR">User</option>
                    </select>
                  </div>
                </div>

                {/* Modules and Permissions */}
                <div className="mb-3">
                  <h6>Modules and Permissions</h6>
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th style={{ width: "40%" }}>Module</th>
                        <th>Permissions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modulesList.map((moduleName) => (
                        <tr key={moduleName}>
                          <td>{moduleName}</td>
                          <td>
                            {permissionsList.map((permKey) => (
                              <div
                                className="form-check form-check-inline"
                                key={permKey}
                                style={checkboxContainerStyle}
                              >
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`create-${moduleName}-${permKey}`}
                                  checked={
                                    newRole.modulePermissions[moduleMapping[moduleName]]?.includes(
                                      permissionMapping[permKey]
                                    ) || false
                                  }
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      "create",
                                      moduleName,
                                      permKey,
                                      e.target.checked
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`create-${moduleName}-${permKey}`}
                                  className="form-check-label"
                                  style={{ marginLeft: "0.25rem" }}
                                >
                                  {permKey}
                                </label>
                              </div>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={handleCreateRole}
                  data-bs-dismiss="modal"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Role Modal */}
        {editRole && (
          <div className="modal fade" id="editRoleModal" tabIndex="-1">
            <div className="modal-dialog modal-md modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="modal-title">Edit Role</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleEditRoleSubmit}>
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Role Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editRole.name}
                          onChange={(e) =>
                            setEditRole({ ...editRole, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Entity Type</label>
                        <select
                          className="form-select"
                          value={editRole.entityType}
                          onChange={(e) =>
                            setEditRole({ ...editRole, entityType: e.target.value })
                          }
                        >
                          <option value="">Select</option>
                          <option value="S_ADM">System Admin</option>
                          <option value="ADM">Admin</option>
                          <option value="USR">User</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-3">
                      <h6>Modules and Permissions</h6>
                      <table className="table table-borderless">
                        <thead>
                          <tr>
                            <th style={{ width: "40%" }}>Module</th>
                            <th>Permissions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {modulesList.map((moduleName) => (
                            <tr key={moduleName}>
                              <td>{moduleName}</td>
                              <td>
                                {permissionsList.map((permKey) => (
                                  <div
                                    className="form-check form-check-inline"
                                    key={permKey}
                                    style={checkboxContainerStyle}
                                  >
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id={`edit-${moduleName}-${permKey}`}
                                      checked={
                                        editRole.modulePermissions[moduleMapping[moduleName]]?.includes(
                                          permissionMapping[permKey]
                                        ) || false
                                      }
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          "edit",
                                          moduleName,
                                          permKey,
                                          e.target.checked
                                        )
                                      }
                                    />
                                    <label
                                      htmlFor={`edit-${moduleName}-${permKey}`}
                                      className="form-check-label"
                                      style={{ marginLeft: "0.25rem" }}
                                    >
                                      {permKey}
                                    </label>
                                  </div>
                                ))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="d-flex justify-content-end">
                      <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Role Modal */}
        <div className="modal fade" id="viewRoleModal" tabIndex="-1">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="modal-title">Role Details</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                {selectedRole && (
                  <>
                    <p>
                      <strong>Role Name:</strong> {selectedRole.roleName}
                    </p>
                    <p>
                      <strong>Entity Type:</strong>{" "}
                      {selectedRole.entityType?.name || selectedRole.entityType}
                    </p>
                    <p>
                      <strong>Modules and Permissions:</strong>
                    </p>
                    <ul>
                      {selectedRole.roleModulePermissions.map((mod) => (
                        <li key={mod.moduleId}>
                          <strong>{mod.name}</strong>:{" "}
                          {mod.rolePermissions
                            .filter((p) => p.assigned)
                            .map((p) => p.code)
                            .join(", ")}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesLayer;