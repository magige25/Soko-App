import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner } from "../hook/spinner-utils";
import { formatDate } from "../hook/format-utils";

const API_URL = "https://api.bizchain.co.ke/v1/sub-regions";

const SubRegionsLayer = () => {
  const navigate = useNavigate();
  const [subRegions, setSubRegions] = useState([]);
  const [filteredSubRegions, setFilteredSubRegions] = useState([]);
  const [subRegionToDelete, setSubRegionToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSubRegions();
  }, []);

  const fetchSubRegions = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const mappedSubRegions = response.data.data.map((subRegion) => ({
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
      const token = sessionStorage.getItem("token");
      await axios.delete(`${API_URL}/${subRegionToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubRegions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubRegions.length / itemsPerPage);
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
              placeholder="Search name, region, or numbers"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
        </div>
        <button
          type="button"
          className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
          onClick={() => navigate("/sub-regions/add")}
        >
          <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
          Add Sub-Region
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
                <th scope="col" className="text-start py-3 px-4">Region</th>
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
                                to={`/sub-regions/${subRegion.id}`}
                                state={{ subRegion }}
                              >
                                <Icon icon="ri-eye-line" />
                                View
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item"
                                to={`/sub-regions/edit/${subRegion.id}`}
                                state={{ subRegionId: subRegion.id }}
                              >
                                <Icon icon="ri-edit-line" />
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
                  <td colSpan="7" className="text-center py-3">
                    No sub-regions found
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
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredSubRegions.length)} of{" "}
                {filteredSubRegions.length} entries
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
                Are you sure you want to delete the <strong>{subRegionToDelete?.name}</strong> sub-region
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

export default SubRegionsLayer;