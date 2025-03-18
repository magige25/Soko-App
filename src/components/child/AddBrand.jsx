import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Icon } from "@iconify/react/dist/iconify.js";
import AddImage from "./AddImage"; // Assuming this is in the same directory

const API_URL = "https://api.bizchain.co.ke/v1/brands";

const AddBrand = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([{ name: "", imageFile: null, imageURL: null }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddBrandField = () => {
    setBrands([...brands, { name: "", imageFile: null, imageURL: null }]);
  };

  const handleBrandChange = (index, field, value) => {
    const updatedBrands = [...brands];
    updatedBrands[index][field] = value;
    setBrands(updatedBrands);
  };

  const handleImageSelect = (index, file, previewURL) => {
    const updatedBrands = [...brands];
    updatedBrands[index].imageFile = file;
    updatedBrands[index].imageURL = previewURL;
    setBrands(updatedBrands);
  };

  const handleRemoveBrand = (index) => {
    if (brands.length > 1) {
      const updatedBrands = brands.filter((_, i) => i !== index);
      setBrands(updatedBrands);
    }
  };

  const handleAddBrands = async (e) => {
    e.preventDefault();
    setError("");

    if (brands.some((brand) => !brand.name.trim())) {
      setError("Please fill in all brand names.");
      toast.error("Please fill in all brand names.");
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Please log in.");

      // Check if any brand has an image
      const hasImage = brands.some((brand) => brand.imageFile);

      if (hasImage) {
        // Use FormData for multipart submission
        const formData = new FormData();
        brands.forEach((brand, index) => {
          formData.append(`brandRequests[${index}].name`, brand.name);
          if (brand.imageFile) {
            formData.append(`brandRequests[${index}].photo`, brand.imageFile);
          }
        });

        console.log("Submitting with image(s)...");
        const response = await axios.post(API_URL, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200 || response.status === 201) {
          toast.success("Brands added successfully!");
          setBrands([{ name: "", imageFile: null, imageURL: null }]);
          navigate("/brands");
        }
      } else {
        // Use JSON for no-image submission
        const brandData = {
          brandRequests: brands.map((brand) => ({ name: brand.name })),
        };

        console.log("Submitting without images...");
        const response = await axios.post(API_URL, brandData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200 || response.status === 201) {
          toast.success("Brands added successfully!");
          setBrands([{ name: "", imageFile: null, imageURL: null }]);
          navigate("/brands");
        }
      }
    } catch (error) {
      console.error("Error adding brands:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.detail || "Failed to add brands.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/brands");

  return (
    <div className="page-wrapper">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="row">
        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">
            <h6 className="fs-6 mb-4">Add Brands</h6>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleAddBrands}>
              <div className="mb-3">
                {brands.map((brand, index) => (
                  <div key={index} className="row mb-4 align-items-center">
                    <div className="col-md-2">
                      <label className="form-label"></label>
                      {!brand.imageURL ? (
                        <div
                          className="d-flex align-items-center justify-content-center border border-dashed border-gray-300 rounded"
                          style={{ width: "100px", height: "100px", cursor: "pointer", background: "#f9f9f9" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <AddImage onImageSelect={(file, previewURL) => handleImageSelect(index, file, previewURL)}>
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
                        <div className="position-relative" style={{ width: "100px", height: "100px" }}>
                          <img
                            src={brand.imageURL}
                            alt="Brand Preview"
                            className="rounded"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                          <button
                            type="button"
                            className="position-absolute d-flex align-items-center justify-content-center rounded-circle"
                            style={{
                              top: "5px",
                              right: "5px",
                              width: "20px",
                              height: "20px",
                              padding: "0",
                              border: "none",
                              background: "transparent",
                              color: "#dc3545",
                            }}
                            onClick={() =>
                              handleImageSelect(index, null, null)
                            }
                          >
                            <Icon icon="ic:baseline-close" className="text-sm line-height-1" />
                          </button>
                        </div>
                      )}
                    </div>                    
                    <div className="col-md-4">
                      <label className="form-label">
                        Brand Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Brand Name"
                        value={brand.name}
                        onChange={(e) => handleBrandChange(index, "name", e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    
                    <div className="col-md-2 d-flex align-items-end">
                      {index === brands.length - 1 && (
                        <button
                          type="button"
                          className="btn p-4"
                          style={{ background: "transparent", border: "none" }}
                          onClick={handleAddBrandField}
                          disabled={loading}
                        >
                          <Icon icon="ic:baseline-plus" width="20" color="#007bff" />
                        </button>
                      )}
                      {brands.length > 1 && index !== brands.length - 1 && (
                        <button
                          type="button"
                          className="btn p-0 ms-2"
                          onClick={() => handleRemoveBrand(index)}
                          disabled={loading}
                        >
                          <Icon icon="ic:baseline-close" width="20" color="#dc3545" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Saving..." : "Save All"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBrand;