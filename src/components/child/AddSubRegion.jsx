import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_URL = "https://api.bizchain.co.ke/v1/sub-regions";
const REGIONS_API_URL = "https://api.bizchain.co.ke/v1/regions";

const AddSubRegion = () => {
  const navigate = useNavigate();
  const [newSubRegion, setNewSubRegion] = useState({ name: "", region: "" });
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingRegions, setFetchingRegions] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");
        const response = await axios.get(REGIONS_API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setRegions(response.data.data || []);
      } catch (error) {
        console.error("Error fetching regions:", error);
        setError("Failed to load regions");
      } finally {
        setFetchingRegions(false);
      }
    };
    fetchRegions();
  }, []);

  const handleAddSubRegion = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!newSubRegion.name.trim() || !newSubRegion.region) {
      setFormError("Please fill in all required fields before saving.");
      return;
    }

    const payload = {
      name: newSubRegion.name,
      region: newSubRegion.region,
    };

    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(API_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Sub-Region added successfully!");
        setNewSubRegion({ name: "", region: "" });
        setTimeout(() => {
          navigate("/sub-regions");
         }, 2000);
      }
    } catch (error) {
      console.error("Error adding sub-region:", error);
      setFormError(error.response?.data?.message || "Failed to add sub-region.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/sub-regions");

  return (
    <div className="page-wrapper">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="row">
        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">
            <h6 className="fs-6 mb-4">Add Sub-Region</h6>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleAddSubRegion}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Sub-Region Name"
                    value={newSubRegion.name}
                    onChange={(e) => setNewSubRegion({ ...newSubRegion, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Region <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={newSubRegion.region}
                    onChange={(e) => setNewSubRegion({ ...newSubRegion, region: e.target.value })}
                    required
                    disabled={fetchingRegions}
                  >
                    <option value="">Select a Region</option>
                    {regions.length > 0 ? (
                      regions.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No regions available</option>
                    )}
                  </select>
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

export default AddSubRegion;