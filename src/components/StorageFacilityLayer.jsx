import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Icon } from '@iconify/react';
import { Spinner } from "../hook/spinner-utils";
import { formatDate } from "../hook/format-utils";

const API_URL = "https://api.bizchain.co.ke/v1/storage-facilities";
const SUMMARY_API_URL = "https://api.bizchain.co.ke/v1/cards";

const StorageFacilityLayer = () => {
  const [facilities, setFacilities] = useState([]);
  const [summary, setSummary] = useState({
    totalVolume: 0,
    stockVolume: 0,
    volumeDrawn: 0,
  });
  const [query, setQuery] = useState('');
  const [facilityToDelete, setFacilityToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summaryError, setSummaryError] = useState(null);

  const fetchFacilities = useCallback(async (page = 1, searchQuery = '') => {
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

      const responseData = response.data;
      if (responseData.status.code === 0) {
        const data = responseData.data || [];
        setFacilities(data);
        setTotalItems(responseData.totalElements || 0);
      } else {
        throw new Error(responseData.status.message);
      }
    } catch (error) {
      console.error('Error fetching facilities:', error);
      setError("Failed to fetch facilities. Please try again.");
      setFacilities([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage]);

  const fetchSummary = useCallback(async () => {
    setIsSummaryLoading(true);
    setSummaryError(null);
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(SUMMARY_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { _t: new Date().getTime() },
      });

      const responseData = response.data;
      if (responseData.status.code === 0) {
        setSummary({
          totalVolume: responseData.data.totalVolume || 0,
          stockVolume: responseData.data.stockVolume || 0,
          volumeDrawn: responseData.data.volumeDrawn || 0,
        });
      } else {
        throw new Error(responseData.status.message);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
      setSummaryError("Failed to fetch summary data. Please try again.");
      setSummary({ totalVolume: 0, stockVolume: 0, volumeDrawn: 0 });
    } finally {
      setIsSummaryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFacilities(currentPage, query);
    fetchSummary();
  }, [currentPage, query, fetchFacilities, fetchSummary]);

  const handleDeleteClick = (facility) => {
    setFacilityToDelete(facility);
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`${API_URL}/${facilityToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFacilityToDelete(null);
      fetchFacilities(currentPage, query);
      fetchSummary(); 
    } catch (error) {
      console.error('Error deleting facility:', error);
      setError(error.response?.data?.status?.message || "Failed to delete facility.");
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

  return (
    <div className="h-100 p-0">
      {/* Header */}
      <div className="mt-3" style={{ width: "100%" }}>
        {error && <div className="alert alert-danger">{error}</div>}
        {summaryError && <div className="alert alert-danger">{summaryError}</div>}

        {/* Summary Cards */}
        <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 gy-4 mb-3">
          {/* Card 1: Total Volume */}
          <div className="col">
            <div className="card shadow-none border bg-gradient-start-1 h-100">
              <div className="card-body p-20">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div>
                    <p className="fw-medium text-primary-light mb-1 fs-12">Total Volume</p>
                    <h6 className="mb-0 fs-10">
                      {isSummaryLoading ? <Spinner /> : summary.totalVolume.toLocaleString() + ' Litres'}
                    </h6>
                  </div>
                  <div className="w-50-px h-50-px bg-primary rounded-circle d-flex justify-content-center align-items-center">
                    <Icon icon="mdi:tank" className="text-white text-xxl mb-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Card 2: Stock Volume */}
          <div className="col">
            <div className="card shadow-none border bg-gradient-start-2 h-100">
              <div className="card-body p-20">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div>
                    <p className="fw-medium text-primary-light mb-1 fs-12">Stock Volume</p>
                    <h6 className="mb-0 fs-10">
                      {isSummaryLoading ? <Spinner /> : summary.stockVolume.toLocaleString() + ' Litres'}
                    </h6>
                  </div>
                  <div className="w-50-px h-50-px bg-success-main rounded-circle d-flex justify-content-center align-items-center">
                    <Icon icon="mdi:scale" className="text-white text-xxl mb-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Card 3: Volume Drawn */}
          <div className="col">
            <div className="card shadow-none border bg-gradient-start-3 h-100">
              <div className="card-body p-20">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div>
                    <p className="fw-medium text-primary-light mb-1 fs-12">Volume Drawn</p>
                    <h6 className="mb-0 fs-10">
                      {isSummaryLoading ? <Spinner /> : summary.volumeDrawn.toLocaleString() + ' Litres'}
                    </h6>
                  </div>
                  <div className="w-50-px h-50-px bg-info rounded-circle d-flex justify-content-center align-items-center">
                    <Icon icon="mdi:water-pump" className="text-white text-xxl mb-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="card h-100 p-0 radius-12">
          <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
            <form className="navbar-search">
              <input
                type="text"
                className="bg-base h-40-px w-auto"
                name="search"
                placeholder="Search name or location"
                value={query}
                onChange={handleSearchInputChange}
              />
              <Icon icon="ion:search-outline" className="icon" />
            </form>
            <Link
              to="/storage-facility/add-facility"
              className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add New Facility
            </Link>
          </div>

          <div className="card-body p-24">
            <div className="table-responsive scroll-sm">
              <table className="table table-borderless sm-table mb-0">
                <thead>
                  <tr>
                    <th scope="col" className="text-center py-3 px-6">#</th>
                    <th scope="col" className="text-start py-3 px-4">Name</th>
                    <th scope="col" className="text-start py-3 px-4">Location</th>
                    <th scope="col" className="text-start py-3 px-4">Capacity (L)</th>
                    <th scope="col" className="text-start py-3 px-4">Stock Volume (L)</th>
                    <th scope="col" className="text-start py-3 px-4">Last Refilled</th>
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
                  ) : facilities.length > 0 ? (
                    facilities.map((facility, index) => (
                      <tr key={facility.id} style={{ transition: "background-color 0.2s" }}>
                        <td className="text-center small-text py-3 px-6">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="text-start small-text py-3 px-4">{facility.name}</td>
                        <td className="text-start small-text py-3 px-4">{facility.location || '-'}</td>
                        <td className="text-start small-text py-3 px-4">{facility.capacity.toLocaleString()}</td>
                        <td className="text-start small-text py-3 px-4">{facility.stockVolume?.toLocaleString() || '-'}</td>
                        <td className="text-start small-text py-3 px-4">
                          {facility.dateLastRefilled ? formatDate(facility.dateLastRefilled) : '-'}
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
                                    to="/storage-facility/facility-details"
                                    state={{ facilityId: facility.id }}
                                  >
                                    Details
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to="/storage-facility/edit-facility"
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
        </div>

        {/* Delete Modal */}
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
    </div>
  );
};

export default StorageFacilityLayer;