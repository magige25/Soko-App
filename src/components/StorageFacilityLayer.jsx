import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Icon } from '@iconify/react/dist/iconify.js';

const API_URL = "https://api.bizchain.co.ke/v1/storage";

const StorageFacilityLayer = () => {
  const [facilities, setFacilities] = useState([]);
  const [filteredFacilities, setFilteredFacilities] = useState([]);
  const [query, setQuery] = useState('');
  const [facilityToDelete, setFacilityToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/facilities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data.data || [];
      setFacilities(data);
      setFilteredFacilities(data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      setError("Failed to fetch facilities. Please try again.");
      setFacilities([]);
      setFilteredFacilities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (facility) => {
    setFacilityToDelete(facility);
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/facilities/${facilityToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedFacilities = facilities.filter((facility) => facility.id !== facilityToDelete.id);
      setFacilities(updatedFacilities);
      setFilteredFacilities(updatedFacilities);
      setFacilityToDelete(null);
    } catch (error) {
      console.error('Error deleting facility:', error);
      setError(error.response?.data?.message || "Failed to delete facility.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterFacilities(query);
  };

  const handleSearchInputChange = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
    filterFacilities(searchQuery);
  };

  const filterFacilities = (searchQuery) => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = facilities.filter(
      (facility) =>
        facility.name?.toLowerCase().includes(lowerQuery) ||
        facility.location?.toLowerCase().includes(lowerQuery)
    );
    setFilteredFacilities(filtered);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFacilities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFacilities.length / itemsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="page-wrapper">
      <div className="row">
        <div className="d-flex align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="ms-auto">
            <Link
              to="/storage/add-facility"
              className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add New Facility
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
                  placeholder="Search by name or location"
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
                <thead className="table-light text-start small-text" style={{ fontSize: "15px" }}>
                  <tr>
                    <th className="text-center py-3 px-6" style={{ width: "50px" }}>#</th>
                    <th className="text-start py-3 px-4">Name</th>
                    <th className="text-start py-3 px-4">Location</th>
                    <th className="text-start py-3 px-4">Capacity (L)</th>
                    <th className="text-start py-3 px-4">Current Volume (L)</th>
                    <th className="text-start py-3 px-4">Last Refilled</th>
                    <th className="text-start py-3 px-4">Last Drawn</th>
                    <th className="text-start py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: "14px" }}>
                  {isLoading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-3">
                        <div>
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : currentItems.length > 0 ? (
                    currentItems.map((facility) => (
                      <tr key={facility.id} style={{ transition: "background-color 0.2s" }}>
                        <td className="text-center small-text py-3 px-6">
                          {indexOfFirstItem + currentItems.indexOf(facility) + 1}
                        </td>
                        <td className="text-start small-text py-3 px-4">{facility.name}</td>
                        <td className="text-start small-text py-3 px-4">{facility.location}</td>
                        <td className="text-start small-text py-3 px-4">{facility.capacity?.toLocaleString()}</td>
                        <td className="text-start small-text py-3 px-4">{facility.currentVolume?.toLocaleString()}</td>
                        <td className="text-start small-text py-3 px-4">
                          {facility.dateLastRefilled ? new Date(facility.dateLastRefilled).toLocaleDateString() : '-'}
                        </td>
                        <td className="text-start small-text py-3 px-4">
                          {facility.dateLastDrawn ? new Date(facility.dateLastDrawn).toLocaleDateString() : '-'}
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
                                  to="/storage/details"
                                  state={{ facilityId: facility.id }}
                                >
                                  Details
                                </Link>
                              </li>
                              <li>
                                <Link
                                  className="dropdown-item"
                                  to="/storage/edit-facility"
                                  state={{ facilityId: facility.id }}
                                >
                                  Edit
                                </Link>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => handleDeleteClick(facility)}
                                  data-bs-toggle="modal"
                                  data-bs-target="#deleteFacilityModal"
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
                        No facilities found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {!isLoading && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-muted">
                  <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredFacilities.length)} of {filteredFacilities.length} entries</span>
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
            )}
          </div>
        </div>
      </div>

      <div className="modal fade" id="deleteFacilityModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body pt-3 ps-18 pe-18">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="modal-title fs-6">Delete Facility</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <p className="pb-3 mb-0">
                Are you sure you want to delete the <strong>{facilityToDelete?.name}</strong> facility permanently? This action cannot be undone.
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

export default StorageFacilityLayer;