import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://api.bizchain.co.ke/v1/stock-requests/product";
const PRODUCTS_API = "https://api.bizchain.co.ke/v1/products";

const AddProductStockRequest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const depotStockRequestId = location.state?.depotStockRequestId;

  const [stockRequests, setStockRequests] = useState([{ productId: "", quantity: "" }]);
  const [products, setProducts] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchProducts = useCallback(async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("No authentication token found. Please log in.");
      navigate("/login");
      return;
    }

    setIsFetchingData(true);
    try {
      const response = await axios.get(PRODUCTS_API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status.code === 0) {
        setProducts(response.data.data);
      } else {
        throw new Error("Failed to load products");
      }
    } catch (err) {
      console.error("Error fetching products:", err.response?.data || err.message);
      toast.error(`Failed to load products: ${err.message || "Please try again"}`);
    } finally {
      setIsFetchingData(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!depotStockRequestId) {
      toast.error("No stock request ID provided. Please select a stock request to edit.");
      navigate("/stock-request");
      return;
    }
    fetchProducts();
  }, [fetchProducts, depotStockRequestId, navigate]);

  const getAvailableProducts = (currentIndex) => {
    const selectedProductIds = stockRequests
      .filter((_, index) => index !== currentIndex)
      .map((req) => parseInt(req.productId, 10))
      .filter((id) => !isNaN(id));

    return products.filter((prod) => !selectedProductIds.includes(prod.id));
  };

  const validateField = (index, field, value) => {
    const fieldErrors = {};
    const fieldLabels = {
      productId: "Product name",
      quantity: "Quantity",
    };

    const label = fieldLabels[field] || field;

    if (!value || (typeof value === "string" && !value.trim())) {
      fieldErrors[`${field}${index}`] = `${label} is required`;
    }
    if (field === "quantity" && value && (!/^\d+$/.test(value) || parseInt(value, 10) <= 0)) {
      fieldErrors[`${field}${index}`] = `${label} must be a positive integer`;
    }
    return fieldErrors;
  };

  const handleAddStockRequest = () => {
    setStockRequests([...stockRequests, { productId: "", quantity: "" }]);
  };

  const handleRemoveStockRequest = (index) => {
    if (stockRequests.length === 1) {
      toast.warn("At least one stock request is required");
      return;
    }
    const updatedRequests = [...stockRequests];
    updatedRequests.splice(index, 1);
    setStockRequests(updatedRequests);

    setErrors((prev) => {
      const keysToRemove = ["productId", "quantity"].map((field) => `${field}${index}`);
      return Object.fromEntries(Object.entries(prev).filter(([key]) => !keysToRemove.includes(key)));
    });
  };

  const handleInputChange = (index, field, value) => {
    const updatedRequests = [...stockRequests];
    updatedRequests[index][field] = value;
    setStockRequests(updatedRequests);

    const fieldErrors = validateField(index, field, value);
    setErrors((prev) => ({
      ...prev,
      ...fieldErrors,
      ...(Object.keys(fieldErrors).length === 0 ? { [`${field}${index}`]: undefined } : {}),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    stockRequests.forEach((req, index) => {
      ["productId", "quantity"].forEach((field) => {
        Object.assign(newErrors, validateField(index, field, req[field]));
      });
    });
    return newErrors;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error("Please fix all errors before submitting");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);

    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("No authentication token found. Please log in.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        depotStockRequestId: depotStockRequestId,
        depotStockRequestProductPayloadList: stockRequests.map((req) => ({
          productId: parseInt(req.productId, 10),
          quantity: parseInt(req.quantity, 10),
        })),
      };

      const response = await axios.put(API_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("API Response:", response.data); // Log the response for debugging

      if (response.data.status.code === 0) {
        toast.success("Products added successfully!", {
          onClose: () => navigate("/stock-request"), // Navigate after toast closes
          autoClose: 2000, // Show toast for 2 seconds
        });
        setStockRequests([{ productId: "", quantity: "" }]);
      } else {
        toast.error(`Failed to update stock request: ${response.data.status.message}`);
      }
    } catch (error) {
      console.error("Error updating stock request:", error.response?.data || error.message);
      toast.error(`Error updating stock request: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReview = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="card-body">
        {isFetchingData && !products.length && (
          <div className="text-center">Loading products...</div>
        )}
        <form onSubmit={handleFormSubmit}>
          {stockRequests.map((req, index) => (
            <div key={index} className="row gx-3">
              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center gap-2">
                  <label className="form-label fw-semibold text-primary-light text-sm mb-0">
                    Product <span className="text-danger">*</span>
                  </label>
                  {index > 0 && (
                    <button
                      type="button"
                      className="btn-close btn-sm"
                      onClick={() => handleRemoveStockRequest(index)}
                    />
                  )}
                </div>
                <select
                  className={`form-control radius-8 ${errors[`productId${index}`] ? "is-invalid" : ""}`}
                  value={req.productId}
                  onChange={(e) => handleInputChange(index, "productId", e.target.value)}
                  disabled={isFetchingData || isSubmitting}
                >
                  <option value="">Select Product</option>
                  {getAvailableProducts(index).map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                {errors[`productId${index}`] && (
                  <div className="invalid-feedback d-block">{errors[`productId${index}`]}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-0">
                  Quantity <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  className={`form-control radius-8 ${errors[`quantity${index}`] ? "is-invalid" : ""}`}
                  placeholder="Quantity"
                  value={req.quantity}
                  onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                  disabled={isFetchingData || isSubmitting}
                />
                {errors[`quantity${index}`] && (
                  <div className="invalid-feedback d-block">{errors[`quantity${index}`]}</div>
                )}
              </div>
            </div>
          ))}

          <div className="text-muted small mt-4">
            Fields marked with <span className="text-danger">*</span> are required.
          </div>

          <div className="mt-4 d-flex justify-content-between gap-2">
            <button
              type="button"
              className="btn btn-primary px-12 d-flex align-items-center gap-2"
              onClick={handleAddStockRequest}
              disabled={isFetchingData || isSubmitting}
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add Another Product
            </button>
            <button
              type="submit"
              className="btn btn-primary px-12"
              disabled={isSubmitting || isFetchingData}
            >
              {isSubmitting ? "Processing..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>

      {showConfirmModal && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-md modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body pt-3 ps-18 pe-18">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="modal-title fs-6">Confirm Request</h6>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowConfirmModal(false)}
                    ></button>
                  </div>
                  <p className="pb-3 mb-0">
                    Are you sure you want to add these products to the stock request? This action cannot be undone.
                  </p>
                </div>
                <div className="d-flex justify-content-end gap-2 px-12 pb-3">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleReview}
                  >
                    Review
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleConfirmSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Continuing..." : "Continue"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default AddProductStockRequest;