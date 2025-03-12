import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_URL = "https://api.bizchain.co.ke/v1/customers";
const SALES_PERSON_API = "https://api.bizchain.co.ke/v1/salespersons";
const PRICING_CATEGORY_API = "https://api.bizchain.co.ke/v1/pricing-categories";
const CUSTOMER_TYPE_API = "https://api.bizchain.co.ke/v1/customer-types";
const ROUTE_API = "https://api.bizchain.co.ke/v1/routes";

const EditCustomer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customer } = location.state || {};

  const [editCustomer, setEditCustomer] = useState({
    name: customer?.name || "",
    phoneNo: customer?.phoneNo || "",
    pricingCategoryId: customer?.pricingCategoryId || "",
    customerTypeId: customer?.customerTypeId || "",
    routeId: customer?.routeId || "",
    salespersonId: customer?.salespersonId || "",
  });
  const [showPricingCategoryDropdown, setShowPricingCategoryDropdown] = useState(false);
  const [showCustomerTypeDropdown, setShowCustomerTypeDropdown] = useState(false);
  const [showRouteDropdown, setShowRouteDropdown] = useState(false);
  const [showSalespersonDropdown, setShowSalespersonDropdown] = useState(false);
  const [salespeople, setSalespeople] = useState([]);
  const [pricingCategories, setPricingCategories] = useState([]); 
  const [customerTypes, setCustomerTypes] = useState([]);
  const [routes, setRoutes] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!customer) {
      toast.error("No customer selected to edit.");
      navigate("/customers");
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const [salespeopleRes, pricingRes, customerTypeRes, routeRes] = await Promise.all([
          axios.get(SALES_PERSON_API, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(PRICING_CATEGORY_API, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(CUSTOMER_TYPE_API, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(ROUTE_API, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        // Set data directly from API responses
        setSalespeople(salespeopleRes.data.data || []);
        setPricingCategories(pricingRes.data.data || []);
        setCustomerTypes(customerTypeRes.data.data || []);
        setRoutes(routeRes.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load dropdown options. Please try again later.");
        toast.error("Failed to load options.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, [customer, navigate]);

  // Helper functions to get display names from IDs
  const getPricingCategoryName = (id) =>
    pricingCategories.find((cat) => cat.id === id)?.name || "Select Pricing Category";
  const getCustomerTypeName = (id) =>
    customerTypes.find((type) => type.id === id)?.name || "Select Customer Type";
  const getRouteName = (id) => routes.find((route) => route.id === id)?.name || "Select Route";
  const getSalespersonName = (id) =>
    salespeople.find((person) => person.id === id)?.name || "Select Salesperson";

  const handleEditCustomer = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !editCustomer.name ||
      !editCustomer.phoneNo ||
      !editCustomer.pricingCategoryId ||
      !editCustomer.customerTypeId ||
      !editCustomer.routeId ||
      !editCustomer.salespersonId
    ) {
      setError("Please fill in all required fields.");
      toast.error("Please fill in all required fields.");
      return;
    }

    const customerData = {
      name: editCustomer.name,
      phoneNo: editCustomer.phoneNo,
      pricingCategoryId: editCustomer.pricingCategoryId,
      customerTypeId: editCustomer.customerTypeId,
      routeId: editCustomer.routeId,
      salespersonId: editCustomer.salespersonId,
    };

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in.");

      const response = await axios.put(`${API_URL}/${customer.id}`, customerData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Customer updated successfully!");
        navigate("/customers");
      }
    } catch (error) {
      console.error("Error updating customer:", error.response?.data || error.message);
      setError(error.response?.data?.detail || "Failed to update customer. Please try again.");
      toast.error("Failed to update customer.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/customers");

  return (
    <div className="page-wrapper">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="row">
        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">
            <h6 className="fs-6 mb-4">Edit Customer</h6>
            {error && <div className="alert alert-danger">{error}</div>}
            {fetchLoading && <div className="alert alert-info">Loading options...</div>}
            <form onSubmit={handleEditCustomer}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Customer Name"
                    value={editCustomer.name}
                    onChange={(e) => setEditCustomer({ ...editCustomer, name: e.target.value })}
                    required
                    disabled={fetchLoading}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Phone No <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Phone Number"
                    value={editCustomer.phoneNo}
                    onChange={(e) => setEditCustomer({ ...editCustomer, phoneNo: e.target.value })}
                    required
                    disabled={fetchLoading}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">
                    Pricing Category <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <div
                      className="form-control d-flex justify-content-between align-items-center"
                      style={{ cursor: "pointer" }}
                      onClick={() => !fetchLoading && setShowPricingCategoryDropdown(!showPricingCategoryDropdown)}
                    >
                      <span>{getPricingCategoryName(editCustomer.pricingCategoryId)}</span>
                      <i className="dropdown-toggle ms-2"></i>
                    </div>
                    {showPricingCategoryDropdown && (
                      <ul
                        className="dropdown-menu w-100 show"
                        style={{ position: "absolute", top: "100%", left: 0, zIndex: 1000 }}
                      >
                        {pricingCategories.map((category) => (
                          <li key={category.id}>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => {
                                setEditCustomer({ ...editCustomer, pricingCategoryId: category.id });
                                setShowPricingCategoryDropdown(false);
                              }}
                            >
                              {category.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Customer Type <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <div
                      className="form-control d-flex justify-content-between align-items-center"
                      style={{ cursor: "pointer" }}
                      onClick={() => !fetchLoading && setShowCustomerTypeDropdown(!showCustomerTypeDropdown)}
                    >
                      <span>{getCustomerTypeName(editCustomer.customerTypeId)}</span>
                      <i className="dropdown-toggle ms-2"></i>
                    </div>
                    {showCustomerTypeDropdown && (
                      <ul
                        className="dropdown-menu w-100 show"
                        style={{ position: "absolute", top: "100%", left: 0, zIndex: 1000 }}
                      >
                        {customerTypes.map((type) => (
                          <li key={type.id}>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => {
                                setEditCustomer({ ...editCustomer, customerTypeId: type.id });
                                setShowCustomerTypeDropdown(false);
                              }}
                            >
                              {type.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">
                    Route <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <div
                      className="form-control d-flex justify-content-between align-items-center"
                      style={{ cursor: "pointer" }}
                      onClick={() => !fetchLoading && setShowRouteDropdown(!showRouteDropdown)}
                    >
                      <span>{getRouteName(editCustomer.routeId)}</span>
                      <i className="dropdown-toggle ms-2"></i>
                    </div>
                    {showRouteDropdown && (
                      <ul
                        className="dropdown-menu w-100 show"
                        style={{ position: "absolute", top: "100%", left: 0, zIndex: 1000 }}
                      >
                        {routes.map((route) => (
                          <li key={route.id}>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => {
                                setEditCustomer({ ...editCustomer, routeId: route.id });
                                setShowRouteDropdown(false);
                              }}
                            >
                              {route.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Salesperson <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <div
                      className="form-control d-flex justify-content-between align-items-center"
                      style={{ cursor: "pointer" }}
                      onClick={() => !fetchLoading && setShowSalespersonDropdown(!showSalespersonDropdown)}
                    >
                      <span>{getSalespersonName(editCustomer.salespersonId)}</span>
                      <i className="dropdown-toggle ms-2"></i>
                    </div>
                    {showSalespersonDropdown && (
                      <ul
                        className="dropdown-menu w-100 show"
                        style={{ position: "absolute", top: "100%", left: 0, zIndex: 1000 }}
                      >
                        {salespeople.map((salesperson) => (
                          <li key={salesperson.id}>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => {
                                setEditCustomer({ ...editCustomer, salespersonId: salesperson.id });
                                setShowSalespersonDropdown(false);
                              }}
                            >
                              {salesperson.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-muted small mt-3">
                Fields marked with <span className="text-danger">*</span> are required.
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={loading || fetchLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading || fetchLoading}>
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomer;