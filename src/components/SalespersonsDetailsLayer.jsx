import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://api.bizchain.co.ke/v1/salesperson";
const REGIONS_API = "https://api.bizchain.co.ke/v1/regions";
const COUNTRIES_API = "https://api.bizchain.co.ke/v1/countries";

const SalespersonsDetailsLayer = () => {
  const location = useLocation();
  const salespersonId = location.state?.salespersonId;
  const navigate = useNavigate();
  const [viewSalesperson, setViewSalesperson] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!salespersonId) {
      navigate("/salespersons");
      return;
    }

    const parsedId = parseInt(salespersonId, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      setError("Invalid salesperson ID: Must be a positive number");
      setIsLoading(false);
      return;
    }

    const fetchSalespersonDetails = async () => {
      const token = sessionStorage.getItem("token");
      if (!token || token.trim() === "") {
        setError("No authentication token found. Please log in.");
        navigate("/login");
        setIsLoading(false);
        return null;
      }

      const url = `${API_URL}/${parsedId}`;
      console.log("Fetching from URL:", url);
      console.log("Token:", token);

      try {
        const [salespersonRes, regionsRes, countriesRes] = await Promise.all([
          axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(REGIONS_API, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(COUNTRIES_API, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const data = salespersonRes.data;
        console.log("Full API Response:", data);

        if (data.status && data.status.code === 0 && data.data) {
          const salesperson = data.data;

          // Derive countryCode from the salesperson's region
          let derivedCountryCode = "";
          let countryName = "N/A";
          if (salesperson.region?.id && regionsRes.data.status.code === 0) {
            const matchingRegion = regionsRes.data.data.find(
              (region) => region.id === salesperson.region.id
            );
            derivedCountryCode = matchingRegion?.country?.code || "";
            if (derivedCountryCode && countriesRes.data.status.code === 0) {
              const matchingCountry = countriesRes.data.data.find(
                (country) => country.code === derivedCountryCode
              );
              countryName = matchingCountry?.name || "N/A";
            }
          }

          return {
            id: salesperson.id,
            firstName: salesperson.firstName || "N/A",
            lastName: salesperson.lastName || "N/A",
            phoneNumber: salesperson.phoneNo || "N/A",
            email: salesperson.email || "N/A",
            country: countryName,
            region: salesperson.region?.name || "N/A",
            route: salesperson.route?.name || "N/A",
            dateCreated: salesperson.dateCreated?.split("T")[0] || "N/A",
          };
        } else {
          setError("No valid salesperson data found in response");
          return null;
        }
      } catch (error) {
        console.error("Error fetching salesperson details:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        setError(`Error fetching salesperson details: ${error.response?.data?.message || error.message}`);
        return null;
      }
    };

    const loadSalespersonDetails = async () => {
      setIsLoading(true);
      const detailedSalesperson = await fetchSalespersonDetails();
      setViewSalesperson(detailedSalesperson);
      setIsLoading(false);
    };
    loadSalespersonDetails();
  }, [salespersonId, navigate]);

  // Always return valid JSX
  if (isLoading) {
    return (
      <div className="page-wrapper">
        <div className="row">
          <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
            <div className="card-body">
              <p>Loading salesperson details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !viewSalesperson) {
    return (
      <div className="page-wrapper">
        <div className="row">
          <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {!error && !viewSalesperson && <p>No salesperson data available.</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="row">
        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Full Name</label>
                  <p className="text-muted">{`${viewSalesperson.firstName} ${viewSalesperson.lastName}`}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Phone Number</label>
                  <p className="text-muted">{viewSalesperson.phoneNumber}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Country</label>
                  <p className="text-muted">{viewSalesperson.country}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Date Created</label>
                  <p className="text-muted">{viewSalesperson.dateCreated}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Email</label>
                  <p className="text-muted">{viewSalesperson.email}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Region</label>
                  <p className="text-muted">{viewSalesperson.region}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Route</label>
                  <p className="text-muted">{viewSalesperson.route}</p>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-secondary" onClick={() => navigate("/salespersons")}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalespersonsDetailsLayer;