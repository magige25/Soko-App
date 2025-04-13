import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_URL = "https://api.bizchain.co.ke/v1/sub-regions";
const REGIONS_API_URL = "https://api.bizchain.co.ke/v1/regions";

const EditSubRegion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [editSubRegion, setEditSubRegion] = useState({ id: null, name: "", region: "" });
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingRegions, setFetchingRegions] = useState(true);
  const [fetchingSubRegion, setFetchingSubRegion] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const subRegionId = location.state?.subRegionId || id;

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

    const fetchSubRegion = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");
        const response = await axios.get(`${API_URL}/${subRegionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const subRegion = response.data?.data ||response.data;
        setEditSubRegion({
          id: subRegion.id,
          name: subRegion.name || "",
          region: subRegion.region?.id || "",
        });
      } catch (error) {
        console.error("Error fetching sub-region:", error);
        setError(error.response?.data?.message || "Failed to load sub-region");
      } finally {
        setFetchingSubRegion(false);
      }
    };

    fetchRegions();
    fetchSubRegion();
  }, [location.state, id]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!editSubRegion.name.trim() || !editSubRegion.region) {
      setFormError("Please fill in all required fields before saving.");
      return;
    }

    const payload = {
      name: editSubRegion.name,
      region: editSubRegion.region,
    };

    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(`${API_URL}/${editSubRegion.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        setEditSubRegion({ id: null, name: "", region: "" });
        toast.success("Sub-Region updated successfully!");
        setTimeout(() => navigate("/sub-regions"),2000);
      }
    } catch (error) {
      console.error("Error updating sub-region:", error);
      setFormError(error.response?.data?.message || "Failed to update sub-region.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/sub-regions");

  if (fetchingSubRegion || fetchingRegions) return <div>Loading...</div>;
  if (error && !editSubRegion.id) return <div>Error: {error}</div>;

  return (
    <div className="page-wrapper">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="row">
        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">
            <h6 className="fs-6 mb-4">Edit Sub-Region</h6>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleEditSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Sub-Region Name"
                    value={editSubRegion.name}
                    onChange={(e) => setEditSubRegion({ ...editSubRegion, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Region <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={editSubRegion.region}
                    onChange={(e) => setEditSubRegion({ ...editSubRegion, region: e.target.value })}
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

export default EditSubRegion;