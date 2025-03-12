import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import AddImage from "./AddImage";
import { Icon } from "@iconify/react/dist/iconify.js";

const API_URL = "https://api.bizchain.co.ke/v1/products";
const BRAND_API = "https://api.bizchain.co.ke/v1/brands";
const CAT_API = "https://api.bizchain.co.ke/v1/categories";
const SUBCAT_API = "https://api.bizchain.co.ke/v1/sub-categories";

const AddProduct = () => {
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    imageFile: null,
    imageURL: null, // Renamed from imagePreview for consistency
    sku: "",
    name: "",
    description: "",
    brand: "",
    discountPrice: "",
    wholesalePrice: "", // Renamed from wPrice
    distributorPrice: "", // Renamed from dPrice
    retailPrice: "", // Renamed from rPrice
    category: "",
    subCategory: "",
  });

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoized fetch functions
  const fetchBrands = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
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
      const token = localStorage.getItem("token");
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
      const token = localStorage.getItem("token");
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

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchBrands(), fetchCategories(), fetchSubCategories()]);
      setLoading(false);
    };

    fetchData();
  }, [fetchBrands, fetchCategories, fetchSubCategories]);

  const handleImageSelect = (file, previewURL) => {
    setProductData({ ...productData, imageFile: file, imageURL: previewURL });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError("");

    const prices = [
      productData.discountPrice,
      productData.wholesalePrice,
      productData.distributorPrice,
      productData.retailPrice,      
    ];

    if (
      //!productData.imageFile ||
      !productData.sku ||
      !productData.name ||
      !productData.brand ||
      !productData.category ||
      !productData.subCategory ||      
      prices.some((price) => !price || parseFloat(price) <= 0)
    ) {
      setError("Please fill in all required fields with valid positive prices.");
      toast.error("Please fill in all required fields with valid positive prices.");
      return;
    }

    const data = {
      sku: productData.sku,
      name: productData.name,
      description: productData.description,
      brand: productData.brand,
      discountPrice: parseFloat(productData.discountPrice),
      wholesalePrice: parseFloat(productData.wholesalePrice),
      distributorPrice: parseFloat(productData.distributorPrice),
      retailPrice: parseFloat(productData.retailPrice),
      category: productData.category,
      subCategory: productData.subCategory,      
    };

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in.");

      let response;
      if (productData.imageFile) {
        const formData = new FormData();
        for (const [key, value] of Object.entries(data)) {
          formData.append(key, value);
        }
        formData.append("image", productData.imageFile);

        console.log("Submitting with image...");
        response = await axios.post(API_URL, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        console.log("Submitting without image...");
        response = await axios.post(API_URL, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      if (response.status === 200 || response.status === 201) {
        toast.success("Product added successfully!");
        setProductData({
          imageFile: null,
          imageURL: null,
          sku: "",
          name: "",
          description: "",
          brand: "",
          discountPrice: "",
          wholesalePrice: "",
          distributorPrice: "",
          retailPrice: "",
          category: "",
          subCategory: "",        
        });
        navigate("/products");
      }
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error.message);
      setError(error.response?.data?.detail || "Failed to add product. Please try again.");
      toast.error("Failed to add product.");
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
            <h6 className="fs-6 mb-4">Add Product</h6>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleAddProduct}>
              <div className="row mb-3 align-items-center">
                <div className="col-md-4">
                  <label className="form-label">
                    Product Image <span className="text-danger">*</span>
                  </label>
                  {!productData.imageURL ? (
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
                        src={productData.imageURL}
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
                        onClick={() => setProductData({ ...productData, imageFile: null, imageURL: null })}
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
                      value={productData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={productData.description}
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
                      value={productData.category}
                      onChange={handleChange}
                      required
                      disabled={loading}
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
                      value={productData.sku}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">
                      Brand <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      name="brand"
                      value={productData.brand}
                      onChange={handleChange}
                      required
                      disabled={loading}
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
                      value={productData.subCategory}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    >
                      <option value="">Select Subcategory</option>
                      {subCategories.map((subCategory) => (
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
                    value={productData.wholesalePrice}
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
                    value={productData.distributorPrice}
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
                    value={productData.retailPrice}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              {/* <div className="row mb-3 align-items-center">
              <div className="col-md-4">
                  <label className="form-label">
                    Discount Price <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="discountPrice"
                    value={productData.discountPrice}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>         */}
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

export default AddProduct;