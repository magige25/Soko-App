import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_URL = "https://api.bizchain.co.ke/v1/routes";
const SUBREGIONS_API_URL = "https://api.bizchain.co.ke/v1/sub-regions";

const AddRoute = () => {
  const navigate = useNavigate();
  const [newRoute, setNewRoute] = useState({ name: "", subRegionId: "" });
  const [subRegions, setSubRegions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSubRegions, setFetchingSubRegions] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const fetchSubRegions = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(SUBREGIONS_API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setSubRegions(response.data.data || []);
      } catch (error) {
        console.error("Error fetching sub-regions:", error);
        setError("Failed to load sub-regions");
      } finally {
        setFetchingSubRegions(false);
      }
    };
    fetchSubRegions();
  }, []);

  const handleAddRoute = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!newRoute.name.trim() || !newRoute.subRegionId) {
      setFormError("Please fill in all required fields before saving.");
      return;
    }

    const payload = {
      name: newRoute.name,
      subRegion: newRoute.subRegionId,
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
        toast.success("Route added successfully!");
        setNewRoute({ name: "", subRegionId: "" });
        navigate("/routes");
      }
    } catch (error) {
      console.error("Error adding route:", error);
      setFormError(error.response?.data?.message || "Failed to add route.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/routes");

  return (
    <div className="page-wrapper">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="row">
        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">
            <h6 className="fs-6 mb-4">Add Route</h6>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleAddRoute}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Route Name"
                    value={newRoute.name}
                    onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Sub-Region <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={newRoute.subRegionId}
                    onChange={(e) => setNewRoute({ ...newRoute, subRegionId: e.target.value })}
                    required
                    disabled={fetchingSubRegions}
                  >
                    <option value="">Select a Sub-Region</option>
                    {subRegions.length > 0 ? (
                      subRegions.map((subRegion) => (
                        <option key={subRegion.id} value={subRegion.id}>
                          {subRegion.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No sub-regions available</option>
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

export default AddRoute;