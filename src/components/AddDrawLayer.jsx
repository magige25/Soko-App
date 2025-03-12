import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://api.bizchain.co.ke/v1/drawing";
const CATEGORIES_API = "https://api.bizchain.co.ke/v1/categories";
const SUBCATEGORIES_API = "https://api.bizchain.co.ke/v1/sub-categories";
const PRODUCTS_API = "https://api.bizchain.co.ke/v1/products";

const AddDrawLayer = () => {
  const navigate = useNavigate();
  const [processingRequests, setProcessingRequests] = useState([
    { categoryId: "", subCategoryId: "", productId: "", litres: "", expectedQty: "" },
  ]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No authentication token found. Please log in.");
      return;
    }

    try {
      const [categoriesRes, subCategoriesRes, productsRes] = await Promise.all([
        axios.get(CATEGORIES_API, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(SUBCATEGORIES_API, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(PRODUCTS_API, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (categoriesRes.data.status.code === 0) {
        setCategories(categoriesRes.data.data);
      } else {
        toast.error("Failed to load categories data.");
      }

      if (subCategoriesRes.data.status.code === 0) {
        setSubCategories(subCategoriesRes.data.data);
      } else {
        toast.error("Failed to load subcategories data.");
      }

      if (productsRes.data.status.code === 0) {
        setProducts(productsRes.data.data);
      } else {
        toast.error("Failed to load products data.");
      }
    } catch (err) {
      console.error("Error fetching data:", err.response?.data || err.message);
      toast.error("Failed to load dropdown data. Please try again.");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Compute filtered subcategories and products dynamically
  const getFilteredSubCategories = (categoryId) => {
    return categoryId
      ? subCategories.filter((subCat) => subCat.categoryId === parseInt(categoryId, 10))
      : subCategories;
  };

  const getFilteredProducts = (subCategoryId) => {
    return subCategoryId
      ? products.filter((prod) => prod.subCategoryId === parseInt(subCategoryId, 10))
      : products;
  };

  const validateField = (index, field, value) => {
    const fieldErrors = {};
    if (typeof value === "string" && !value.trim()) {
      fieldErrors[`${field}${index}`] = `${
        field === "litres"
          ? "Volume (Litres)"
          : field === "expectedQty"
          ? "Expected Quantity"
          : field.charAt(0).toUpperCase() + field.slice(1)
      } is required`;
    }
    if (field === "litres" && value && (!/^\d+$/.test(value) || parseInt(value, 10) <= 0)) {
      fieldErrors[`${field}${index}`] = "Volume (Litres) must be a positive number";
    }
    if (field === "expectedQty" && value && (!/^\d+$/.test(value) || parseInt(value, 10) <= 0)) {
      fieldErrors[`${field}${index}`] = "Expected Quantity must be a positive number";
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
    if (processingRequests.length === 1) return;
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
    setErrors((prev) => {
      if (Object.keys(fieldErrors).length === 0) {
        const { [`${field}${index}`]: _, ...remainingErrors } = prev;
        return remainingErrors;
      }
      return { ...prev, ...fieldErrors };
    });

    // Reset dependent fields if parent changes
    if (field === "categoryId") {
      updatedRequests[index].subCategoryId = "";
      updatedRequests[index].productId = "";
    }
    if (field === "subCategoryId") {
      updatedRequests[index].productId = "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    processingRequests.forEach((req, index) => {
      ["categoryId", "subCategoryId", "productId", "litres", "expectedQty"].forEach((field) => {
        const error = validateField(index, field, req[field]);
        Object.assign(newErrors, error);
      });
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error("Please fix all errors before submitting");
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No authentication token found. Please log in.");
      setIsLoading(false);
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

      console.log("Submitting payload:", payload);

      const response = await axios.post(API_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status.code === 0) {
        toast.success("Drawing saved successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setProcessingRequests([
          { categoryId: "", subCategoryId: "", productId: "", litres: "", expectedQty: "" },
        ]);
        navigate("/drawings");
      } else {
        toast.error(`Failed to save drawing: ${response.data.status.message}`);
      }
    } catch (error) {
      console.error("Error saving drawing:", error.response?.data || error.message);
      toast.error(`Error saving drawing: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {processingRequests.map((req, index) => (
            <div key={index} className="row gx-3 mb-3">
              <div className="col-md-2">
                <div className="d-flex align-items-center gap-2">
                  <label className="form-label fw-semibold text-primary-light text-sm mb-0">
                    Category <span className="text-danger">*</span>
                  </label>
                  {index > 0 && (
                    <button
                      type="button"
                      className="btn-close btn-sm"
                      onClick={() => handleRemoveProcessingRequest(index)}
                    ></button>
                  )}
                </div>
                <select
                  className={`form-control radius-8 ${errors[`categoryId${index}`] ? "is-invalid" : ""}`}
                  value={req.categoryId}
                  onChange={(e) => handleInputChange(index, "categoryId", e.target.value)}
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

              <div className="col-md-2">
                <label className="form-label fw-semibold text-primary-light text-sm mb-0">
                  Subcategory <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-control radius-8 ${errors[`subCategoryId${index}`] ? "is-invalid" : ""}`}
                  value={req.subCategoryId}
                  onChange={(e) => handleInputChange(index, "subCategoryId", e.target.value)}
                  disabled={!req.categoryId}
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

              <div className="col-md-2">
                <label className="form-label fw-semibold text-primary-light text-sm mb-0">
                  Product <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-control radius-8 ${errors[`productId${index}`] ? "is-invalid" : ""}`}
                  value={req.productId}
                  onChange={(e) => handleInputChange(index, "productId", e.target.value)}
                  disabled={!req.subCategoryId}
                >
                  <option value="">Select Product</option>
                  {getFilteredProducts(req.subCategoryId).map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                {errors[`productId${index}`] && (
                  <div className="invalid-feedback d-block">{errors[`productId${index}`]}</div>
                )}
              </div>

              <div className="col-md-2">
                <label className="form-label fw-semibold text-primary-light text-sm mb-0">
                  Volume (Litres) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className={`form-control radius-8 ${errors[`litres${index}`] ? "is-invalid" : ""}`}
                  placeholder="Litres"
                  value={req.litres}
                  onChange={(e) => handleInputChange(index, "litres", e.target.value)}
                />
                {errors[`litres${index}`] && (
                  <div className="invalid-feedback d-block">{errors[`litres${index}`]}</div>
                )}
              </div>

              <div className="col-md-2">
                <label className="form-label fw-semibold text-primary-light text-sm mb-0">
                  Expected Qty <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className={`form-control radius-8 ${errors[`expectedQty${index}`] ? "is-invalid" : ""}`}
                  placeholder="Quantity"
                  value={req.expectedQty}
                  onChange={(e) => handleInputChange(index, "expectedQty", e.target.value)}
                />
                {errors[`expectedQty${index}`] && (
                  <div className="invalid-feedback d-block">{errors[`expectedQty${index}`]}</div>
                )}
              </div>
            </div>
          ))}

          <div className="text-muted small mt-4 mb-3">
            Fields marked with <span className="text-danger">*</span> are required.
          </div>

          <div className="mt-4 d-flex justify-content-between gap-2">
            <button
              type="button"
              className="btn btn-primary px-12 d-flex align-items-center gap-2"
              onClick={handleAddProcessingRequest}
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add Another Product
            </button>
            <button type="submit" className="btn btn-primary px-12" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDrawLayer;