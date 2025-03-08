import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import AddImage from "./AddImage";
import { Icon } from "@iconify/react/dist/iconify.js";

const API_URL = "https://api.bizchain.co.ke/v1/products";
const UoM_API_URL = "https://api.bizchain.co.ke/v1/unit-of-measure";

const EditProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { product } = location.state || {};

  // Initialize state with product data or fallback values
  const [editProduct, setEditProduct] = useState(
    product
      ? {
          imageFile: null,
          imageURL: product.imageUrl || null, // Renamed from imagePreview for clarity
          sku: product.sku || "",
          name: product.name || "",
          description: product.description || "",
          uom: product.uom?.id || "",
          pricePerPiece: product.pricePerPiece || "",
          pricePerUoM: product.pricePerUoM || "",
          piecesPerUoM: product.piecesPerUoM || "",
          wPrice: product.wPrice || "",
          dPrice: product.dPrice || "",
          rPrice: product.rPrice || "",
          category: product.category || "",
          subCategory: product.subCategory || "",
        }
      : {
          imageFile: null,
          imageURL: null,
          sku: "",
          name: "",
          description: "",
          uom: "",
          pricePerPiece: "",
          piecesPerUoM: "",
          pricePerUoM: "",
          wPrice: "",
          dPrice: "",
          rPrice: "",
          category: "",
          subCategory: "",
        }
  );

  const [unitsOfMeasure, setUnitsOfMeasure] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingUnitsOfMeasure, setFetchingUnitsOfMeasure] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");

  // Fetch units of measure on mount
  useEffect(() => {
    const fetchUnitsOfMeasure = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }
        const response = await axios.get(UoM_API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("UnitsOfMeasure API response:", response.data.data);

        if (Array.isArray(response.data.data)) {
          setUnitsOfMeasure(response.data.data);
        } else if (response.data.data && typeof response.data.data === "object") {
          setUnitsOfMeasure([response.data.data]);
        } else {
          throw new Error("Unexpected API response format");
        }
      } catch (error) {
        console.error("Error fetching unitsOfMeasure:", error);
        setError("Failed to load units of measure");
      } finally {
        setFetchingUnitsOfMeasure(false);
      }
    };

    fetchUnitsOfMeasure();

    // Redirect if no product is provided
    if (!product) {
      toast.error("No product selected to edit.");
      navigate("/products");
    }
  }, [product, navigate]);

  // Handle image selection
  const handleImageSelect = (file, previewURL) => {
    setEditProduct({ ...editProduct, imageFile: file, imageURL: previewURL });
  };

  // Generalized change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({ ...editProduct, [name]: value });
  };

  // Handle form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validate required fields (imageFile is optional in edit)
    if (
      !editProduct.sku ||
      !editProduct.name ||
      !editProduct.uom ||
      !editProduct.pricePerPiece ||
      !editProduct.pricePerUoM ||
      !editProduct.piecesPerUoM ||
      !editProduct.wPrice ||
      !editProduct.dPrice ||
      !editProduct.rPrice ||
      !editProduct.category ||
      !editProduct.subCategory
    ) {
      setFormError("Please fill in all required fields before saving.");
      toast.error("Please fill in all required fields before saving.");
      return;
    }

    const formData = new FormData();
    formData.append("sku", editProduct.sku);
    formData.append("name", editProduct.name);
    formData.append("description", editProduct.description); // Fixed from name
    formData.append("uom", editProduct.uom);
    formData.append("pricePerPiece", parseFloat(editProduct.pricePerPiece));
    formData.append("pricePerUoM", parseFloat(editProduct.pricePerUoM));
    formData.append("piecesPerUoM", parseInt(editProduct.piecesPerUoM));
    formData.append("wPrice", parseFloat(editProduct.wPrice));
    formData.append("dPrice", parseFloat(editProduct.dPrice));
    formData.append("rPrice", parseFloat(editProduct.rPrice));
    formData.append("category", editProduct.category);
    formData.append("subCategory", editProduct.subCategory);
    if (editProduct.imageFile) {
      formData.append("image", editProduct.imageFile); // Only append if new image
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in.");
      }

      const response = await axios.put(`${API_URL}/${product.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Product updated successfully!");
        navigate("/products");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setFormError("Failed to update product. Please try again.");
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
              {/* First Row: Image, Name/Description/Category, SKU/UoM/SubCategory */}
              <div className="row mb-3 align-items-center">
                {/* Image */}
                <div className="col-md-4">
                  <label className="form-label">
                    Product Image <span className="text-danger">*</span>
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
                            aria-label="Upload product image"
                            tabIndex={0}
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
                        aria-label="Remove image"
                      >
                        <Icon icon="ic:baseline-close" className="text-sm line-height-1" />
                      </button>
                    </div>
                  )}
                </div>
                {/* Name, Description, Category */}
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
                      disabled
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
                    <input
                      type="number"
                      className="form-control"
                      name="category"
                      value={editProduct.category}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                {/* SKU, UoM, SubCategory */}
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
                      UoM <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      name="uom"
                      value={editProduct.uom}
                      onChange={handleChange}
                      required
                      disabled={fetchingUnitsOfMeasure}
                    >
                      <option value="">Select UoM</option>
                      {unitsOfMeasure.length > 0 ? (
                        unitsOfMeasure.map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unit.name}
                          </option>
                        ))
                      ) : (
                        <option value="">No UnitsOfMeasure available</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">
                      Sub-Category <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="subCategory"
                      value={editProduct.subCategory}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Second Row: Price/UoM, Pieces/UoM, Price/Piece */}
              <div className="row mb-3 align-items-center">
                <div className="col-md-4">
                  <label className="form-label">
                    Price/UoM <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="pricePerUoM"
                    value={editProduct.pricePerUoM}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    Pieces/UoM <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="piecesPerUoM"
                    value={editProduct.piecesPerUoM}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    Price/Piece <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="pricePerPiece"
                    value={editProduct.pricePerPiece}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Third Row: Wholesale, Distributor, Retail Prices */}
              <div className="row mb-3 align-items-center">
                <div className="col-md-4">
                  <label className="form-label">
                    Wholesale Price <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="wPrice"
                    value={editProduct.wPrice}
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
                    name="dPrice"
                    value={editProduct.dPrice}
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
                    name="rPrice"
                    value={editProduct.rPrice}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {formError && <div className="text-danger mb-3">{formError}</div>}
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
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