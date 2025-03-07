import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import AddImage from "./AddImage"; 
import { Icon } from "@iconify/react/dist/iconify.js";

const API_URL = "https://api.bizchain.co.ke/v1/products";
const UoM_API_URL = "https://api.bizchain.co.ke/v1/unit-of-measure";

const AddProduct = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    imageFile: null,
    imagePreview: null,
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
  });

  const [unitsOfMeasure, setUnitsOfMeasure] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingUnitsOfMeasure, setFetchingUnitsOfMeasure] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const fetchUnitsOfMeasure = async () => {
      try {
        const token = localStorage.getItem("token");
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
        setError("Failed to load unitsOfMeasure");
      } finally {
        setFetchingUnitsOfMeasure(false);
      }
    };

    fetchUnitsOfMeasure();
  }, []);

  const handleImageSelect = (file, previewURL) => {
    setProductData({ ...productData, imageFile: file, imagePreview: previewURL });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setFormError("");

    if (
      !productData.imageFile ||
      !productData.sku ||
      !productData.name ||
      !productData.uom ||
      !productData.pricePerPiece ||
      !productData.pricePerUoM ||
      !productData.pricePerPiece ||
      !productData.piecesPerUoM ||
      !productData.wPrice ||
      !productData.dPrice ||
      !productData.rPrice ||
      !productData.category ||
      !productData.subCategory      
    ) {
      setFormError("Please fill in all required fields, including an image, before saving.");
      toast.error("Please fill in all required fields before saving.");
      return;
    }

    const formData = new FormData();
    formData.append("image", productData.imageFile);
    formData.append("sku", productData.sku);
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("uom", productData.uom);
    formData.append("pricePerPiece", parseFloat(productData.pricePerPiece));
    formData.append("pricePerUoM", parseFloat(productData.pricePerUoM));
    formData.append("piecesPerUoM", parseInt(productData.piecesPerUoM));
    formData.append("wPrice", parseFloat(productData.wPrice));
    formData.append("dPrice", parseFloat(productData.dPrice));
    formData.append("rPrice", parseFloat(productData.rPrice));
    formData.append("category", productData.category);
    formData.append("subCategory", productData.subCategory);    

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Product added successfully!");
        setProductData({
          imageFile: null,
          imagePreview: null,
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
        });
        navigate("/products");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setFormError("Failed to add product. Please try again.");
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
              {/* imageFile and imagePreview */}
              <div className="row mb-3 align-items-center">
              {/* First Column: Image Upload/Preview */}
              <div className="col-md-4">
                <label className="form-label">
                  Product Image <span className="text-danger">*</span>
                </label>
                {!productData.imagePreview ? (
                  // <AddImage onImageSelect={handleImageSelect}>
                    <div
                      className="d-flex align-items-center justify-content-center border border-dashed border-gray-300 rounded"
                      style={{ width: "100px", height: "100px", cursor: "pointer", background: "#f9f9f9" }}
                      onClick={(e) => e.stopPropagation()}                      
                    >
                      <AddImage onImageSelect={handleImageSelect}>
                      <div className="text-center">                      
                        <Icon 
                        icon="ic:baseline-photo-camera" 
                        className="text-muted" style={{ fontSize: "24px", cursor: "pointer" }} 
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
                      src={productData.imagePreview}
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
                      onClick={() => setProductData({ ...productData, imageFile: null, imagePreview: null })}
                      aria-label="Remove image"
                    >
                      <Icon icon="ic:baseline-close" className="text-sm line-height-1" />
                    </button>
                  </div>
                )}
              </div>
              {/* Second Column: */}
              {/* Name and description */}
              <div className="col-md-4">
                <div>
                  <div>
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={productData.name || ""}
                      onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                    />
                  </div>                  
                  <div>
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={productData.description || ""}
                      onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                      style={{height: "42px"}}
                    />
                  </div>
                  <div>
                  <label className="form-label">
                    Category <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={productData.category}
                    onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                    required
                  />
                </div>
                </div>
              </div>              
              {/* Third Column: SKU and UoM */}
              <div className="col-md-4">
                <div>
                <div>
                    <label className="form-label">SKU</label>
                    <input
                      type="text"
                      className="form-control"
                      value={productData.sku || ""}
                      onChange={(e) => setProductData({ ...productData, sku: e.target.value })}
                    />
                </div>                
                </div>
                <div>
                <div>
                  <label className="form-label">
                    UoM <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={productData.uom}
                    onChange={(e) => setProductData({ ...productData, uom: e.target.value })}
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
                </div>
                <div>
                <div>
                  <label className="form-label">
                    Sub-Category <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={productData.subCategory}
                    onChange={(e) => setProductData({ ...productData, subCategory: e.target.value })}
                    required
                  />
                </div>
                </div>
              </div>
              </div>
              {/* pricePerUoM, piecesPerUoM, pricePerPiece  */}
              <div className="row mb-3 align-items-center">
                <div className="col-md-4">
                  <label className="form-label">
                    Price/UoM <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={productData.pricePerUoM}
                    onChange={(e) => setProductData({ ...productData, pricePerUoM: e.target.value })}
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
                    value={productData.piecesPerUoM}
                    onChange={(e) => setProductData({ ...productData, piecesPerUoM: e.target.value })}
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
                    value={productData.pricePerPiece}
                    onChange={(e) => setProductData({ ...productData, pricePerPiece: e.target.value })}
                    required
                  />
                </div>
              </div>
              {/* wSalePrice, dPrice, rPrice */}
              <div className="row mb-3 align-items-center">
              <div className="col-md-4">
                  <label className="form-label">
                    Wholesale Price <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={productData.wPrice}
                    onChange={(e) => setProductData({ ...productData, wPrice: e.target.value })}
                    required
                  />
                </div>                
                <div className="col-md-4">
                  <label className="form-label">
                    Distributor Price<span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={productData.dPrice}
                    onChange={(e) => setProductData({ ...productData, dPrice: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    Retail Price<span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={productData.rPrice}
                    onChange={(e) => setProductData({ ...productData, rPrice: e.target.value })}
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

export default AddProduct;