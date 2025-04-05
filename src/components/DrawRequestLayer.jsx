import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "../hook/spinner-utils";

const API_URL = "https://api.bizchain.co.ke/v1/drawing";
const CATEGORIES_API = "https://api.bizchain.co.ke/v1/categories";
const SUBCATEGORIES_API = "https://api.bizchain.co.ke/v1/sub-categories";
const PRODUCTS_API = "https://api.bizchain.co.ke/v1/products";

const DrawRequestLayer = () => {
  const navigate = useNavigate();
  const [processingRequests, setProcessingRequests] = useState([
    { categoryId: "", subCategoryId: "", productId: "", litres: "", expectedQty: "" },
  ]);
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
      const [categoriesRes, subCategoriesRes, productsRes] = await Promise.all([
        axios.get(CATEGORIES_API, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(SUBCATEGORIES_API, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(PRODUCTS_API, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

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

    const selectedProductIds = processingRequests
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
      categoryId: "Category name",
      subCategoryId: "Subcategory name",
      productId: "Product name",
      litres: "Volume in litres",
      expectedQty: "Expected quantity",
    };

    const label = fieldLabels[field] || field;

    if (!value || (typeof value === "string" && !value.trim())) {
      fieldErrors[`${field}${index}`] = `${label} is required`;
    }
    if (field === "litres" && value && (!/^\d+$/.test(value) || parseInt(value, 10) <= 0)) {
      fieldErrors[`${field}${index}`] = `${label} must be a positive integer`;
    }
    if (field === "expectedQty" && value && (!/^\d+$/.test(value) || parseInt(value, 10) <= 0)) {
      fieldErrors[`${field}${index}`] = `${label} must be a positive integer`;
    }
    return fieldErrors;
  };

  const handleAddProcessingRequest = () => {
    setProcessingRequests([
      ...processingRequests,
      { categoryId: "", subCategoryId: "", productId: "", litres: "", expectedQty: "" },
    ]);
  };

  const handleRemoveProcessingRequest = (index) => {
    if (processingRequests.length === 1) {
      toast.warn("At least one processing request is required");
      return;
    }
    const updatedRequests = [...processingRequests];
    updatedRequests.splice(index, 1);
    setProcessingRequests(updatedRequests);

    setErrors((prev) => {
      const keysToRemove = ["categoryId", "subCategoryId", "productId", "litres", "expectedQty"].map(
        (field) => `${field}${index}`
      );
      return Object.fromEntries(Object.entries(prev).filter(([key]) => !keysToRemove.includes(key)));
    });
  };

  const handleInputChange = (index, field, value) => {
    const updatedRequests = [...processingRequests];
    updatedRequests[index][field] = value;
    setProcessingRequests(updatedRequests);

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
    processingRequests.forEach((req, index) => {
      ["categoryId", "subCategoryId", "productId", "litres", "expectedQty"].forEach((field) => {
        Object.assign(newErrors, validateField(index, field, req[field]));
      });
    });
    return newErrors;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted, processingRequests:", processingRequests); // Debug log
    const formErrors = validateForm();
    console.log("Validation errors:", formErrors); // Debug log
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error("Please fix all errors before submitting", { autoClose: 5000 }); // Extended visibility
      console.log("Submission blocked due to errors");
      return;
    }
    console.log("No validation errors, showing modal");
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
        productProcessingRequests: processingRequests.map((req) => ({
          productId: parseInt(req.productId, 10),
          litres: parseInt(req.litres, 10),
          expectedQty: parseInt(req.expectedQty, 10),
        })),
      };

      const response = await axios.post(API_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status.code === 0) {
        toast.success("Drawing request saved successfully!");
        setProcessingRequests([
          { categoryId: "", subCategoryId: "", productId: "", litres: "", expectedQty: "" },
        ]);
        navigate("/drawing");
      } else {
        toast.error(`Failed to save drawing request: ${response.data.status.message}`);
      }
    } catch (error) {
      console.error("Error saving drawing request:", error.response?.data || error.message);
      toast.error(`Error saving drawing request: ${error.response?.data?.message || error.message}`);
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
        {isFetchingData && !categories.length && (
          <Spinner />
        )}
        <form onSubmit={handleFormSubmit}>
          {processingRequests.map((req, index) => (
            <div key={index} className="row gx-3">
              <div className="col-md-4 mb-3">
                <div className="d-flex align-items-center gap-2">
                  <label className="form-label fw-semibold text-primary-light text-sm mb-0">
                    Category <span className="text-danger">*</span>
                  </label>
                  {index > 0 && (
                    <button
                      type="button"
                      className="btn-close btn-sm"
                      onClick={() => handleRemoveProcessingRequest(index)}
                    />
                  )}
                </div>
                <select
                  className={`form-control radius-8 form-select${errors[`categoryId${index}`] ? "is-invalid" : ""}`}
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
                  className={`form-control radius-8 form-select ${errors[`subCategoryId${index}`] ? "is-invalid" : ""}`}
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

              <div className="col-md-4">
                <label className="form-label fw-semibold text-primary-light text-sm mb-0">
                  Product <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-control radius-8 form-select ${errors[`productId${index}`] ? "is-invalid" : ""}`}
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
                  Volume (Litres) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  className={`form-control radius-8 ${errors[`litres${index}`] ? "is-invalid" : ""}`}
                  placeholder="Litres"
                  value={req.litres}
                  onChange={(e) => handleInputChange(index, "litres", e.target.value)}
                  disabled={isFetchingData || isSubmitting}
                />
                {errors[`litres${index}`] && (
                  <div className="invalid-feedback d-block">{errors[`litres${index}`]}</div>
                )}
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-0">
                  Expected Quantity <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  className={`form-control radius-8 ${errors[`expectedQty${index}`] ? "is-invalid" : ""}`}
                  placeholder="Quantity"
                  value={req.expectedQty}
                  onChange={(e) => handleInputChange(index, "expectedQty", e.target.value)}
                  disabled={isFetchingData || isSubmitting}
                />
                {errors[`expectedQty${index}`] && (
                  <div className="invalid-feedback d-block">{errors[`expectedQty${index}`]}</div>
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
              onClick={handleAddProcessingRequest}
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
                    <h6 className="modal-title fs-6">Confirm Request</h6>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowConfirmModal(false)}
                    ></button>
                  </div>
                  <p className="pb-3 mb-0">
                    Are you sure you want to complete this request? Once submitted, it cannot be undone.
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

export default DrawRequestLayer;