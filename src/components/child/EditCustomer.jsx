import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Spinner } from "../../hook/spinner-utils";

const API_URL = "https://api.bizchain.co.ke/v1/customers";
const PRICING_CATEGORY_API = "https://api.bizchain.co.ke/v1/customer-pricing-categories";
const CUSTOMER_CATEGORY_API = "https://api.bizchain.co.ke/v1/customer-categories";
const ROUTE_API = "https://api.bizchain.co.ke/v1/routes";

const EditCustomer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const customerId = location.state?.customerId;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    countryCode: "KE",
    pricingCategory: "",
    customerCategory: "",
    routeId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [pricingCategories, setPricingCategories] = useState([]);
  const [customerCategories, setCustomerCategories] = useState([]);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    if (!customerId) {
      toast.error("No customer selected to edit.");
      navigate("/customers");
      return;
    }

    const parsedId = parseInt(customerId, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      setErrors({ submit: "Invalid customer ID: Must be a positive number" });
      setFetchLoading(false);
      return;
    }

    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token || token.trim() === "") {
        setErrors({ submit: "No authentication token found. Please log in." });
        navigate("/login");
        return;
      }

      try {
        setFetchLoading(true);
        const [customerRes, pricingRes, customerCategoryRes, routeRes] = await Promise.all([
          axios.get(`${API_URL}/${parsedId}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(PRICING_CATEGORY_API, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(CUSTOMER_CATEGORY_API, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(ROUTE_API, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const customerData = customerRes.data;
        if (customerData.status && customerData.status.code === 0 && customerData.data) {
          const fullCustomer = customerData.data;
          setFormData({
            firstName: fullCustomer.firstName || "",
            lastName: fullCustomer.lastName || "",
            email: fullCustomer.email || "",
            phoneNumber: fullCustomer.phoneNo || "",
            countryCode: "KE",
            pricingCategory: fullCustomer.customerPricingCategory?.code || "",
            customerCategory: fullCustomer.customerCategory?.code || "",
            routeId: fullCustomer.route?.id ? String(fullCustomer.route.id) : "",
          });
        } else {
          throw new Error("Failed to load customer data.");
        }

        if (pricingRes.data.status.code === 0) {
          setPricingCategories(pricingRes.data.data || []);
        }
        if (customerCategoryRes.data.status.code === 0) {
          setCustomerCategories(customerCategoryRes.data.data || []);
        }
        if (routeRes.data.status.code === 0) {
          setRoutes(routeRes.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setErrors({ submit: error.message || "Failed to load data. Please try again." });
        toast.error("Failed to load options.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, [customerId, navigate]);

  const validateField = (field, value) => {
    if (typeof value === "string" && !value.trim()) {
      return `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")} is required`;
    }
    if (field === "phoneNumber" && value && !/^\+?\d{9,}$/.test(value)) {
      return "Please enter a valid phone number (e.g., +254765746534 or 0765746534)";
    }
    if (field === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        countryCode: formData.countryCode,
        customerPricingCategory: formData.pricingCategory,
        customerCategory: formData.customerCategory,
        routeId: parseInt(formData.routeId, 10),
      };

      console.log("Submitting payload:", payload);

      const response = await axios.put(`${API_URL}/${customerId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status.code !== 0) {
        throw new Error(response.data.status.message || "Failed to update customer");
      }

      toast.success("Customer updated successfully!");
      navigate("/customers", { state: { refresh: true } });
    } catch (error) {
      console.error("Error updating customer:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.detail || error.message || "Failed to update customer";
      setErrors({ submit: errorMessage });
      toast.error("Failed to update customer: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => navigate("/customers");

  return (
    <div className="card h-100 p-0 radius-12">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="card-body">
        {fetchLoading && <Spinner />}
        {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

        {!fetchLoading && (
          <form onSubmit={handleSubmit}>
            <div className="row gx-3">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  First Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control radius-8 ${errors.firstName ? "is-invalid" : ""}`}
                  placeholder="Enter First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  disabled={isLoading}
                />
                {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  Last Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control radius-8 ${errors.lastName ? "is-invalid" : ""}`}
                  placeholder="Enter Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  disabled={isLoading}
                />
                {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className={`form-control radius-8 ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={isLoading}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  Phone Number <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  className={`form-control radius-8 ${errors.phoneNumber ? "is-invalid" : ""}`}
                  placeholder="Enter Phone Number (e.g., +254765746534)"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  disabled={isLoading}
                />
                {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  Country Code <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control radius-8 ${errors.countryCode ? "is-invalid" : ""}`}
                  placeholder="Enter Country Code (e.g., KE)"
                  value={formData.countryCode}
                  onChange={(e) => handleInputChange("countryCode", e.target.value)}
                  disabled={isLoading}
                />
                {errors.countryCode && <div className="invalid-feedback">{errors.countryCode}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  Pricing Category <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-control radius-8 form-select ${errors.pricingCategory ? "is-invalid" : ""}`}
                  value={formData.pricingCategory}
                  onChange={(e) => handleInputChange("pricingCategory", e.target.value)}
                  disabled={isLoading}
                >
                  <option value="">Select Pricing Category</option>
                  {pricingCategories.map((category) => (
                    <option key={category.code} value={category.code}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.pricingCategory && (
                  <div className="invalid-feedback">{errors.pricingCategory}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  Customer Category <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-control radius-8 form-select ${errors.customerCategory ? "is-invalid" : ""}`}
                  value={formData.customerCategory}
                  onChange={(e) => handleInputChange("customerCategory", e.target.value)}
                  disabled={isLoading}
                >
                  <option value="">Select Customer Category</option>
                  {customerCategories.map((category) => (
                    <option key={category.code} value={category.code}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.customerCategory && (
                  <div className="invalid-feedback">{errors.customerCategory}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  Route <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-control radius-8 form-select ${errors.routeId ? "is-invalid" : ""}`}
                  value={formData.routeId}
                  onChange={(e) => handleInputChange("routeId", e.target.value)}
                  disabled={isLoading}
                >
                  <option value="">Select Route</option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.name}
                    </option>
                  ))}
                </select>
                {errors.routeId && <div className="invalid-feedback">{errors.routeId}</div>}
              </div>
            </div>

            <div className="text-muted small mt-4 mb-3">
              Fields marked with <span className="text-danger">*</span> are required.
            </div>

            <div className="mt-4 d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary px-12"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary px-12" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditCustomer;