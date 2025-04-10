import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Spinner } from "../hook/spinner-utils";
import { formatDate, formatCurrency } from "../hook/format-utils";

const API_URL = "https://api.bizchain.co.ke/v1/suppliers";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

const SuppliersLayer = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [query, setQuery] = useState("");
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const debouncedQuery = useDebounce(query, 300);

  const fetchSuppliers = useCallback(async (page = 1, searchQuery = "") => {
    setIsLoading(true);
    setError(null);
    const token = sessionStorage.getItem("token");
    if (!token || token.trim() === "") {
      setError("No authentication token found. Please log in.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: page,
          limit: itemsPerPage,
          searchValue: searchQuery,
        },
      });
      const result = response.data;
      if (result.status.code === 0) {
        const mappedSuppliers = result.data.map((supplier) => ({
          id: supplier.id,
          firstName: supplier.firstName,
          lastName: supplier.lastName,
          phoneNumber: supplier.phoneNumber,
          productionQuantity: supplier.productionQuantity,
          numberCattle: supplier.numberCattle,
          pendingBills: supplier.pendingBills,
          unpaidBills: supplier.unpaidBills,
          residence: supplier.supplierResidence.name,
          paymentMethod: supplier.disbursementMethod.name,
          transportMode: supplier.transportMode.name,
          disbursementCriteria: supplier.disbursementCriteria?.name || "",
          disbursementPhoneNumber: supplier.disbursementPhoneNumber || "",
          expansionSpace: supplier.expansionSpace,
          expansionCapacity: supplier.expansionCapacity,
          contactPersonName: supplier.contactPersonName || "",
          contactPersonPhoneNumber: supplier.contactPersonPhoneNumber || "",
          paymentCycle: supplier.paymentCycle || "WKLY",
          dateCreated: supplier.dateCreated?.split("T")[0] || "N/A",
        }));
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = Math.min(page * itemsPerPage, result.data.length);
        const paginatedData = mappedSuppliers.slice(startIndex, endIndex);

        setSuppliers(paginatedData);
        setTotalItems(result.data.length);
      } else {
        setError(`Failed to fetch suppliers: ${result.status.message}`);
        setSuppliers([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setError(`Error fetching suppliers: ${error.response?.data?.message || error.message}`);
      setSuppliers([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchSuppliers(currentPage, debouncedQuery);
  }, [currentPage, debouncedQuery, fetchSuppliers]);

  const handleDeleteClick = (supplier) => {
    setSupplierToDelete(supplier);
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    setError(null);
    const token = sessionStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      setIsLoading(false);
      return;
    }
    try {
      await axios.delete(`${API_URL}/${supplierToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSupplierToDelete(null);
      fetchSuppliers(currentPage, debouncedQuery);
    } catch (error) {
      console.error("Error deleting supplier:", error);
      setError(error.response?.data?.message || "Failed to delete supplier.");
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
              placeholder="Search name or residence"
              value={query}
              onChange={handleSearchInputChange}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
        </div>
        <Link
          to="/suppliers/add-supplier"
          className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
        >
          <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
          Add New Supplier
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
                <th scope="col" className="text-start py-3 px-4">Phone Number</th>
                <th scope="col" className="text-start py-3 px-4">Production (L)</th>
                <th scope="col" className="text-start py-3 px-4">Cattle</th>
                <th scope="col" className="text-start py-3 px-4">Pending Bills</th>
                <th scope="col" className="text-start py-3 px-4">Unpaid Bills</th>
                <th scope="col" className="text-start py-3 px-4">Residence</th>
                <th scope="col" className="text-start py-3 px-4">Payment Method</th>
                <th scope="col" className="text-start py-3 px-4">Date Created</th>
                <th scope="col" className="text-start py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="11" className="text-center py-3">
                    <Spinner />
                  </td>
                </tr>
              ) : suppliers.length > 0 ? (
                suppliers.map((supplier, index) => (
                  <tr key={supplier.id} style={{ transition: "background-color 0.2s" }}>
                    <td className="text-center small-text py-3 px-6">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="text-start small-text py-3 px-4">{`${supplier.firstName} ${supplier.lastName}`}</td>
                    <td className="text-start small-text py-3 px-4">{supplier.phoneNumber}</td>
                    <td className="text-start small-text py-3 px-4">{supplier.productionQuantity}</td>
                    <td className="text-start small-text py-3 px-4">{supplier.numberCattle}</td>
                    <td className="text-start small-text py-3 px-4">{formatCurrency(supplier.pendingBills)}</td>
                    <td className="text-start small-text py-3 px-4">{formatCurrency(supplier.unpaidBills)}</td>
                    <td className="text-start small-text py-3 px-4">{supplier.residence}</td>
                    <td className="text-start small-text py-3 px-4">{supplier.paymentMethod}</td>
                    <td className="text-start small-text py-3 px-4">{formatDate(supplier.dateCreated)}</td>
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
                                to="/suppliers/details"
                                state={{ supplierId: supplier.id }}
                              >
                                View
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item"
                                to="/suppliers/edit-supplier"
                                state={{ supplierId: supplier.id }}
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(supplier)}
                                data-bs-toggle="modal"
                                data-bs-target="#deleteSupplierModal"
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
                  <td colSpan="11" className="text-center py-3">
                    No suppliers found
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

      <div className="modal fade" id="deleteSupplierModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body pt-3 ps-18 pe-18">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="modal-title fs-6">Delete Supplier</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <p className="pb-3 mb-0">
                Are you sure you want to delete the{" "}
                <strong>{`${supplierToDelete?.firstName} ${supplierToDelete?.lastName}`}</strong>{" "}
                supplier permanently? This action cannot be undone.
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

export default SuppliersLayer;