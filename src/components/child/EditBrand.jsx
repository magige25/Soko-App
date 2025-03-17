import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_URL = "https://api.bizchain.co.ke/v1/brands";

const EditBrand = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { brand } = location.state || {};

  const [editBrand, setEditBrand] = useState({
    name: brand?.name || "",
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

  const handleEditBrand = async (e) => {
    e.preventDefault();
    setError("");

    if (!editBrand.name) {
      setError("Please fill in all required fields.");
      toast.error("Please fill in all required fields.");
      return;
    }

    // Modified to match API expectation
    const brandData = {
      brandRequests: [
        {
          name: editBrand.name,
        },
      ],
    };

    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Please log in.");

      const response = await axios.put(`${API_URL}/${brand.id}`, brandData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Brand updated successfully!");
        navigate("/brands");
      }
    } catch (error) {
      console.error("Error updating brand:", error.response?.data || error.message);
      setError(error.response?.data?.detail || "Failed to update brand. Please try again.");
      toast.error("Failed to update brand.");
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
                  />
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