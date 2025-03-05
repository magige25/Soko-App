import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "https://api.bizchain.co.ke/v1/sub-regions";
const REGIONS_API_URL = "https://api.bizchain.co.ke/v1/regions";

const SubRegionsLayer = () => {
  const [subRegions, setSubRegions] = useState([]);
  const [filteredSubRegions, setFilteredSubRegions] = useState([]);
  const [newSubRegion, setNewSubRegion] = useState({ name: '', region: '' });
  const [editSubRegion, setEditSubRegion] = useState({ id: null, name: '', region: '', regionName: '' });
  const [subRegionToDelete, setSubRegionToDelete] = useState(null);
  const [regions, setRegions] = useState([]);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSubRegions();
    fetchRegions();

    const addModal = document.getElementById("addSubRegionModal");
    const editModal = document.getElementById("editSubRegionModal");
    const resetAddForm = () => !isLoading && setNewSubRegion({ name: '', region: '' });
    const resetEditForm = () => !isLoading && setEditSubRegion({ id: null, name: '', region: '', regionName: '' });

    addModal?.addEventListener("hidden.bs.modal", resetAddForm);
    editModal?.addEventListener("hidden.bs.modal", resetEditForm);

    return () => {
      addModal?.removeEventListener("hidden.bs.modal", resetAddForm);
      editModal?.removeEventListener("hidden.bs.modal", resetEditForm);
    };
  }, [isLoading]);

  const fetchSubRegions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const mappedSubRegions = response.data.data.map(subRegion => ({
        id: subRegion.id,
        name: subRegion.name,
        regionName: subRegion.region.name,
        region: subRegion.region.id,
        customers: subRegion.numberCustomer || 0,
        salesAgents: subRegion.numberSalesPerson || 0,
        dateCreated: subRegion.dateCreated,
        createdBy: subRegion.createdBy?.name || "Unknown",
      }));
      setSubRegions(mappedSubRegions);
      setFilteredSubRegions(mappedSubRegions);
      setError(null);
    } catch (error) {
      console.error("Error fetching sub-regions:", error);
      setError("Failed to fetch sub-regions. Please try again.");
    }
  };

  const fetchRegions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(REGIONS_API_URL, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      setRegions(response.data.data || []);
    } catch (error) {
      console.error("Error fetching regions:", error);
      setError("Failed to fetch regions. Please try again.");
    }
  };

  const handleAddSubRegion = async (e) => {
    e.preventDefault();
    if (!newSubRegion.name.trim() || !newSubRegion.region) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const payload = {
        name: newSubRegion.name,
        region: newSubRegion.region,
      };
      console.log("Sending payload:", payload);
      const response = await axios.post(API_URL, payload, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("API Response:", response.data);
      await fetchSubRegions();
      setNewSubRegion({ name: '', region: '' }); // Reset form after success
      document.getElementById("addSubRegionModal").classList.remove("show"); // Close modal
      document.body.classList.remove("modal-open");
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) backdrop.remove();
    } catch (error) {
      console.error("Error adding sub-region:", error);
      console.log("Server response data:", error.response?.data);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        JSON.stringify(error.response?.data) ||
        "Failed to add sub-region. Please check the input and try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (subRegion) => {
    setEditSubRegion({
      id: subRegion.id,
      name: subRegion.name,
      region: subRegion.region,
      regionName: subRegion.regionName,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editSubRegion.name.trim() || !editSubRegion.region) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const payload = {
        name: editSubRegion.name,
        region: editSubRegion.region,
      };
      console.log("Sending edit payload:", payload);
      await axios.put(`${API_URL}/${editSubRegion.id}`, payload, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      await fetchSubRegions();
      setEditSubRegion({ id: null, name: '', region: '', regionName: '' }); // Reset form after success
      document.getElementById("editSubRegionModal").classList.remove("show"); // Close modal
      document.body.classList.remove("modal-open");
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) backdrop.remove();
    } catch (error) {
      console.error("Error updating sub-region:", error);
      console.log("Server response data:", error.response?.data);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        JSON.stringify(error.response?.data) ||
        "Failed to update sub-region.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (subRegion) => {
    setSubRegionToDelete(subRegion);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${subRegionToDelete.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      await fetchSubRegions();
      setSubRegionToDelete(null);
    } catch (error) {
      console.error("Error deleting sub-region:", error);
      setError(error.response?.data?.message || "Failed to delete sub-region.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterSubRegions(searchQuery);
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterSubRegions(query);
  };

  const filterSubRegions = (query) => {
    const lowerQuery = query.toLowerCase();
    const filtered = subRegions.filter(
      (subRegion) =>
        subRegion.name.toLowerCase().includes(lowerQuery) ||
        subRegion.regionName.toLowerCase().includes(lowerQuery) ||
        String(subRegion.customers).includes(lowerQuery) ||
        String(subRegion.salesAgents).includes(lowerQuery)
    );
    setFilteredSubRegions(filtered);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getFullYear();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";
    return `${day}${suffix} ${month} ${year}`;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubRegions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubRegions.length / itemsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="page-wrapper">
      <div className="row">
        <div className="d-flex align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="ms-auto">
            <button
              type="button"
              className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
              data-bs-toggle="modal"
              data-bs-target="#addSubRegionModal"
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add Sub-Region
            </button>
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
                  placeholder="Search by name, region, or numbers"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="form-control"
                  style={{ maxWidth: "300px" }}
                />
                <Icon icon="ion:search-outline" className="icon" style={{ width: "16px", height: "16px" }} />
              </form>
            </div>
            <div className="table-responsive" style={{ overflow: "visible" }}>
              <table className="table table-borderless table-hover text-start small-text" style={{ width: "100%", fontSize: "15px" }}>
                <thead className="table-light text-start small-text">
                  <tr>
                    <th className="text-center py-3 px-6" style={{ width: "50px" }}>#</th>
                    <th className="text-start py-3 px-4">Name</th>
                    <th className="text-start py-3 px-4">Region</th>
                    <th className="text-start py-3 px-4">Customers</th>
                    <th className="text-start py-3 px-4">Sales Agents</th>
                    <th className="text-start py-3 px-4" style={{ width: "220px" }}>Date Created</th>
                    <th className="text-start py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: "14px" }}>
                  {currentItems.length > 0 ? (
                    currentItems.map((subRegion) => (
                      <tr key={subRegion.id} style={{ transition: "background-color 0.2s" }}>
                        <td className="text-center small-text py-3 px-6">
                          {indexOfFirstItem + currentItems.indexOf(subRegion) + 1}
                        </td>
                        <td className="text-start small-text py-3 px-4">{subRegion.name}</td>
                        <td className="text-start small-text py-3 px-4">{subRegion.regionName}</td>
                        <td className="text-start small-text py-3 px-4">{subRegion.customers}</td>
                        <td className="text-start small-text py-3 px-4">{subRegion.salesAgents}</td>
                        <td className="text-start small-text py-3 px-4">
                          {subRegion.dateCreated ? formatDate(subRegion.dateCreated) : ""}
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
                                  to={`/sub-regions/${subRegion.id}`}
                                  state={{ subRegion }}
                                >
                                  View
                                </Link>
                              </li>
                              <li>
                                <Link
                                  className="dropdown-item"
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#editSubRegionModal"
                                  onClick={() => handleEditClick(subRegion)}
                                >
                                  Edit
                                </Link>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => handleDeleteClick(subRegion)}
                                  data-bs-toggle="modal"
                                  data-bs-target="#deleteSubRegionModal"
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
                      <td colSpan="7" className="text-center py-3">
                        No sub-regions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted">
                <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredSubRegions.length)} of {filteredSubRegions.length} entries</span>
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

        {/* Add Sub-Region Modal */}
        <div className="modal fade" id="addSubRegionModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Add Sub-Region
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </h6>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleAddSubRegion}>
                  <div className="mb-3">
                    <label className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Sub-Region Name"
                      value={newSubRegion.name}
                      onChange={(e) => setNewSubRegion({ ...newSubRegion, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Region <span className="text-danger">*</span>
                    </label>
                    <div className="position-relative">
                      <div
                        className="form-control d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                      >
                        <span>
                          {newSubRegion.region
                            ? regions.find(r => r.id === newSubRegion.region)?.name
                            : "Select Region"}
                        </span>
                        <i className="dropdown-toggle ms-2" />
                      </div>
                      {showRegionDropdown && (
                        <ul className="dropdown-menu w-100 show" style={{ position: "absolute", top: "100%", left: 0, zIndex: 1000 }}>
                          {regions.map((region) => (
                            <li key={region.id}>
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => {
                                  setNewSubRegion({ ...newSubRegion, region: region.id });
                                  setShowRegionDropdown(false);
                                }}
                              >
                                {region.name}
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
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Sub-Region Modal */}
        <div className="modal fade" id="editSubRegionModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Edit Sub-Region
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
                      placeholder="Enter Sub-Region Name"
                      value={editSubRegion.name}
                      onChange={(e) => setEditSubRegion({ ...editSubRegion, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Region <span className="text-danger">*</span>
                    </label>
                    <div className="position-relative">
                      <div
                        className="form-control d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                      >
                        <span>
                          {editSubRegion.region
                            ? regions.find(r => r.id === editSubRegion.region)?.name
                            : "Select Region"}
                        </span>
                        <i className="dropdown-toggle ms-2" />
                      </div>
                      {showRegionDropdown && (
                        <ul className="dropdown-menu w-100 show" style={{ position: "absolute", top: "100%", left: 0, zIndex: 1000 }}>
                          {regions.map((region) => (
                            <li key={region.id}>
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => {
                                  setEditSubRegion({ ...editSubRegion, region: region.id, regionName: region.name });
                                  setShowRegionDropdown(false);
                                }}
                              >
                                {region.name}
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
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <div className="modal fade" id="deleteSubRegionModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body pt-3 ps-18 pe-18">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="modal-title fs-6">Delete Sub-Region</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <p className="pb-3 mb-0">
                  Are you sure you want to delete the <strong>{subRegionToDelete?.name}</strong> sub-region permanently? This action cannot be undone.
                </p>
              </div>
              <div className="d-flex justify-content-end gap-2 px-12 pb-3">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
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
    </div>
  );
};

export default SubRegionsLayer;