import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import AddImage from "./AddImage";
import { Icon } from "@iconify/react";

const API_URL = "https://api.bizchain.co.ke/v1/products";
const BRAND_API = "https://api.bizchain.co.ke/v1/brands";
const CAT_API = "https://api.bizchain.co.ke/v1/categories";
const SUBCAT_API = "https://api.bizchain.co.ke/v1/sub-categories";

const EditProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { product } = location.state || {};

  const [editProduct, setEditProduct] = useState(
    product
      ? {
          imageFile: null,
          imageURL: product.imageUrl || null,
          sku: product.sku || "",
          name: product.name || "",
          description: product.description || "",
          brand: product.brand?.id || "",
          wholesalePrice: product.wholesalePrice || "",
          distributorPrice: product.distributorPrice || "",
          retailPrice: product.retailPrice || "",
          category: product.category?.id || "",
          subCategory: product.subCategory?.id || "",
          customerPrice: product.customerPrice || "",
          superMarketPrice: product.supermarketPrice || "",
        }
      : {
          imageFile: null,
          imageURL: null,
          sku: "",
          name: "",
          description: "",
          brand: "",
          wholesalePrice: "",
          distributorPrice: "",
          customerPrice: "",
          superMarketPrice: "",
          retailPrice: "",
          category: "",
          subCategory: "",
        }
  );

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  const fetchBrands = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.get(BRAND_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBrands(response.data.data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setError("Failed to load brands");
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.get(CAT_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories");
    }
  }, []);

  const fetchSubCategories = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      const response = await axios.get(SUBCAT_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setError("Failed to fetch subcategories");
    }
  }, []);

  useEffect(() => {
    if (!product) {
      toast.error("No product selected to edit.");
      navigate("/products");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchBrands(), fetchCategories(), fetchSubCategories()]);
      } catch (err) {
        console.error("Error in fetchData:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [product, navigate, fetchBrands, fetchCategories, fetchSubCategories]);

  const getFilteredSubCategories = (categoryId) => {
    if (!categoryId) return [];
    return subCategories.filter((subCat) => subCat.category.id === parseInt(categoryId, 10));
  };

  const handleImageSelect = (file, previewURL) => {
    setEditProduct({ ...editProduct, imageFile: file, imageURL: previewURL });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct(prev => {
      const newData = { ...prev, [name]: value };
      if (name === "category") {
        newData.subCategory = "";
      }
      return newData;
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const prices = [
      editProduct.wholesalePrice,
      editProduct.distributorPrice,
      editProduct.retailPrice,
      editProduct.customerPrice,
      editProduct.superMarketPrice,
    ];

    if (
      !editProduct.sku ||
      !editProduct.name ||
      !editProduct.brand ||
      !editProduct.category ||
      !editProduct.subCategory ||
      prices.some((price) => !price || parseFloat(price) <= 0)
    ) {
      setError("Please fill in all required fields with valid positive prices.");
      toast.error("Please fill in all required fields with valid positive prices.");
      return;
    }

    const data = {
      sku: editProduct.sku,
      name: editProduct.name,
      description: editProduct.description,
      brand: editProduct.brand,
      wholesalePrice: parseFloat(editProduct.wholesalePrice),
      distributorPrice: parseFloat(editProduct.distributorPrice),
      retailPrice: parseFloat(editProduct.retailPrice),
      customerPrice: parseFloat(editProduct.customerPrice),
      superMarketPrice: parseFloat(editProduct.superMarketPrice),
      category: editProduct.category,
      subCategory: editProduct.subCategory,
    };

    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Please log in.");

      let response;
      if (editProduct.imageFile) {
        const formData = new FormData();
        for (const [key, value] of Object.entries(data)) {
          formData.append(key, value);
        }
        formData.append("image", editProduct.imageFile);

        console.log("Submitting with image...");
        response = await axios.put(`${API_URL}/${product.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        console.log("Submitting without image...");
        response = await axios.put(`${API_URL}/${product.id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      if (response.status === 200 || response.status === 201) {
        toast.success("Product updated successfully!");
        navigate("/products");
      }
    } catch (error) {
      console.error("Error updating product:", error.response?.data || error.message);
      setError(error.response?.data?.detail || "Failed to update product. Please try again.");
      toast.error("Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/products");

  return (
    <div className="page-wrapper">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="row">
        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">
            <h6 className="fs-6 mb-4">Edit Product</h6>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleEditSubmit}>
              <div className="row mb-3 align-items-center">
                <div className="col-md-4">
                  <label className="form-label">
                    Product Image
                  </label>
                  {!editProduct.imageURL ? (
                    <div
                      className="d-flex align-items-center justify-content-center border border-dashed border-gray-300 rounded"
                      style={{ width: "100px", height: "100px", cursor: "pointer", background: "#f9f9f9" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <AddImage onImageSelect={handleImageSelect}>
                        <div className="text-center">
                          <Icon
                            icon="ic:baseline-photo-camera"
                            className="text-muted"
                            style={{ fontSize: "24px", cursor: "pointer" }}
                          />
                          <span className="text-muted d-block mt-1">Upload</span>
                        </div>
                      </AddImage>
                    </div>
                  ) : (
                    <div className="position-relative" style={{ width: "200px", height: "200px" }}>
                      <img
                        src={editProduct.imageURL}
                        alt="Product Preview"
                        className="rounded"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        className="position-absolute d-flex align-items-center justify-content-center rounded-circle"
                        style={{
                          top: "5px",
                          right: "5px",
                          width: "30px",
                          height: "30px",
                          padding: "0",
                          border: "none",
                          background: "transparent",
                          color: "#dc3545",
                        }}
                        onClick={() => setEditProduct({ ...editProduct, imageFile: null, imageURL: null })}
                      >
                        <Icon icon="ic:baseline-close" className="text-sm line-height-1" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="col-md-4">
                  <div>
                    <label className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={editProduct.name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={editProduct.description}
                      onChange={handleChange}
                      style={{ height: "42px" }}
                    />
                  </div>
                  <div>
                    <label className="form-label">
                      Category <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      name="category"
                      value={editProduct.category}
                      onChange={handleChange}
                      required
                      disabled={loading || !categories.length}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div>
                    <label className="form-label">
                      SKU <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="sku"
                      value={editProduct.sku}
                      onChange={handleChange}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="form-label">
                      Brand <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      name="brand"
                      value={editProduct.brand}
                      onChange={handleChange}
                      required
                      disabled={loading || !brands.length}
                    >
                      <option value="">Select Brand</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">
                      Sub-category <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      name="subCategory"
                      value={editProduct.subCategory}
                      onChange={handleChange}
                      required
                      disabled={loading || !editProduct.category || !subCategories.length}
                    >
                      <option value="">Select Subcategory</option>
                      {getFilteredSubCategories(editProduct.category).map((subCategory) => (
                        <option key={subCategory.id} value={subCategory.id}>
                          {subCategory.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="row mb-3 align-items-center">
                <div className="col-md-4">
                  <label className="form-label">
                    Wholesale Price <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="wholesalePrice"
                    value={editProduct.wholesalePrice}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    Distributor Price <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="distributorPrice"
                    value={editProduct.distributorPrice}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    Retail Price <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="retailPrice"
                    value={editProduct.retailPrice}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3 align-items-center">
                <div className="col-md-4">
                  <label className="form-label">
                    Customer Price <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="customerPrice"
                    value={editProduct.customerPrice}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    Supermarket Price <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="superMarketPrice"
                    value={editProduct.superMarketPrice}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              {error && <div className="text-danger mb-3">{error}</div>}
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
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

export default EditProduct;