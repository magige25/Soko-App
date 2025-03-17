import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Icon } from "@iconify/react/dist/iconify.js";

const API_URL = "https://api.bizchain.co.ke/v1/brands";

const AddBrand = () => {
  const navigate = useNavigate();

  // State now holds an array of brand objects
  const [brands, setBrands] = useState([{ name: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddBrandField = () => {
    setBrands([...brands, { name: "" }]);
  };

  const handleBrandChange = (index, value) => {
    const updatedBrands = [...brands];
    updatedBrands[index].name = value;
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

    // Check if any brand name is empty
    if (brands.some((brand) => !brand.name.trim())) {
      setError("Please fill in all brand names.");
      toast.error("Please fill in all brand names.");
      return;
    }

    const brandData = {
      brandRequests: brands.map((brand) => ({ name: brand.name })),
    };

    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Please log in.");

      const response = await axios.post(API_URL, brandData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Brands added successfully!");
        setBrands([{ name: "" }]); // Reset to single empty field
        navigate("/brands");
      }
    } catch (error) {
      console.error("Error adding brands:", error.response?.data || error.message);
      setError(error.response?.data?.detail || "Failed to add brands. Please try again.");
      toast.error("Failed to add brands.");
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
                  <div key={index} className="row mb-2 align-items-center">
                    <div className="col-md-8">
                      <label className="form-label">
                        Brand Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Brand Name"
                        value={brand.name}
                        onChange={(e) => handleBrandChange(index, e.target.value)}
                        required
                      />
                    </div>
                    {index === brands.length - 1 && (
                      <div className="col-md-2 d-flex align-items-end">
                        <button
                          type="button"
                          className="btn p-0 mt-5"
                          style={{background: "transparent", border: "none"}}
                          onClick={handleAddBrandField}
                          disabled={loading}
                        >
                          <Icon icon="ic:baseline-plus" width="20" color="#007bff"/>
                          
                        </button>
                      </div>
                    )}
                    {brands.length > 1 && index !== brands.length - 1 && (
                      <div className="col-md-2 d-flex align-items-end">
                        <button
                          type="button"
                          className="btn p-0 mt-0"
                          onClick={() => handleRemoveBrand(index)}
                          disabled={loading}
                        >
                          <Icon icon="ic:baseline-close" width="20" color="#dc3545"/>
                        </button>
                      </div>
                    )}
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