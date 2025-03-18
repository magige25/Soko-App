import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const STOCK_REQUEST_API = "https://api.bizchain.co.ke/v1/stock-requests";
const DEPOTS_API = "https://api.bizchain.co.ke/v1/depots";
const CATEGORIES_API = "https://api.bizchain.co.ke/v1/categories";
const SUBCATEGORIES_API = "https://api.bizchain.co.ke/v1/sub-categories";
const PRODUCTS_API = "https://api.bizchain.co.ke/v1/products";

const StockRequestLayer = () => {
  const navigate = useNavigate();
  const [stockRequests, setStockRequests] = useState([
    { depotId: "", categoryId: "", subCategoryId: "", productId: "", quantity: "" },
  ]);
  const [depots, setDepots] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchData = useCallback(async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("No authentication token found. Please log in.");
      navigate("/login");
      return;
    }

    setIsFetchingData(true);
    try {
      const [depotsRes, categoriesRes, subCategoriesRes, productsRes] = await Promise.all([
        axios.get(DEPOTS_API, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(CATEGORIES_API, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(SUBCATEGORIES_API, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(PRODUCTS_API, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (depotsRes.data.status.code === 0) {
        setDepots(depotsRes.data.data);
      } else {
        throw new Error("Failed to load depots");
      }

      if (categoriesRes.data.status.code === 0) {
        setCategories(categoriesRes.data.data);
      } else {
        throw new Error("Failed to load categories");
      }

      if (subCategoriesRes.data.status.code === 0) {
        setSubCategories(subCategoriesRes.data.data);
      } else {
        throw new Error("Failed to load subcategories");
      }

      if (productsRes.data.status.code === 0) {
        setProducts(productsRes.data.data);
      } else {
        throw new Error("Failed to load products");
      }
    } catch (err) {
      console.error("Error fetching data:", err.response?.data || err.message);
      toast.error(`Failed to load data: ${err.message || "Please try again"}`);
    } finally {
      setIsFetchingData(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getFilteredSubCategories = (categoryId) => {
    if (!categoryId) return [];
    return subCategories.filter((subCat) => subCat.category.id === parseInt(categoryId, 10));
  };

  const getFilteredProducts = (subCategoryId, currentIndex) => {
    if (!subCategoryId) return [];

    const selectedProductIds = stockRequests
      .filter((_, index) => index !== currentIndex)
      .map((req) => parseInt(req.productId, 10))
      .filter((id) => !isNaN(id));

    return products.filter(
      (prod) =>
        prod.subCategory.id === parseInt(subCategoryId, 10) && !selectedProductIds.includes(prod.id)
    );
  };

  const validateField = (index, field, value) => {
    const fieldErrors = {};
    const fieldLabels = {
      depotId: "Depot name",
      categoryId: "Category",
      subCategoryId: "Subcategory",
      productId: "Product",
      quantity: "Quantity",
    };

    const label = fieldLabels[field] || field;

    // Only validate depotId for the first row
    if (field === "depotId" && index === 0 && !value) {
      fieldErrors[`${field}${index}`] = `${label} is required`;
    } else if (field !== "depotId" && !value) {
      fieldErrors[`${field}${index}`] = `${label} is required`;
    }
    if (field === "quantity" && value && (!/^\d+$/.test(value) || parseInt(value, 10) <= 0)) {
      fieldErrors[`${field}${index}`] = `${label} must be a positive integer`;
    }
    return fieldErrors;
  };

  const handleAddStockRequest = () => {
    setStockRequests([
      ...stockRequests,
      { depotId: stockRequests[0].depotId, categoryId: "", subCategoryId: "", productId: "", quantity: "" },
    ]);
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
      const keysToRemove = ["categoryId", "subCategoryId", "productId", "quantity"].map(
        (field) => `${field}${index}`
      );
      return Object.fromEntries(Object.entries(prev).filter(([key]) => !keysToRemove.includes(key)));
    });
  };

  const handleInputChange = (index, field, value) => {
    const updatedRequests = [...stockRequests];
    updatedRequests[index][field] = value;

    // If depotId changes in the first row, update all rows
    if (field === "depotId" && index === 0) {
      updatedRequests.forEach((req) => (req.depotId = value));
    }

    setStockRequests(updatedRequests);

    const fieldErrors = validateField(index, field, value);
    setErrors((prev) => ({
      ...prev,
      ...fieldErrors,
      ...(Object.keys(fieldErrors).length === 0 ? { [`${field}${index}`]: undefined } : {}),
    }));

    if (field === "categoryId") {
      updatedRequests[index].subCategoryId = "";
      updatedRequests[index].productId = "";
      setErrors((prev) => ({
        ...prev,
        [`subCategoryId${index}`]: undefined,
        [`productId${index}`]: undefined,
      }));
    }
    if (field === "subCategoryId") {
      updatedRequests[index].productId = "";
      setErrors((prev) => ({ ...prev, [`productId${index}`]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    stockRequests.forEach((req, index) => {
      ["depotId", "categoryId", "subCategoryId", "productId", "quantity"].forEach((field) => {
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
      toast.error("Please fix all errors before submitting", { autoClose: 5000 });
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
      const depotId = parseInt(stockRequests[0].depotId, 10);
      const productsPayload = stockRequests.map((req) => ({
        productId: parseInt(req.productId, 10),
        quantity: parseInt(req.quantity, 10),
      }));

      const payload = {
        depotId,
        products: productsPayload,
      };

      const response = await axios.post(STOCK_REQUEST_API, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status.code === 0) {
        toast.success("Stock request saved successfully!");
        setStockRequests([
          { depotId: "", categoryId: "", subCategoryId: "", productId: "", quantity: "" },
        ]);
        navigate("/depot");
      } else {
        toast.error(`Failed to save stock request: ${response.data.status.message}`);
      }
    } catch (error) {
      console.error("Error saving stock request:", error.response?.data || error.message);
      toast.error(`Error saving stock request: ${error.response?.data?.message || error.message}`);
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
        {isFetchingData && !depots.length && (
          <div className="text-center">Loading data...</div>
        )}
        <form onSubmit={handleFormSubmit}>
          {stockRequests.map((req, index) => (
            <div key={index} className="row gx-3">
              {index === 0 && (
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold text-primary-light text-sm mb-0">
                    Depot Name <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-control radius-8 ${errors[`depotId${index}`] ? "is-invalid" : ""}`}
                    value={req.depotId}
                    onChange={(e) => handleInputChange(index, "depotId", e.target.value)}
                    disabled={isFetchingData || isSubmitting}
                  >
                    <option value="">Select Depot</option>
                    {depots.map((depot) => (
                      <option key={depot.id} value={depot.id}>
                        {depot.name}
                      </option>
                    ))}
                  </select>
                  {errors[`depotId${index}`] && (
                    <div className="invalid-feedback d-block">{errors[`depotId${index}`]}</div>
                  )}
                </div>
              )}

              <div className="col-md-4 mb-3">
                <div className="d-flex align-items-center gap-2">
                  <label className="form-label fw-semibold text-primary-light text-sm mb-0">
                    Category <span className="text-danger">*</span>
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
                  className={`form-control radius-8 ${errors[`categoryId${index}`] ? "is-invalid" : ""}`}
                  value={req.categoryId}
                  onChange={(e) => handleInputChange(index, "categoryId", e.target.value)}
                  disabled={isFetchingData || isSubmitting}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors[`categoryId${index}`] && (
                  <div className="invalid-feedback d-block">{errors[`categoryId${index}`]}</div>
                )}
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-0">
                  Subcategory <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-control radius-8 ${errors[`subCategoryId${index}`] ? "is-invalid" : ""}`}
                  value={req.subCategoryId}
                  onChange={(e) => handleInputChange(index, "subCategoryId", e.target.value)}
                  disabled={!req.categoryId || isFetchingData || isSubmitting}
                >
                  <option value="">Select Subcategory</option>
                  {getFilteredSubCategories(req.categoryId).map((subCategory) => (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </option>
                  ))}
                </select>
                {errors[`subCategoryId${index}`] && (
                  <div className="invalid-feedback d-block">{errors[`subCategoryId${index}`]}</div>
                )}
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-0">
                  Product <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-control radius-8 ${errors[`productId${index}`] ? "is-invalid" : ""}`}
                  value={req.productId}
                  onChange={(e) => handleInputChange(index, "productId", e.target.value)}
                  disabled={!req.subCategoryId || isFetchingData || isSubmitting}
                >
                  <option value="">Select Product</option>
                  {getFilteredProducts(req.subCategoryId, index).map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                {errors[`productId${index}`] && (
                  <div className="invalid-feedback d-block">{errors[`productId${index}`]}</div>
                )}
              </div>

              <div className="col-md-4 mb-3">
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
              disabled={isFetchingData || isSubmitting || !stockRequests[0].depotId}
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add Another Request
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

      {/* Confirmation Modal */}
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
                    <h6 className="modal-title fs-6">Confirm Stock Request</h6>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowConfirmModal(false)}
                    ></button>
                  </div>
                  <p className="pb-3 mb-0">
                    Are you sure you want to submit this stock request? Once submitted, it cannot be undone.
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
                    {isSubmitting ? "Submitting..." : "Submit"}
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

export default StockRequestLayer;