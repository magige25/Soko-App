import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_URL = "https://api.bizchain.co.ke/v1/depots";
const REGION_API = "https://api.bizchain.co.ke/v1/regions";
const SUB_REGION_API = "https://api.bizchain.co.ke/v1/sub-regions";

const AddDepotPage = () => {
  const navigate = useNavigate();
  const [newDepot, setNewDepot] = useState({
    name: "",
    regionId: "",
    subRegionId: "",
  });
  const [regions, setRegions] = useState([]);
  const [subRegions, setSubRegions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(REGION_API, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRegions(response.data.data || []);
      } catch (error) {
        console.error("Error fetching regions:", error);
        setError("Failed to load regions");
      }
    };

    const fetchSubRegions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(SUB_REGION_API, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const subRegionsData = (response.data.data || []).map((subRegion) => ({
          ...subRegion,
          regionId: subRegion.region.id,
        }));
        setSubRegions(subRegionsData);
      } catch (error) {
        console.error("Error fetching sub-regions:", error);
        setError("Failed to load sub-regions");
      }
    };

    fetchRegions();
    fetchSubRegions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        API_URL,
        {
          name: newDepot.name,
          regionId: parseInt(newDepot.regionId),
          subRegionId: parseInt(newDepot.subRegionId),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Depot added successfully!");
        setNewDepot({ name: "", regionId: "", subRegionId: "" });
        navigate("/depots");
      }
    } catch (error) {
      console.error("Error adding depot:", error);
      setError("Failed to add depot. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/depots");

  const filteredSubRegions = subRegions.filter(
    (subRegion) => subRegion.regionId === parseInt(newDepot.regionId)
  );

  return (
    <div className="page-wrapper">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="row">
        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">
            <h6 className="fs-6 mb-4">Add Depot</h6>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">
                    Depot Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={newDepot.name}
                    onChange={(e) => setNewDepot({ ...newDepot, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Region <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={newDepot.regionId}
                    onChange={(e) =>
                      setNewDepot({ ...newDepot, regionId: e.target.value, subRegionId: "" })
                    }
                    required
                  >
                    <option value="">Select a region</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">
                    Sub-Region <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={newDepot.subRegionId}
                    onChange={(e) =>
                      setNewDepot({ ...newDepot, subRegionId: e.target.value })
                    }
                    required
                    disabled={!newDepot.regionId || filteredSubRegions.length === 0}
                  >
                    <option value="">Select a sub-region</option>
                    {filteredSubRegions.map((subRegion) => (
                      <option key={subRegion.id} value={subRegion.id}>
                        {subRegion.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
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

export default AddDepotPage;