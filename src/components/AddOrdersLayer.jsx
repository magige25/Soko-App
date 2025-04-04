import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "../hook/spinner-utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const ORDERS_API_URL = "https://api.bizchain.co.ke/v1/orders";
const CUSTOMERS_API_URL = "https://api.bizchain.co.ke/v1/customers";
const CATEGORIES_API = "https://api.bizchain.co.ke/v1/categories";
const SUBCATEGORIES_API = "https://api.bizchain.co.ke/v1/sub-categories";
const PRODUCTS_API = "https://api.bizchain.co.ke/v1/products";

const AddOrdersLayer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerId: "",
    deliveryDate: "",
    orderRequests: [{ categoryId: "", subCategoryId: "", productId: "", qty: "" }],
  });
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchData = useCallback(async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("No authentication token found. Please log in.");
      navigate("/login");
      return;
    }

    setIsFetchingData(true);
    try {
      const [customersRes, categoriesRes, subCategoriesRes, productsRes] = await Promise.all([
        axios.get(CUSTOMERS_API_URL, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(CATEGORIES_API, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(SUBCATEGORIES_API, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(PRODUCTS_API, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (customersRes.data.status.code === 0) setCustomers(customersRes.data.data);
      else throw new Error("Failed to load customers");

      if (categoriesRes.data.status.code === 0) setCategories(categoriesRes.data.data);
      else throw new Error("Failed to load categories");

      if (subCategoriesRes.data.status.code === 0) setSubCategories(subCategoriesRes.data.data);
      else throw new Error("Failed to load subcategories");

      if (productsRes.data.status.code === 0) setProducts(productsRes.data.data);
      else throw new Error("Failed to load products");
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
    const selectedProductIds = formData.orderRequests
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
      customerId: "Customer",
      deliveryDate: "Delivery Date",
      categoryId: "Category",
      subCategoryId: "Subcategory",
      productId: "Product",
      qty: "Quantity",
    };

    const label = fieldLabels[field] || field;

    if (!value || (typeof value === "string" && !value.trim())) {
      fieldErrors[`${field}${index}`] = `${label} is required`;
    }
    if (field === "qty" && value && (!/^\d+$/.test(value) || parseInt(value, 10) <= 0)) {
      fieldErrors[`${field}${index}`] = `${label} must be a positive integer`;
    }
    return fieldErrors;
  };

  const handleInputChange = (index, field, value) => {
    const updatedFormData = { ...formData };
    if (field === "customerId" || field === "deliveryDate") {
      updatedFormData[field] = value;
    } else {
      updatedFormData.orderRequests[index][field] = value;
      if (field === "categoryId") {
        updatedFormData.orderRequests[index].subCategoryId = "";
        updatedFormData.orderRequests[index].productId = "";
        updatedFormData.orderRequests[index].qty = "";
        setErrors((prev) => ({
          ...prev,
          [`subCategoryId${index}`]: undefined,
          [`productId${index}`]: undefined,
          [`qty${index}`]: undefined,
        }));
      }
      if (field === "subCategoryId") {
        updatedFormData.orderRequests[index].productId = "";
        updatedFormData.orderRequests[index].qty = "";
        setErrors((prev) => ({
          ...prev,
          [`productId${index}`]: undefined,
          [`qty${index}`]: undefined,
        }));
      }
    }
    setFormData(updatedFormData);

    const fieldErrors = validateField(index, field, value);
    setErrors((prev) => ({
      ...prev,
      ...fieldErrors,
      ...(Object.keys(fieldErrors).length === 0 ? { [`${field}${index}`]: undefined } : {}),
    }));
  };

  const handleAddOrderRequest = () => {
    setFormData((prev) => ({
      ...prev,
      orderRequests: [...prev.orderRequests, { categoryId: "", subCategoryId: "", productId: "", qty: "" }],
    }));
  };

  const handleRemoveOrderRequest = (index) => {
    if (formData.orderRequests.length === 1) {
      toast.warn("At least one order request is required");
      return;
    }
    const updatedRequests = [...formData.orderRequests];
    updatedRequests.splice(index, 1);
    setFormData((prev) => ({ ...prev, orderRequests: updatedRequests }));

    setErrors((prev) => {
      const keysToRemove = ["categoryId", "subCategoryId", "productId", "qty"].map(
        (field) => `${field}${index}`
      );
      return Object.fromEntries(Object.entries(prev).filter(([key]) => !keysToRemove.includes(key)));
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerId) newErrors.customerId = "Customer is required";
    if (!formData.deliveryDate) newErrors.deliveryDate = "Delivery Date is required";
    formData.orderRequests.forEach((req, index) => {
      ["categoryId", "subCategoryId", "productId", "qty"].forEach((field) => {
        Object.assign(newErrors, validateField(index, field, req[field]));
      });
    });
    return newErrors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error("Please fix all errors before submitting");
      return;
    }

    setIsSubmitting(true);

    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("No authentication token found. Please log in.");
      setIsSubmitting(false);
      return;
    }

    const [year, month, day] = formData.deliveryDate.split("-");
    const formattedDate = `${day}/${month}/${year}`;

    const payload = {
      customerId: parseInt(formData.customerId, 10),
      deliveryDate: formattedDate,
      orderRequests: formData.orderRequests.map((req) => ({
        productId: parseInt(req.productId, 10),
        qty: parseInt(req.qty, 10),
      })),
    };

    try {
      const response = await axios.post(ORDERS_API_URL, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status.code === 0) {
        toast.success("Order added successfully!");
        navigate("/orders");
      } else {
        throw new Error(`Failed to add order: ${response.data.status.message}`);
      }
    } catch (err) {
      console.error("Error adding order:", err.response?.data || err.message);
      toast.error(`Error: ${err.response?.data?.message || err.message || "Failed to add order."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="card-body">
        {isFetchingData && !categories.length && <Spinner />}
        <form onSubmit={handleFormSubmit}>
          <div className="row gx-3">
            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-0">
                Customer <span className="text-danger">*</span>
              </label>
              <select
                className={`form-control radius-8 form-select ${errors.customerId ? "is-invalid" : ""}`}
                value={formData.customerId}
                onChange={(e) => handleInputChange(0, "customerId", e.target.value)}
                disabled={isFetchingData || isSubmitting}
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {`${customer.firstName} ${customer.lastName}`}
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <div className="invalid-feedback d-block">{errors.customerId}</div>
              )}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-0">
                Delivery Date <span className="text-danger">*</span>
              </label>
              <DatePicker
                value={formData.deliveryDate ? dayjs(formData.deliveryDate) : null}
                format="YYYY-MM-DD"
                onChange={(date, dateString) => handleInputChange(0, "deliveryDate", dateString)}
                className={`${errors.deliveryDate ? "is-invalid" : ""}`}
                disabled={isFetchingData || isSubmitting}
              />
              {errors.deliveryDate && (
                <div className="invalid-feedback d-block">{errors.deliveryDate}</div>
              )}
            </div>
          </div>

          {formData.orderRequests.map((req, index) => (
            <div key={index} className="row gx-3 position-relative">
              <div className="col-md-3 mb-3">
                <div className="d-flex align-items-center gap-2">
                  <label className="form-label fw-semibold text-primary-light text-sm mb-0">
                    Category <span className="text-danger">*</span>
                  </label>
                  {index > 0 && (
                    <button
                      type="button"
                      className="btn btn-link text-danger p-0 position-absolute"
                      style={{ top: "0", right: "0" }}
                      onClick={() => handleRemoveOrderRequest(index)}
                      disabled={isFetchingData || isSubmitting}
                    >
                      <Icon icon="mdi:close" width="20" height="20" />
                    </button>
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

              <div className="col-md-3 mb-3">
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

              <div className="col-md-3 mb-3">
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

              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-0">
                  Quantity <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  className={`form-control radius-8 ${errors[`qty${index}`] ? "is-invalid" : ""}`}
                  placeholder="Quantity"
                  value={req.qty}
                  onChange={(e) => handleInputChange(index, "qty", e.target.value)}
                  disabled={isFetchingData || isSubmitting}
                />
                {errors[`qty${index}`] && (
                  <div className="invalid-feedback d-block">{errors[`qty${index}`]}</div>
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
              onClick={handleAddOrderRequest}
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
              {isSubmitting ? "Submitting..." : "Add Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrdersLayer;