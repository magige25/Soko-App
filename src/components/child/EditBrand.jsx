import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Icon } from "@iconify/react/dist/iconify.js";
import AddImage from "./AddImage"; // Assuming this is in the same directory

const API_URL = "https://api.bizchain.co.ke/v1/brands";

const EditBrand = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { brand } = location.state || {};

  const [editBrand, setEditBrand] = useState({
    name: brand?.name || "",
    imageFile: null, 
    imageURL: brand?.photo || null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!brand) {
      toast.error("No brand selected to edit.");
      navigate("/brands");
      return;
    }
  }, [brand, navigate]);

  const handleImageSelect = (file, previewURL) => {
    setEditBrand({ ...editBrand, imageFile: file, imageURL: previewURL });
  };

  const handleEditBrand = async (e) => {
    e.preventDefault();
    setError("");

    if (!editBrand.name.trim()) {
      setError("Please fill in the brand name.");
      toast.error("Please fill in the brand name.");
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Please log in.");

      let response;
      const hasImage = editBrand.imageFile !== null; // Check if a new image is uploaded

      if (hasImage) {
        // Submit with multipart/form-data when there’s an image
        const formData = new FormData();
        formData.append("name", editBrand.name);
        formData.append("photo", editBrand.imageFile);

        console.log("Submitting with image...");
        response = await axios.put(`${API_URL}/${brand.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Submit with JSON if no new image is provided
        const brandData = {
          name: editBrand.name,
        };

        console.log("Submitting without image...");
        response = await axios.put(`${API_URL}/${brand.id}`, brandData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      if (response.status === 200 || response.status === 201) {
        toast.success("Brand updated successfully!");
        navigate("/brands");
      }
    } catch (error) {
      console.error("Error updating brand:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.detail || "Failed to update brand.";
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
            <h6 className="fs-6 mb-4">Edit Brand</h6>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleEditBrand}>
              <div className="row mb-3 align-items-center">
                <div className="col-md-4">
                  <label className="form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control w-100"
                    name="name"
                    placeholder="Enter Brand Name"
                    value={editBrand.name}
                    onChange={(e) => setEditBrand({ ...editBrand, name: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Brand Image</label>
                  {!editBrand.imageURL ? (
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
                    <div className="position-relative" style={{ width: "100px", height: "100px" }}>
                      <img
                        src={editBrand.imageURL}
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
                        onClick={() => handleImageSelect(null, null)} // Clear image
                        disabled={loading}
                      >
                        <Icon icon="ic:baseline-close" className="text-sm line-height-1" />
                      </button>
                    </div>
                  )}
                </div>
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

export default EditBrand;