import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import toast, { Toaster } from "react-hot-toast";
import { Spinner } from "../hook/spinner-utils";
import { formatDate } from "../hook/format-utils";

const API_URL = "https://api.bizchain.co.ke/v1/customers";
const CUSTOMER_CATEGORY_API = "https://api.bizchain.co.ke/v1/customer-categories";
const PRICING_CATEGORY_API = "https://api.bizchain.co.ke/v1/customer-pricing-categories";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

const CustomersLayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState("");
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const debouncedQuery = useDebounce(query, 300);

  const fetchCustomers = useCallback(
    async (page = 1, searchQuery = "") => {
      setIsLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Please login!");
        }

        // Fetch customers, customer categories, and pricing categories in parallel
        const [customerResponse, categoryResponse, pricingResponse] = await Promise.all([
          axios.get(`${API_URL}?t=${Date.now()}`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              page: page - 1,
              size: itemsPerPage,
              searchValue: searchQuery,
            },
          }),
          axios.get(CUSTOMER_CATEGORY_API, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(PRICING_CATEGORY_API, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Validate customer response
        const customerData = Array.isArray(customerResponse.data.data) ? customerResponse.data.data : [];
        const total = customerResponse.data.totalElements || customerData.length;

        // Validate category response
        if (categoryResponse.data.status.code !== 0 || !Array.isArray(categoryResponse.data.data)) {
          throw new Error("Failed to fetch customer categories");
        }
        const customerCategories = categoryResponse.data.data;

        // Validate pricing response
        if (pricingResponse.data.status.code !== 0 || !Array.isArray(pricingResponse.data.data)) {
          throw new Error("Failed to fetch pricing categories");
        }
        const pricingCategories = pricingResponse.data.data;

        // Map customer data with category and pricing names
        const formattedCustomers = customerData.map((customer) => ({
          id: customer.id,
          name: `${customer.firstName} ${customer.lastName}`.trim(),
          phoneNo: customer.phoneNo,
          customerCategory: (
            customer.customerCategory?.code &&
            customerCategories.find((cat) => cat.code === customer.customerCategory?.code)?.name
          ) || "",
          pricingCategory: (
            customer.customerPricingCategory?.code &&
            pricingCategories.find((pc) => pc.code === customer.customerPricingCategory?.code)?.name
          ) || "",
          route: customer.route?.name || "",
          dateCreated: customer.dateCreated,
        }));

        setCustomers(formattedCustomers);
        setTotalItems(total);
      } catch (error) {
        console.error("Error fetching customers:", error);
        const message = error.message || "Failed to fetch customers";
        setError(message);
        toast.error(message);
        setCustomers([]);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage]
  );

  useEffect(() => {
    fetchCustomers(currentPage, debouncedQuery);
  }, [currentPage, debouncedQuery, fetchCustomers]);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchCustomers(currentPage, debouncedQuery);
      navigate("/customers", { state: {}, replace: true });
    }
  }, [location.state, currentPage, debouncedQuery, fetchCustomers, navigate]);

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
  };

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in");
      }
      await axios.delete(`${API_URL}/${customerToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomerToDelete(null);
      fetchCustomers(currentPage, debouncedQuery);
      toast.success("Customer deleted successfully!");
    } catch (error) {
      console.error("Error deleting customer:", error);
      const message = error.response?.data?.message || "Delete Failed";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
          <form className="navbar-search" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              name="search"
              placeholder="Search name or phone"
              value={query}
              onChange={handleSearchInputChange}
              disabled={isLoading}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
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
                <th scope="col" className="text-start py-3 px-4">Phone No.</th>
                <th scope="col" className="text-start py-3 px-4">Pricing Category</th>
                <th scope="col" className="text-start py-3 px-4">Customer Category</th>
                <th scope="col" className="text-start py-3 px-4">Route</th>
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
              ) : customers.length > 0 ? (
                customers.map((customer, index) => (
                  <tr key={customer.id} style={{ transition: "background-color 0.2s" }}>
                    <td className="text-center small-text py-3 px-6">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="text-start small-text py-3 px-4">{customer.firstName}</td>
                    <td className="text-start small-text py-3 px-4">{customer.phoneNo}</td>
                    <td className="text-start small-text py-3 px-4">{customer.pricingCategory}</td>
                    <td className="text-start small-text py-3 px-4">{customer.customerCategory}</td>
                    <td className="text-start small-text py-3 px-4">{customer.route}</td>
                    <td className="text-start small-text py-3 px-4">
                      {formatDate(customer.dateCreated)}
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
                                to="/customers/orders"
                                state={{ customerId: customer.id }}
                              >
                                View
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item"
                                to="/customers/edit"
                                state={{ customerId: customer.id }}
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(customer)}
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
                  <td colSpan="8" className="text-center py-3">
                    No customers found
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

      <div className="modal fade" id="deleteModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body pt-3 ps-18 pe-18">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="modal-title fs-6">Delete Customer</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <p className="pb-3 mb-0">
                Are you sure you want to delete the <strong>{customerToDelete?.name}</strong>{" "}
                customer permanently? This action cannot be undone.
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
                disabled={isLoading}
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

export default CustomersLayer;