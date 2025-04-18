import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Spinner } from "../hook/spinner-utils";
import { formatDate } from "../hook/format-utils";

const API_URL = "https://api.bizchain.co.ke/v1/routes";
const SUBREGIONS_API_URL = "https://api.bizchain.co.ke/v1/sub-regions";

const RoutesLayer = () => {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [newRoute, setNewRoute] = useState({ name: "", subRegionId: "", regionId: "" });
  const [editRoute, setEditRoute] = useState({
    id: null,
    name: "",
    subRegionId: "",
    regionId: "",
    subRegion: "",
    region: "",
  });
  const [routeToDelete, setRouteToDelete] = useState(null);
  const [subRegions, setSubRegions] = useState([]);
  const [showSubRegionDropdown, setShowSubRegionDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRoutes();
    fetchSubRegions();
  }, []); 

  useEffect(() => {
    const addModal = document.getElementById("addRouteModal");
    const editModal = document.getElementById("editRouteModal");
    const resetAddForm = () => !isLoading && setNewRoute({ name: "", subRegionId: "", regionId: "" });
    const resetEditForm = () =>
      !isLoading &&
      setEditRoute({
        id: null,
        name: "",
        subRegionId: "",
        regionId: "",
        subRegion: "",
        region: "",
      });

    addModal?.addEventListener("hidden.bs.modal", resetAddForm);
    editModal?.addEventListener("hidden.bs.modal", resetEditForm);

    return () => {
      addModal?.removeEventListener("hidden.bs.modal", resetAddForm);
      editModal?.removeEventListener("hidden.bs.modal", resetEditForm);
    };
  }, [isLoading]); 

  const fetchRoutes = async () => {
    setIsLoading(true); 
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const mappedRoutes = response.data.data.map((route) => ({
        id: route.id,
        name: route.name,
        subRegion: route.subRegion?.name || "Unknown",
        subRegionId: route.subRegion?.id,
        region: route.region?.name || "Unknown",
        regionId: route.region?.id,
        customers: route.numberCustomer || 0,
        salesPersons: route.numberSalesPerson || 0,
        dateCreated: route.dateCreated,
        createdBy: route.createdBy?.name || "Unknown",
      }));
      setRoutes(mappedRoutes);
      setFilteredRoutes(mappedRoutes);
      setError(null);
    } catch (error) {
      console.error("Error fetching routes:", error);
      setError("Failed to fetch routes. Please try again.");
    } finally {
      setIsLoading(false); 
    }
  };

  const fetchSubRegions = async () => {
    setIsLoading(true); 
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(SUBREGIONS_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubRegions(response.data.data || []);
    } catch (error) {
      console.error("Error fetching sub-regions:", error);
      setError("Failed to fetch sub-regions. Please try again.");
    } finally {
      setIsLoading(false); 
    }
  };

  const handleAddRoute = async (e) => {
    e.preventDefault();
    if (!newRoute.name.trim() || !newRoute.subRegionId) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      setIsLoading(true); 
      setError(null);
      const token = sessionStorage.getItem("token");
      const payload = {
        name: newRoute.name,
        subRegion: newRoute.subRegionId,
      };
      console.log("Sending payload (Add):", payload);
      const response = await axios.post(API_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("API Response (Add):", response.data);
      await fetchRoutes();
      setNewRoute({ name: "", subRegionId: "", regionId: "" });
      document.getElementById("addRouteModal").classList.remove("show");
      document.body.classList.remove("modal-open");
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) backdrop.remove();
    } catch (error) {
      console.error("Error adding route:", error);
      console.log("Response data:", error.response?.data);
      setError(error.response?.data?.message || "Failed to add route.");
    } finally {
      setIsLoading(false); 
    }
  };

  const handleEditClick = (route) => {
    setEditRoute({
      id: route.id,
      name: route.name,
      subRegionId: route.subRegionId,
      regionId: route.regionId,
      subRegion: route.subRegion,
      region: route.region,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editRoute.name.trim() || !editRoute.subRegionId) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      setIsLoading(true); 
      setError(null);
      const token = sessionStorage.getItem("token");
      const payload = {
        name: editRoute.name,
        subRegion: editRoute.subRegionId,
      };
      console.log("Sending payload (Edit):", payload);
      const response = await axios.put(`${API_URL}/${editRoute.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response (Edit):", response.data);
      await fetchRoutes();
      setEditRoute({
        id: null,
        name: "",
        subRegionId: "",
        regionId: "",
        subRegion: "",
        region: "",
      });
      document.getElementById("editRouteModal").classList.remove("show");
      document.body.classList.remove("modal-open");
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) backdrop.remove();
    } catch (error) {
      console.error("Error updating route:", error);
      console.log("Response data:", error.response?.data);
      setError(error.response?.data?.message || "Failed to update route.");
    } finally {
      setIsLoading(false); 
    }
  };

  const handleDeleteClick = (route) => {
    setRouteToDelete(route);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsLoading(true); 
      const token = sessionStorage.getItem("token");
      await axios.delete(`${API_URL}/${routeToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchRoutes();
      setRouteToDelete(null);
    } catch (error) {
      console.error("Error deleting route:", error);
      console.log("Response data:", error.response?.data);
      setError(error.response?.data?.message || "Failed to delete route.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterRoutes(searchQuery);
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterRoutes(query);
  };

  const filterRoutes = (query) => {
    const lowerQuery = query.toLowerCase();
    const filtered = routes.filter(
      (route) =>
        route.name.toLowerCase().includes(lowerQuery) ||
        route.subRegion.toLowerCase().includes(lowerQuery) ||
        route.region.toLowerCase().includes(lowerQuery) ||
        String(route.customers).includes(lowerQuery) ||
        String(route.salesAgents).includes(lowerQuery)
    );
    setFilteredRoutes(filtered);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRoutes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRoutes.length / itemsPerPage);
  const historicPage = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <form className="navbar-search" onSubmit={handleSearch}>
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              name="search"
              placeholder="Search name, sub-region, region, or numbers"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
        </div>
        <button
          type="button"
          className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
          data-bs-toggle="modal"
          data-bs-target="#addRouteModal"
        >
          <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
          Add Route
        </button>
      </div>

      <div className="card-body-table p-24">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="table-responsive scroll-sm">
          <table className="table table-borderless sm-table mb-0">
            <thead>
              <tr>
                <th scope="col" className="text-center py-3 px-6">ID</th>
                <th scope="col" className="text-start py-3 px-4">Name</th>
                <th scope="col" className="text-start py-3 px-4">Sub-Region</th>
                <th scope="col" className="text-start py-3 px-4">Region</th>
                <th scope="col" className="text-start py-3 px-4">Customers</th>
                <th scope="col" className="text-start py-3 px-4">Sales Persons</th>
                <th scope="col" className="text-start py-3 px-4">Date Created</th>
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
              ) : currentItems.length > 0 ? (
                currentItems.map((route) => (
                  <tr key={route.id} style={{ transition: "background-color 0.2s" }}>
                    <td className="text-center small-text py-3 px-6">
                      {indexOfFirstItem + currentItems.indexOf(route) + 1}
                    </td>
                    <td className="text-start small-text py-3 px-4">{route.name} road</td>
                    <td className="text-start small-text py-3 px-4">{route.subRegion}</td>
                    <td className="text-start small-text py-3 px-4">{route.region}</td>
                    <td className="text-start small-text py-3 px-4">{route.customers}</td>
                    <td className="text-start small-text py-3 px-4">{route.salesPersons}</td>
                    <td className="text-start small-text py-3 px-4">
                      {route.dateCreated ? formatDate(route.dateCreated) : ""}
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
                                to={`/routes/${route.id}`}
                                state={{ route }}
                              >
                                <Icon icon="ri-eye-line" />
                                View
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item"
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#editRouteModal"
                                onClick={() => handleEditClick(route)}
                              >
                                <Icon icon="ri-edit-line" />
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(route)}
                                data-bs-toggle="modal"
                                data-bs-target="#deleteRouteModal"
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
                    No routes found
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
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRoutes.length)} of{" "}
                {filteredRoutes.length} entries
              </span>
            </div>
            <nav aria-label="Page navigation">
              <ul className="pagination mb-0" style={{ gap: "6px" }}>
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "24px", height: "24px", padding: "0", transition: "all 0.2s" }}
                    onClick={() => historicPage(currentPage - 1)}
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
                      onClick={() => historicPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "24px", height: "24px", padding: "0", transition: "all 0.2s" }}
                    onClick={() => historicPage(currentPage + 1)}
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

      {/* Add Route Modal */}
      <div className="modal fade" id="addRouteModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                Add Route
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </h6>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleAddRoute}>
                <div className="mb-3">
                  <label className="form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Route Name"
                    value={newRoute.name}
                    onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Sub-Region <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <div
                      className="form-control d-flex justify-content-between align-items-center"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowSubRegionDropdown(!showSubRegionDropdown)}
                    >
                      <span>
                        {newRoute.subRegionId
                          ? subRegions.find((sr) => sr.id === newRoute.subRegionId)?.name
                          : "Select Sub-Region"}
                      </span>
                      <i className="dropdown-toggle ms-2" />
                    </div>
                    {showSubRegionDropdown && (
                      <ul
                        className="dropdown-menu w-100 show"
                        style={{ position: "absolute", top: "100%", left: 0, zIndex: 1000 }}
                      >
                        {subRegions.map((subRegion) => (
                          <li key={subRegion.id}>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => {
                                setNewRoute({ ...newRoute, subRegionId: subRegion.id });
                                setShowSubRegionDropdown(false);
                              }}
                            >
                              {subRegion.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="text-muted small mt-3">
                  Fields marked with <span className="text-danger">*</span> are required.
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Route Modal */}
      <div className="modal fade" id="editRouteModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                Edit Route
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </h6>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleEditSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Route Name"
                    value={editRoute.name}
                    onChange={(e) => setEditRoute({ ...editRoute, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Sub-Region <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <div
                      className="form-control d-flex justify-content-between align-items-center"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowSubRegionDropdown(!showSubRegionDropdown)}
                    >
                      <span>
                        {editRoute.subRegionId
                          ? subRegions.find((sr) => sr.id === editRoute.subRegionId)?.name
                          : "Select Sub-Region"}
                      </span>
                      <i className="dropdown-toggle ms-2" />
                    </div>
                    {showSubRegionDropdown && (
                      <ul
                        className="dropdown-menu w-100 show"
                        style={{ position: "absolute", top: "100%", left: 0, zIndex: 1000 }}
                      >
                        {subRegions.map((subRegion) => (
                          <li key={subRegion.id}>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => {
                                setEditRoute({
                                  ...editRoute,
                                  subRegionId: subRegion.id,
                                  subRegion: subRegion.name,
                                });
                                setShowSubRegionDropdown(false);
                              }}
                            >
                              {subRegion.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="text-muted small mt-3">
                  Fields marked with <span className="text-danger">*</span> are required.
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div className="modal fade" id="deleteRouteModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body pt-3 ps-18 pe-18">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="modal-title fs-6">Delete Route</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <p className="pb-3 mb-0">
                Are you sure you want to delete the <strong>{routeToDelete?.name}</strong> route permanently?
                This action cannot be undone.
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
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutesLayer;