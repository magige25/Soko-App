import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Spinner } from "../hook/spinner-utils";

const API_URL = "https://api.bizchain.co.ke/v1/regions";
const COUNTRIES_API_URL = "https://api.bizchain.co.ke/v1/countries";

const RegionsLayer = () => {
  const [regions, setRegions] = useState([]);
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [newRegion, setNewRegion] = useState({ name: "", countryCode: "" });
  const [editRegion, setEditRegion] = useState({ id: null, name: "", countryCode: "", country: "" });
  const [regionToDelete, setRegionToDelete] = useState(null);
  const [countries, setCountries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRegions();
    fetchCountries();
  }, []); 
  
  useEffect(() => {
    const addModal = document.getElementById("addRegionModal");
    const editModal = document.getElementById("editRegionModal");
    const resetAddForm = () => !isLoading && setNewRegion({ name: "", countryCode: "" });
    const resetEditForm = () => !isLoading && setEditRegion({ id: null, name: "", countryCode: "", country: "" });

    addModal?.addEventListener("hidden.bs.modal", resetAddForm);
    editModal?.addEventListener("hidden.bs.modal", resetEditForm);

    return () => {
      addModal?.removeEventListener("hidden.bs.modal", resetAddForm);
      editModal?.removeEventListener("hidden.bs.modal", resetEditForm);
    };
  }, [isLoading]);

  const fetchRegions = async () => {
    setIsLoading(true); 
    
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const mappedRegions = response.data.data.map((region) => ({
        id: region.id,
        name: region.name,
        country: region.country.name,
        countryCode: region.country.code,
        customers: region.numberCustomer || 0,
        salesAgents: region.numberSalesPerson || 0,
        subRegions: region.numberSubRegion || 0,
        dateCreated: region.dateCreated,
        createdBy: region.createdBy?.name || "Unknown",
      }));
      setRegions(mappedRegions);
      setFilteredRegions(mappedRegions);
      setError(null);
    } catch (error) {
      console.error("Error fetching regions:", error);
      setError("Failed to fetch regions. Please try again.");
    } finally {
      setIsLoading(false); 
    }
  };

  const fetchCountries = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(COUNTRIES_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCountries(response.data.data || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
      setError("Failed to fetch countries. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRegion = async (e) => {
    e.preventDefault();
    if (!newRegion.name.trim() || !newRegion.countryCode.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const token = sessionStorage.getItem("token");
      const payload = {
        name: newRegion.name,
        countryCode: newRegion.countryCode,
      };
      console.log("Sending payload (Add):", payload);
      const response = await axios.post(API_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("API Response (Add):", response.data);
      await fetchRegions();
      setNewRegion({ name: "", countryCode: "" });
      document.getElementById("addRegionModal").classList.remove("show");
      document.body.classList.remove("modal-open");
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) backdrop.remove();
    } catch (error) {
      console.error("Error adding region:", error);
      setError(
        error.response?.status === 403
          ? "Permission denied. Please check your authentication."
          : error.response?.data?.message || "Failed to add region."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (region) => {
    setEditRegion({
      id: region.id,
      name: region.name,
      countryCode: region.countryCode,
      country: region.country,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editRegion.name.trim() || !editRegion.countryCode.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const token = sessionStorage.getItem("token");
      const payload = {
        name: editRegion.name,
        countryCode: editRegion.countryCode,
      };
      console.log("Sending payload (Edit):", payload);
      const response = await axios.put(`${API_URL}/${editRegion.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response (Edit):", response.data);
      await fetchRegions();
      setEditRegion({ id: null, name: "", countryCode: "", country: "" });
      document.getElementById("editRegionModal").classList.remove("show");
      document.body.classList.remove("modal-open");
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) backdrop.remove();
    } catch (error) {
      console.error("Error updating region:", error);
      setError(error.response?.data?.message || "Failed to update region.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (region) => {
    setRegionToDelete(region);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");
      await axios.delete(`${API_URL}/${regionToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchRegions();
      setRegionToDelete(null);
    } catch (error) {
      console.error("Error deleting region:", error);
      setError(error.response?.data?.message || "Failed to delete region.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterRegions(searchQuery);
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterRegions(query);
  };

  const filterRegions = (query) => {
    const lowerQuery = query.toLowerCase();
    const filtered = regions.filter(
      (region) =>
        region.name.toLowerCase().includes(lowerQuery) ||
        region.country.toLowerCase().includes(lowerQuery) ||
        String(region.customers).includes(lowerQuery) ||
        String(region.salesAgents).includes(lowerQuery)
    );
    setFilteredRegions(filtered);
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
  const currentItems = filteredRegions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRegions.length / itemsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <form className="navbar-search" onSubmit={handleSearch}>
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              name="search"
              placeholder="Search by name, country, or numbers"
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
          data-bs-target="#addRegionModal"
        >
          <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
          Add Region
        </button>
      </div>

      <div className="card-body p-24">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="table-responsive scroll-sm">
          <table className="table table-borderless sm-table mb-0">
            <thead>
              <tr>
                <th scope="col" className="text-center py-3 px-6">#</th>
                <th scope="col" className="text-start py-3 px-4">Name</th>
                <th scope="col" className="text-start py-3 px-4">Country</th>
                <th scope="col" className="text-start py-3 px-4">Customers</th>
                <th scope="col" className="text-start py-3 px-4">Sales Agents</th>
                <th scope="col" className="text-start py-3 px-4">Date Created</th>
                <th scope="col" className="text-start py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-3">
                    <Spinner />
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((region) => (
                  <tr key={region.id} style={{ transition: "background-color 0.2s" }}>
                    <td className="text-center small-text py-3 px-6">
                      {indexOfFirstItem + currentItems.indexOf(region) + 1}
                    </td>
                    <td className="text-start small-text py-3 px-4">{region.name}</td>
                    <td className="text-start small-text py-3 px-4">{region.country}</td>
                    <td className="text-start small-text py-3 px-4">{region.customers}</td>
                    <td className="text-start small-text py-3 px-4">{region.salesAgents}</td>
                    <td className="text-start small-text py-3 px-4">
                      {region.dateCreated ? formatDate(region.dateCreated) : ""}
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
                                to="/regions/details"
                                state={{ regionId: region.id }}
                              >
                                View
                              </Link>
                            </li>    
                            <li>
                              <Link
                                className="dropdown-item"
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#editRegionModal"
                                onClick={() => handleEditClick(region)}
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(region)}
                                data-bs-toggle="modal"
                                data-bs-target="#deleteRegionModal"
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
                  <td colSpan="7" className="text-center py-3">
                    No regions found
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
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRegions.length)} of{" "}
                {filteredRegions.length} entries
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

      {/* Add Region Modal */}
      <div className="modal fade" id="addRegionModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                Add Region
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </h6>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleAddRegion}>
                <div className="mb-3">
                  <label className="form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Region Name"
                    value={newRegion.name}
                    onChange={(e) => setNewRegion({ ...newRegion, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light mb-2">
                    Country <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control rounded-lg form-select pr-4 bg-white"
                    value={newRegion.countryCode || ""}
                    onChange={(e) => setNewRegion({ ...newRegion, countryCode: e.target.value })}
                  >
                    <option value="" disabled>
                      Select Country
                    </option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
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

      {/* Edit Region Modal */}
      <div className="modal fade" id="editRegionModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                Edit Region
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
                    placeholder="Enter Region Name"
                    value={editRegion.name}
                    onChange={(e) => setEditRegion({ ...editRegion, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light mb-2">
                    Country <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control rounded-lg form-select pr-4 bg-white"
                    value={editRegion.countryCode || ""}
                    onChange={(e) =>
                      setEditRegion({
                        ...editRegion,
                        countryCode: e.target.value,
                        country: countries.find((c) => c.code === e.target.value)?.name || "",
                      })
                    }
                  >
                    <option value="" disabled>
                      Select Country
                    </option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
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
      <div className="modal fade" id="deleteRegionModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body pt-3 ps-18 pe-18">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="modal-title fs-6">Delete Region</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <p className="pb-3 mb-0">
                Are you sure you want to delete the <strong>{regionToDelete?.name}</strong> region
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
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionsLayer;