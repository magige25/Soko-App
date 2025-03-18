import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_URL = "https://api.bizchain.co.ke/v1/depots";
const REGION_API = "https://api.bizchain.co.ke/v1/regions";
const SUB_REGION_API = "https://api.bizchain.co.ke/v1/sub-regions";

const EditDepotPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [depot, setDepot] = useState({ name: "", regionId: "", subRegionId: "" });
  const [regions, setRegions] = useState([]);
  const [subRegions, setSubRegions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [depotRes, regionsRes, subRegionsRes] = await Promise.all([
          axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(REGION_API, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(SUB_REGION_API, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setDepot(depotRes.data.data || {});
        setRegions(regionsRes.data.data || []);
        const subRegionsData = (subRegionsRes.data.data || []).map((sr) => ({
          ...sr,
          regionId: sr.region.id,
        }));
        setSubRegions(subRegionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load depot data.");
        toast.error("Failed to load depot data.");
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/${id}`,
        {
          name: depot.name,
          regionId: parseInt(depot.regionId),
          subRegionId: parseInt(depot.subRegionId),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Depot updated successfully!");
      navigate("/depots");
    } catch (error) {
      console.error("Error updating depot:", error);
      setError("Failed to update depot.");
      toast.error("Failed to update depot.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/depots");

  const filteredSubRegions = subRegions.filter(
    (subRegion) => subRegion.regionId === parseInt(depot.regionId)
  );

  return (
    <div className="page-wrapper">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="row">
        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">
            <h6 className="fs-6 mb-4">Edit Depot</h6>
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
                    value={depot.name}
                    onChange={(e) => setDepot({ ...depot, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Region <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={depot.regionId}
                    onChange={(e) =>
                      setDepot({ ...depot, regionId: e.target.value, subRegionId: "" })
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
                    value={depot.subRegionId}
                    onChange={(e) => setDepot({ ...depot, subRegionId: e.target.value })}
                    required
                    disabled={!depot.regionId || filteredSubRegions.length === 0}
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
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDepotPage;