import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_URL = "https://api.bizchain.co.ke/v1/regions";
const COUNTRIES_API_URL = "https://api.bizchain.co.ke/v1/countries";

const AddRegion = () => {
  const navigate = useNavigate();
  const [newRegion, setNewRegion] = useState({ name: "", countryCode: "" });
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCountries, setFetchingCountries] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
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
    fetchCountries();
  }, []);

  const handleAddRegion = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!newRegion.name.trim() || !newRegion.countryCode) {
      setFormError("Please fill in all required fields before saving.");
      return;
    }

    const payload = {
      name: newRegion.name,
      countryCode: newRegion.countryCode,
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
        toast.success("Region added successfully!");
        setNewRegion({ name: "", countryCode: "" });
        setTimeout(() => {
         navigate("/regions");
        }, 2000);
      }
    } catch (error) {
      console.error("Error adding region:", error);
      setFormError(error.response?.data?.message || "Failed to add region.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/regions");

  return (
    <div className="page-wrapper">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="row">
        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">
            <h6 className="fs-6 mb-4">Add Region</h6>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleAddRegion}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Region Name"
                    value={newRegion.name}
                    onChange={(e) => setNewRegion({ ...newRegion, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Country <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={newRegion.countryCode}
                    onChange={(e) => setNewRegion({ ...newRegion, countryCode: e.target.value })}
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

export default AddRegion;