import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
//import { Link } from "react-router-dom";
import axios from "axios";

const RolesLayer = () => {
  const [roles, setRoles] = useState([]);
  const [entityTypes, setEntityTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [newRole, setNewRole] = useState({
    name: "",
    entityType: "",
    modulePermissions: {}
  });
  const [createModules, setCreateModules] = useState([]); // Modules for Create modal

  const [editRole, setEditRole] = useState(null);
  const [editModules, setEditModules] = useState([]); // Modules for Edit modal

  // View Role state
  const [selectedRole, setSelectedRole] = useState(null);

  // API endpoints
  const ROLES_API_URL = "https://api.bizchain.co.ke/v1/roles";
  const MODULES_API_URL = "https://api.bizchain.co.ke/v1/module-permission"; // Base URL

  const addModalRef = useRef(null);

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(ROLES_API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRoles(response.data.data);
      } catch (error) {
        console.error("Error fetching roles", error);
      }
    };
    fetchRoles();
  }, []);

  // Fetch entity types
  useEffect(() => {
    const fetchEntityTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://api.bizchain.co.ke/v1/entity-types", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEntityTypes(response.data.data);
      } catch (error) {
        console.error("Error fetching entity types", error);
      }
    };
    fetchEntityTypes();
  }, []);

  // Fetch modules for Create modal when entityType changes
  useEffect(() => {
    const fetchModules = async () => {
      if (!newRole.entityType) {
        setCreateModules([]);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${MODULES_API_URL}?entityType=${newRole.entityType}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const processedModules = response.data.data.map((module) => ({
          ...module,
          rolePermissions: module.rolePermissions || []
        }));
        setCreateModules(processedModules);
      } catch (error) {
        console.error("Error fetching modules for create", error);
        setCreateModules([]);
      }
    };
    fetchModules();
  }, [newRole.entityType]);

  // Fetch modules for Edit modal when entityType changes
  useEffect(() => {
    const fetchModules = async () => {
      if (!editRole?.entityType) {
        setEditModules([]);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${MODULES_API_URL}?entityType=${editRole.entityType}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const processedModules = response.data.data.map((module) => ({
          ...module,
          rolePermissions: module.rolePermissions || []
        }));
        setEditModules(processedModules);
      } catch (error) {
        console.error("Error fetching modules for edit", error);
        setEditModules([]);
      }
    };
    fetchModules();
  }, [editRole?.entityType]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString('en-GB', options);
  };

  const buildModulePermissionsPayload = (modulesState) => {
    return Object.entries(modulesState)
      .filter(([_, perms]) => perms && perms.length > 0)
      .map(([moduleId, perms]) => ({
        moduleId: Number(moduleId),
        permissions: perms
      }));
  };

  const handleCreateRole = () => {
    const payload = {
      name: newRole.name,
      entityType: newRole.entityType,
      modulePermissions: buildModulePermissionsPayload(newRole.modulePermissions)
    };
    const token = localStorage.getItem("token");
    axios
      .post(ROLES_API_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      .then((res) => {
        setRoles([...roles, res.data.data]);
        resetCreateForm();
        addModalRef.current?.querySelector(".btn-close")?.click();
      })
      .catch((err) => {
        console.error("Error creating role", err);
      });
  };

  const resetCreateForm = () => {
    setNewRole({
      name: "",
      entityType: "",
      modulePermissions: {}
    });
    setCreateModules([]); // Reset modules when form resets
  };

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

  const handleEditRoleSubmit = (e) => {
    e.preventDefault();
    if (!editRole) return; // Prevent submission if editRole is null

    const payload = {
      name: editRole.name,
      entityType: editRole.entityType,
      modulePermissions: buildModulePermissionsPayload(editRole.modulePermissions)
    };
    const token = localStorage.getItem("token");
    axios
      .put(`${ROLES_API_URL}/${editRole.roleId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      .then(async () => {
        const res = await axios.get(ROLES_API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRoles(res.data.data);
        setEditRole(null);
        setEditModules([]); // Reset edit modules
      })
      .catch((err) => {
        console.error("Error updating role", err);
      });
  };

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
      modulePermissions
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = roles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(roles.length / itemsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleCheckboxChange = (formType, moduleId, permissionCode, checked) => {
    if (formType === "create") {
      const updatedModules = { ...newRole.modulePermissions };
      if (!updatedModules[moduleId]) updatedModules[moduleId] = [];
      if (checked) {
        if (!updatedModules[moduleId].includes(permissionCode)) {
          updatedModules[moduleId].push(permissionCode);
        }
      } else {
        updatedModules[moduleId] = updatedModules[moduleId].filter((p) => p !== permissionCode);
      }
      setNewRole({ ...newRole, modulePermissions: updatedModules });
    } else if (formType === "edit" && editRole) {
      const updatedModules = { ...editRole.modulePermissions };
      if (!updatedModules[moduleId]) updatedModules[moduleId] = [];
      if (checked) {
        if (!updatedModules[moduleId].includes(permissionCode)) {
          updatedModules[moduleId].push(permissionCode);
        }
      } else {
        updatedModules[moduleId] = updatedModules[moduleId].filter((p) => p !== permissionCode);
      }
      setEditRole({ ...editRole, modulePermissions: updatedModules });
    }
  };

  const checkboxContainerStyle = { marginRight: "1rem" };

  // Filter modules to show only those with permissions
  const filterModulesWithPermissions = (modules) => {
    return modules.filter((module) => module.permissions && module.permissions.length > 0);
  };

  return (
    <div className="page-wrapper">
      <div className="row">
        <div className="d-flex justify-content-end align-items-center mb-3">
          <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createRoleModal">
            + Add Role
          </button>
        </div>

        <div className="card shadow-sm full-width-card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-borderless">
                <thead className="table-light text-start small-text" style={{fontSize:"15px"}}>
                  <tr>
                    <th>Role Name</th>
                    <th>Date Created</th>
                    <th>Entity Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: "14px" }}>
                  {currentItems.map((role) => (
                    <tr key={role.roleId}>
                      <td>{role.roleName}</td>
                      <td>{formatDate(role.dateCreated)}</td>
                      <td>{role.entityType?.name || "N/A"}</td>
                      <td>
                        <div className="dropdown">
                          <button className="btn btn-outline-secondary dropdown-toggle btn-sm" data-bs-toggle="dropdown" style={{padding:"4px 8px"}}>
                            Actions
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#viewRoleModal"
                                onClick={() => setSelectedRole(role)}
                              >
                                View
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#editRoleModal"
                                onClick={() => openEditModal(role)}
                              >
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => {
                                  if (window.confirm("Are you sure you want to delete this role?")) {
                                    const token = localStorage.getItem("token");
                                    axios
                                      .delete(`${ROLES_API_URL}/${role.roleId}`, {
                                        headers: { Authorization: `Bearer ${token}` }
                                      })
                                      .then(() => {
                                        setRoles(roles.filter((r) => r.roleId !== role.roleId));
                                      })
                                      .catch((err) => console.error("Error deleting role", err));
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
                  aria-label="Previous page"
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
                  aria-label="Next page"
                >
                  <Icon icon="ep:d-arrow-right" />
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Create Role Modal */}
        <div className="modal fade" id="createRoleModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content" ref={addModalRef}>
              <div className="modal-header">
                <h6 className="modal-title">Add Role</h6>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={resetCreateForm}
                ></button>
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
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                  <label className="form-label">Entity Type</label>
                  <select className="form-select"
                      value={newRole.entityType}
                      onChange={(e) =>setNewRole({ ...newRole, entityType: e.target.value })
                      }
                    >
                      <option value="">Select</option>
                      {entityTypes.map((et) => (
                        <option key={et.code} value={et.code}>
                          {et.name}
                        </option>
                      ))}
                    </select>                    
                  </div>
                </div>

                {/* Modules and Permissions for Create */}
                {newRole.entityType && (
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
                        {filterModulesWithPermissions(createModules).map((module) => (
                          <tr key={module.moduleId}>
                            <td>{module.name}</td>
                            <td>
                              {module.permissions.map((perm) => (
                                <div
                                  className="form-check form-check-inline"
                                  key={perm.code}
                                  style={checkboxContainerStyle}
                                >
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`create-${module.moduleId}-${perm.code}`}
                                    checked={
                                      newRole.modulePermissions[module.moduleId]?.includes(
                                        perm.code
                                      ) || false
                                    }
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        "create",
                                        module.moduleId,
                                        perm.code,
                                        e.target.checked
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor={`create-${module.moduleId}-${perm.code}`}
                                    className="form-check-label"
                                    style={{ marginLeft: "0.25rem" }}
                                  >
                                    {perm.name}
                                  </label>
                                </div>
                              ))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="d-flex justify-content-end">
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
        </div>

        {/* Edit Role Modal */}
        <div className="modal fade" id="editRoleModal" tabIndex="-1">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="modal-title">Edit Role</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                {editRole ? (
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
                          required
                          aria-required="true"
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
                          required
                          aria-required="true"
                        >
                          <option value="">Select</option>
                          {entityTypes.map((et) => (
                            <option key={et.code} value={et.code}>
                              {et.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* Modules and Permissions for Edit */}
                    {editRole.entityType && (
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
                            {filterModulesWithPermissions(editModules).map((module) => (
                              <tr key={module.moduleId}>
                                <td>{module.name}</td>
                                <td>
                                  {module.permissions.map((perm) => (
                                    <div
                                      className="form-check form-check-inline"
                                      key={perm.code}
                                      style={checkboxContainerStyle}
                                    >
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={`edit-${module.moduleId}-${perm.code}`}
                                        checked={
                                          editRole.modulePermissions[module.moduleId]?.includes(
                                            perm.code
                                          ) || false
                                        }
                                        onChange={(e) =>
                                          handleCheckboxChange(
                                            "edit",
                                            module.moduleId,
                                            perm.code,
                                            e.target.checked
                                          )
                                        }
                                      />
                                      <label
                                        htmlFor={`edit-${module.moduleId}-${perm.code}`}
                                        className="form-check-label"
                                        style={{ marginLeft: "0.25rem" }}
                                      >
                                        {perm.name}
                                      </label>
                                    </div>
                                  ))}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <div className="d-flex justify-content-end">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        data-bs-dismiss="modal"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* View Role Modal */}
        <div className="modal fade" id="viewRoleModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="modal-title">Role Details</h6>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {selectedRole && (
                  <>
                    <p><strong>Role Name:</strong> {selectedRole.roleName}</p>
                    <p><strong>Entity Type:</strong> {selectedRole.entityType?.name || selectedRole.entityType}</p>
                    <p><strong>Modules and Permissions:</strong></p>
                    <ul>
                      {selectedRole.roleModulePermissions
                        .filter((mod) => mod.rolePermissions && mod.rolePermissions.length > 0)
                        .map((mod) => (
                          <li key={mod.moduleId}>
                            <strong>{mod.name}</strong>:{" "}
                            {mod.rolePermissions
                              .filter((p) => p.assigned)
                              .map((p) => p.name)
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