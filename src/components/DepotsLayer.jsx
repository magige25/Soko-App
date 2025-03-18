import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import {Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { formatDate } from "../hook/format-utils";

const API_URL = "https://api.bizchain.co.ke/v1/depots";
const REGION_API = "https://api.bizchain.co.ke/v1/regions";
const SUB_REGION_API = "https://api.bizchain.co.ke/v1/sub-regions";

const DepotsLayer = () => {
  const [depots, setDepots] = useState([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [regions, setRegions] = useState([]);
  const [subRegions, setSubRegions] = useState([]);
  const [depotToDelete, setDepotToDelete] = useState(null); // Added back

  // Fetch depots
  const fetchDepots = useCallback(
    async (page = 1, searchQuery = "") => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const params = { page: page - 1, size: itemsPerPage, searchValue: searchQuery };
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });
        const data = response.data.data || [];
        const total = response.data.totalElements || data.length;
        setDepots(data);
        setTotalItems(total);
      } catch (error) {
        console.error("Error fetching depots:", error);
        setError("Failed to fetch depots.");
        toast.error("Failed to fetch depots.");
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage]
  );

  // Fetch regions
  const fetchRegions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(REGION_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegions(response.data.data || []);
    } catch (error) {
      console.error("Error fetching regions:", error);
      toast.error("Failed to fetch regions.");
    }
  };

  // Fetch sub-regions
  const fetchSubRegions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(SUB_REGION_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const subRegionsData = (response.data.data || []).map((subRegion) => ({
        ...subRegion,
        regionId: subRegion.region.id,
      }));
      setSubRegions(subRegionsData);
    } catch (error) {
      console.error("Error fetching sub-regions:", error);
      toast.error("Failed to fetch sub-regions.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchRegions(), fetchSubRegions()]);
      fetchDepots(currentPage, query);
    };
    loadData();
  }, [currentPage, query, fetchDepots]);

  const handleSearchInputChange = (e) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteClick = (depot) => {
    setDepotToDelete(depot);
  };

  const handleDeleteConfirm = async () => {
    if (!depotToDelete) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${depotToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepotToDelete(null);
      fetchDepots(currentPage, query);
      toast.success("Depot deleted successfully!");
    } catch (error) {
      console.error("Error deleting depot:", error);
      toast.error("Failed to delete depot.");
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="card h-100 p-0 radius-12">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          success: { style: { background: "#d4edda", color: "#155724" } },
          error: { style: { background: "#f8d7da", color: "#721c24" } },
        }}
      />
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <form className="navbar-search">
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              name="search"
              placeholder="Search Depot"
              value={query}
              onChange={handleSearchInputChange}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
        </div>
        <Link
          to="/depots/add"
          className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
        >
          <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
          Add Depot
        </Link>
      </div>

      <div className="card-body p-24">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="table-responsive scroll-sm">
          <table className="table table-borderless sm-table mb-0">
            <thead>
              <tr>
                <th scope="col" className="text-center py-3 px-6">#</th>
                <th scope="col" className="text-start py-3 px-4">Name</th>
                <th scope="col" className="text-start py-3 px-4">Region</th>
                <th scope="col" className="text-start py-3 px-4">Sub-Region</th>
                <th scope="col" className="text-start py-3 px-4">Date Created</th>
                <th scope="col" className="text-start py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-3">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : depots.length > 0 ? (
                depots.map((depot, index) => (
                  <tr key={depot.id} style={{ transition: "background-color 0.2s" }}>
                    <td className="text-center small-text py-3 px-6">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="text-start small-text py-3 px-4">{depot.name}</td>
                    <td className="text-start small-text py-3 px-4">
                      {depot.region.name || "N/A"}
                    </td> 
                    {/* regions.find((r) => r.id === depot.regionId)?.name */}
                    <td className="text-start small-text py-3 px-4">
                      {depot.subRegion.name || "N/A"}
                    </td>
                    {/* subRegions.find((sr) => sr.id === depot.subRegionId)?.name */}
                    <td className="text-start small-text py-3 px-4">{formatDate(depot.dateCreated)}</td>
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
                              <Link className="dropdown-item" to={`/depots/view/${depot.id}`}>
                                View Details
                              </Link>
                            </li>
                            <li>
                              <Link className="dropdown-item" to={`/depots/edit/${depot.id}`}>
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(depot)}
                                data-bs-toggle="modal"
                                data-bs-target="#deleteModal"
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
                  <td colSpan="6" className="text-center py-3">No depots found</td>
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

      {/* Delete Modal */}
      <div className="modal fade" id="deleteModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body pt-3 ps-18 pe-18">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="modal-title fs-6">Delete Depot</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <p className="pb-3 mb-0">
                Are you sure you want to delete the depot <strong>{depotToDelete?.name}</strong>{" "}
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

export default DepotsLayer;