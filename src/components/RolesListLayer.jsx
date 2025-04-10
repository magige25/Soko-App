import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import { Spinner } from "../hook/spinner-utils";
import { formatDate } from "../hook/format-utils";
import { useNavigate, Link } from "react-router-dom";

const ROLES_API_URL = "https://api.bizchain.co.ke/v1/roles";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

const RolesLayer = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const debouncedQuery = useDebounce(query, 300);

  const fetchRoles = useCallback(
    async (page = 1, searchQuery = "") => {
      setIsLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem("token");
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

  const handleDeleteClick = (role) => {
    setRoleToDelete(role);
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("token");
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
          className="btn btn-primary text-sm btn-sm px-10 py-10 radius-4 d-flex align-items-center gap-2"
          onClick={() => navigate("/roles/add-role")}
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
                    <Spinner />
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
                              <Link
                                className="dropdown-item"
                                to="/roles/edit-role"
                                state={{ role }}
                              >
                                Edit
                              </Link>
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