import React, { useState, useEffect, useCallback, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";

const ROLES_API_URL = "https://api.bizchain.co.ke/v1/roles";
const MODULES_API_URL = "https://api.bizchain.co.ke/v1/module-permission";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

const RolesLayer = () => {
  const [roles, setRoles] = useState([]);
  const [entityTypes, setEntityTypes] = useState([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newRole, setNewRole] = useState({ name: "", entityType: "", modulePermissions: {} });
  const [createModules, setCreateModules] = useState([]);
  const [editRole, setEditRole] = useState(null);
  const [editModules, setEditModules] = useState([]);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const addModalRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300);

  const fetchRoles = useCallback(
    async (page = 1, searchQuery = "") => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(ROLES_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, limit: itemsPerPage, searchValue: searchQuery },
        });
        const data = response.data.data || [];
        const total = response.data.totalElements || data.length;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = Math.min(page * itemsPerPage, total);
        const paginatedData = data.slice(startIndex, endIndex);

        setRoles(paginatedData);
        setTotalItems(total);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setError("Failed to fetch roles. Please try again.");
        setRoles([]);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage]
  );

  useEffect(() => {
    fetchRoles(currentPage, debouncedQuery);
  }, [currentPage, debouncedQuery, fetchRoles]);

  useEffect(() => {
    const fetchEntityTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://api.bizchain.co.ke/v1/entity-types", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEntityTypes(response.data.data);
      } catch (error) {
        console.error("Error fetching entity types:", error);
      }
    };
    fetchEntityTypes();
  }, []);

  useEffect(() => {
    const fetchModules = async () => {
      if (!newRole.entityType) {
        setCreateModules([]);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${MODULES_API_URL}?entityType=${newRole.entityType}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const processedModules = response.data.data.map((module) => ({
          ...module,
          rolePermissions: module.rolePermissions || [],
        }));
        setCreateModules(processedModules);
      } catch (error) {
        console.error("Error fetching modules for create:", error);
        setCreateModules([]);
      }
    };
    fetchModules();
  }, [newRole.entityType]);

  useEffect(() => {
    const fetchModules = async () => {
      if (!editRole?.entityType) {
        setEditModules([]);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${MODULES_API_URL}?entityType=${editRole.entityType}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const processedModules = response.data.data.map((module) => ({
          ...module,
          rolePermissions: module.rolePermissions || [],
        }));
        setEditModules(processedModules);
      } catch (error) {
        console.error("Error fetching modules for edit:", error);
        setEditModules([]);
      }
    };
    fetchModules();
  }, [editRole?.entityType]);

  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getFullYear();
    const suffix = (day % 10 === 1 && day !== 11) ? "st" :
                   (day % 10 === 2 && day !== 12) ? "nd" :
                   (day % 10 === 3 && day !== 13) ? "rd" : "th";
    return `${day}${suffix} ${month} ${year}`;
  };

  const buildModulePermissionsPayload = (modulesState) => {
    return Object.entries(modulesState)
      .filter(([_, perms]) => perms && perms.length > 0)
      .map(([moduleId, perms]) => ({
        moduleId: Number(moduleId),
        permissions: perms,
      }));
  };

  const handleCreateRole = async () => {
    const payload = {
      name: newRole.name,
      entityType: newRole.entityType,
      modulePermissions: buildModulePermissionsPayload(newRole.modulePermissions),
    };
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(ROLES_API_URL, payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      setRoles([...roles, response.data.data]);
      resetCreateForm();
      addModalRef.current?.querySelector(".btn-close")?.click();
    } catch (error) {
      console.error("Error creating role:", error);
      setError("Failed to create role.");
    }
  };

  const resetCreateForm = () => {
    setNewRole({ name: "", entityType: "", modulePermissions: {} });
    setCreateModules([]);
  };

  const handleEditRoleSubmit = async (e) => {
    e.preventDefault();
    if (!editRole) return;
    const payload = {
      name: editRole.name,
      entityType: editRole.entityType,
      modulePermissions: buildModulePermissionsPayload(editRole.modulePermissions),
    };
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${ROLES_API_URL}/${editRole.roleId}`, payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      fetchRoles(currentPage, debouncedQuery);
      setEditRole(null);
      setEditModules([]);
    } catch (error) {
      console.error("Error updating role:", error);
      setError("Failed to update role.");
    }
  };

  const openEditModal = (role) => {
    const modulePermissions = {};
    role.roleModulePermissions.forEach((mod) => {
      const assigned = mod.rolePermissions.filter((perm) => perm.assigned).map((perm) => perm.code);
      modulePermissions[mod.moduleId] = assigned;
    });
    setEditRole({
      roleId: role.roleId,
      name: role.roleName,
      entityType: role.entityType.code,
      modulePermissions,
    });
  };

  const handleDeleteClick = (role) => {
    setRoleToDelete(role);
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${ROLES_API_URL}/${roleToDelete.roleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoleToDelete(null);
      fetchRoles(currentPage, debouncedQuery);
    } catch (error) {
      console.error("Error deleting role:", error);
      setError(error.response?.data?.message || "Failed to delete role.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
    setCurrentPage(1);
  };

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

  const filterModulesWithPermissions = (modules) => {
    return modules.filter((module) => module.permissions && module.permissions.length > 0);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
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
              placeholder="Search Role Name"
              value={query}
              onChange={handleSearchInputChange}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
        </div>
        <button
          className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
          data-bs-toggle="modal"
          data-bs-target="#createRoleModal"
        >
          <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
          Add New Role
        </button>
      </div>

      <div className="card-body p-24">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="table-responsive scroll-sm">
          <table className="table table-borderless sm-table mb-0">
            <thead>
              <tr>
                <th scope="col" className="text-center py-3 px-6">#</th>
                <th scope="col" className="text-start py-3 px-4">Role Name</th>
                <th scope="col" className="text-start py-3 px-4">Date Created</th>
                <th scope="col" className="text-start py-3 px-4">Entity Type</th>
                <th scope="col" className="text-start py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-3">
                    <div>
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : roles.length > 0 ? (
                roles.map((role, index) => (
                  <tr key={role.roleId} style={{ transition: "background-color 0.2s" }}>
                    <td className="text-center small-text py-3 px-6">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="text-start small-text py-3 px-4">{role.roleName}</td>
                    <td className="text-start small-text py-3 px-4">{formatDate(role.dateCreated)}</td>
                    <td className="text-start small-text py-3 px-4">{role.entityType?.name || "N/A"}</td>
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
                                onClick={() => handleDeleteClick(role)}
                                data-bs-toggle="modal"
                                data-bs-target="#deleteRoleModal"
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
                  <td colSpan="5" className="text-center py-3">
                    No roles found
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
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
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

      {/* Create Role Modal */}
      <div className="modal fade" id="createRoleModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content" ref={addModalRef}>
            <div className="modal-body pt-3 ps-18 pe-18">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="modal-title fs-6">Add Role</h6>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  onClick={resetCreateForm}
                ></button>
              </div>
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
                  <select
                    className="form-select"
                    value={newRole.entityType}
                    onChange={(e) => setNewRole({ ...newRole, entityType: e.target.value })}
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
                              <div className="form-check form-check-inline" key={perm.code}>
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`create-${module.moduleId}-${perm.code}`}
                                  checked={
                                    newRole.modulePermissions[module.moduleId]?.includes(perm.code) || false
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
            </div>
            <div className="d-flex justify-content-end gap-2 px-12 pb-3">
              <button type="button" className="btn btn-primary" onClick={handleCreateRole} data-bs-dismiss="modal">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Role Modal */}
      <div className="modal fade" id="editRoleModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body pt-3 ps-18 pe-18">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="modal-title fs-6">Edit Role</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              {editRole ? (
                <form onSubmit={handleEditRoleSubmit}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Role Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editRole.name}
                        onChange={(e) => setEditRole({ ...editRole, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Entity Type</label>
                      <select
                        className="form-select"
                        value={editRole.entityType}
                        onChange={(e) => setEditRole({ ...editRole, entityType: e.target.value })}
                        required
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
                                  <div className="form-check form-check-inline" key={perm.code}>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id={`edit-${module.moduleId}-${perm.code}`}
                                      checked={
                                        editRole.modulePermissions[module.moduleId]?.includes(perm.code) || false
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
                  <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                      Save
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
            <div className="modal-body pt-3 ps-18 pe-18">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="modal-title fs-6">Role Details</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              {selectedRole && (
                <>
                  <p>
                    <strong>Role Name:</strong> {selectedRole.roleName}
                  </p>
                  <p>
                    <strong>Entity Type:</strong> {selectedRole.entityType?.name || selectedRole.entityType}
                  </p>
                  <p>
                    <strong>Modules and Permissions:</strong>
                  </p>
                  <ul>
                    {selectedRole.roleModulePermissions
                      .filter((mod) => mod.rolePermissions && mod.rolePermissions.length > 0)
                      .map((mod) => (
                        <li key={mod.moduleId}>
                          <strong>{mod.name}</strong>:{" "}
                          {mod.rolePermissions.filter((p) => p.assigned).map((p) => p.name).join(", ")}
                        </li>
                      ))}
                  </ul>
                </>
              )}
            </div>
            <div className="d-flex justify-content-end gap-2 px-12 pb-3">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Role Modal */}
      <div className="modal fade" id="deleteRoleModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body pt-3 ps-18 pe-18">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="modal-title fs-6">Delete Role</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <p className="pb-3 mb-0">
                Are you sure you want to delete the <strong>{roleToDelete?.roleName}</strong> role
                permanently? This action cannot be undone.
              </p>
            </div>
            <div className="d-flex justify-content-end gap-2 px-12 pb-3">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesLayer;