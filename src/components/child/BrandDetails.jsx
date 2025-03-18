import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_URL = "https://api.bizchain.co.ke/v1/brands";

const BrandDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const location = useLocation();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getFullYear();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";
    return `${day}${suffix} ${month} ${year}`;
  };

  
  useEffect(() => {
    const fetchBrand = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Please log in.");

        // Check if brand data was passed via state (from BrandsLayer)
        const stateBrand = location.state?.brand;
        if (stateBrand) {
          setBrand(stateBrand);
          setLoading(false);
          return;
        }

        // Otherwise, fetch from API
        const response = await axios.get(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBrand(response.data.data); 
      } catch (error) {
        console.error("Error fetching brand:", error);
        const errorMessage = error.response?.data?.message || "Failed to load brand details.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [id, location.state]);

  const handleBack = () => navigate("/brands");

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="row">
          <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
            <div className="card-body text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <Toaster position="top-center" reverseOrder={false} />
        <div className="row">
          <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
            <div className="card-body">
              <div className="alert alert-danger">{error}</div>
              <button className="btn btn-secondary" onClick={handleBack}>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="page-wrapper">
        <div className="row">
          <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
            <div className="card-body">
              <p>No brand data available.</p>
              <button className="btn btn-secondary" onClick={handleBack}>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="row">
        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">          
              <h6 className="fs-6 mb-4">Brand Details</h6>
            <div className="row">
              {/* Brand Image */}
              <div className="col-md-4">
                <label className="form-label fw-bold"></label>
                {brand.photo ? (
                  <img
                    src={brand.photo}
                    alt={brand.name}
                    className="rounded"
                    style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center border border-dashed border-gray-300 rounded text-muted"
                    style={{ width: "200px", height: "200px", background: "#f9f9f9" }}
                  >
                    No Image
                  </div>
                )}
              </div>

              {/* Brand Details */}
              <div className="col-md-8">
                <div className="mb-3">
                  <label className="form-label fw-bold">Name</label>
                  <p>{brand.name || "N/A"}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Date Created</label>
                  <p>{formatDate(brand.dateCreated)}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Last Updated</label>
                  <p>{formatDate(brand.dateLastUpdated)}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Created By</label>
                  <p>{brand.createdBy?.name || "N/A"}</p>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleBack}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDetails;