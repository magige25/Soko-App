import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Icon } from '@iconify/react/dist/iconify.js';

const API_URL = "https://api.bizchain.co.ke/v1/depots";

const DepotLayer = () => {
  const [depots, setDepots] = useState([]);
  const [query, setQuery] = useState('');
  const [depotToDelete, setDepotToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDepots = useCallback(async (page = 1, searchQuery = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: page - 1,
          size: itemsPerPage,
          searchValue: searchQuery,
          _t: new Date().getTime(),
        },
      });

      console.log('Full API Response:', response.data);
      const responseData = response.data;
      if (responseData.status.code === 0) {
        const data = responseData.data || [];
        setDepots(data);
        setTotalItems(responseData.totalElements || 0);
      } else {
        throw new Error(responseData.status.message);
      }
    } catch (error) {
      console.error('Error fetching depots:', error);
      setError("Failed to fetch depots. Please try again.");
      setDepots([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchDepots(currentPage, query);
  }, [currentPage, query, fetchDepots]);

  const handleDeleteClick = (depot) => {
    setDepotToDelete(depot);
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`${API_URL}/${depotToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepotToDelete(null);
      fetchDepots(currentPage, query);
    } catch (error) {
      console.error('Error deleting depot:', error);
      setError(error.response?.data?.status?.message || "Failed to delete depot.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <form className="navbar-search">
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              name="search"
              placeholder="Search by name, region or subregion"
              value={query}
              onChange={handleSearchInputChange}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
        </div>
        <div className="d-flex gap-3">
        <Link
          to="/depot/request-stock"
          className="btn btn-warning text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
        >
          <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
          Stock Request
        </Link>
        <Link
          to="/depot/add-depot"
          className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
        >
          <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
          Add New Depot
        </Link>
        </div>
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
                <th scope="col" className="text-start py-3 px-4">Subregion</th>
                <th scope="col" className="text-start py-3 px-4">Date Created</th>
                <th scope="col" className="text-start py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-3">
                    <div>
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
                    <td className="text-start small-text py-3 px-4">{depot.region.name}</td>
                    <td className="text-start small-text py-3 px-4">{depot.subRegion.name}</td>
                    <td className="text-start small-text py-3 px-4">
                      {formatDate(depot.dateCreated)}
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
                                to="/depot/depot-details"
                                state={{ depotId: depot.id }}
                              >
                                Details
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item"
                                to="/depot/edit-depot"
                                state={{ depotId: depot.id }}
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(depot)}
                                data-bs-toggle="modal"
                                data-bs-target="#deleteDepotModal"
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
                  <td colSpan="6" className="text-center py-3">
                    No depots found
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
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
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
                      className={`page-link btn ${currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"} rounded-circle d-flex align-items-center justify-content-center`}
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

      <div className="modal fade" id="deleteDepotModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body pt-3 ps-18 pe-18">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="modal-title fs-6">Delete Depot</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <p className="pb-3 mb-0">
                Are you sure you want to delete the <strong>{depotToDelete?.name}</strong> depot permanently? This action cannot be undone.
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

export default DepotLayer;