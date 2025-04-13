import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_URL = "https://api.bizchain.co.ke/v1/regions";
const COUNTRIES_API_URL = "https://api.bizchain.co.ke/v1/countries";

const EditRegion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [editRegion, setEditRegion] = useState({ id: null, name: "", countryCode: "" });
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCountries, setFetchingCountries] = useState(true);
  const [fetchingRegion, setFetchingRegion] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const regionId = location.state?.regionId || id;
    if (!regionId) {
      setError("No region ID provided");
      setFetchingRegion(false);
      return;
    }

    const fetchCountries = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");
        const response = await axios.get(COUNTRIES_API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setCountries(response.data.data || []);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setError("Failed to load countries");
      } finally {
        setFetchingCountries(false);
      }
    };

    const fetchRegion = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");
        const response = await axios.get(`${API_URL}/${regionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const region = response.data?.data || response.data;
        if (!region) throw new Error("Region not found");
        setEditRegion({
          id: region.id,
          name: region.name || "",
          countryCode: region.country?.code || "",
        });
      } catch (error) {
        console.error("Error fetching region:", error);
        setError(error.response?.data?.message || "Failed to load region");
      } finally {
        setFetchingRegion(false);
      }
    };

    fetchCountries();
    fetchRegion();
  }, [location.state, id]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!editRegion.name.trim() || !editRegion.countryCode) {
      setFormError("Please fill in all required fields before saving.");
      return;
    }

    const payload = {
      name: editRegion.name,
      countryCode: editRegion.countryCode,
    };

    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(`${API_URL}/${editRegion.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        setEditRegion({ id: null, name: "", countryCode: "" });
        toast.success("Region updated successfully!");
        setTimeout(() => navigate("/regions"), 2000);
      }
    } catch (error) {
      console.error("Error updating region:", error);
      setFormError(error.response?.data?.message || "Failed to update region.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/regions");

  if (fetchingRegion || fetchingCountries) return <div>Loading...</div>;
  if (error && !editRegion.id) return <div>Error: {error}</div>;

  return (
    <div className="page-wrapper">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="row">
        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">
            <h6 className="fs-6 mb-4">Edit Region</h6>
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
                    placeholder="Enter Region Name"
                    value={editRegion.name}
                    onChange={(e) => setEditRegion({ ...editRegion, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Country <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={editRegion.countryCode}
                    onChange={(e) => setEditRegion({ ...editRegion, countryCode: e.target.value })}
                    required
                    disabled={fetchingCountries}
                  >
                    <option value="">Select a Country</option>
                    {countries.length > 0 ? (
                      countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No countries available</option>
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

export default EditRegion;