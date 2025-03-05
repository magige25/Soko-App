import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = "https://api.bizchain.co.ke/v1/salesperson";
const ROUTES_API = "https://api.bizchain.co.ke/v1/routes";
const REGIONS_API = "https://api.bizchain.co.ke/v1/regions";
const COUNTRIES_API = "https://api.bizchain.co.ke/v1/countries";

const EditSalespersonsLayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const salespersonId = location.state?.salespersonId;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    countryCode: "",
    routeId: "",
    regionId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [routes, setRoutes] = useState([]);
  const [regions, setRegions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrors({ submit: "No authentication token found. Please log in." });
        return;
      }

      try {
        setIsLoading(true);
        const [salespersonRes, routesRes, regionsRes, countriesRes] = await Promise.all([
          axios.get(`${API_URL}/${salespersonId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(ROUTES_API, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(REGIONS_API, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(COUNTRIES_API, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (salespersonRes.data.status.code === 0) {
          const salesperson = salespersonRes.data.data;
          console.log("Fetched Salesperson Data:", salesperson);

          // Fix: Derive countryCode from the salesperson's region by cross-referencing regions data
          let derivedCountryCode = "";
          if (salesperson.region?.id && regionsRes.data.status.code === 0) {
            const matchingRegion = regionsRes.data.data.find(
              (region) => region.id === salesperson.region.id
            );
            derivedCountryCode = matchingRegion?.country?.code || "";
          }

          setFormData({
            firstName: salesperson.firstName || "",
            lastName: salesperson.lastName || "",
            email: salesperson.email || "",
            phoneNumber: salesperson.phoneNo || "",
            countryCode: derivedCountryCode, // Fix: Use derived countryCode
            routeId: salesperson.route?.id ? String(salesperson.route.id) : "",
            regionId: salesperson.region?.id ? String(salesperson.region.id) : "",
          });
        } else {
          setErrors({ submit: "Failed to load salesperson data. Please try again." });
        }

        if (routesRes.data.status.code === 0) {
          setRoutes(routesRes.data.data);
          const regionId = salespersonRes.data.data?.region?.id;
          setFilteredRoutes(
            regionId
              ? routesRes.data.data.filter(
                  (route) => route.region.id === parseInt(regionId, 10)
                )
              : routesRes.data.data
          );
        } else {
          setErrors({ submit: "Failed to load routes data. Please try again." });
        }

        if (regionsRes.data.status.code === 0) {
          setRegions(regionsRes.data.data);
          // Fix: Filter regions based on derived countryCode
          const derivedCountryCode = regionsRes.data.data.find(
            (region) => region.id === salespersonRes.data.data?.region?.id
          )?.country?.code || "";
          setFilteredRegions(
            derivedCountryCode
              ? regionsRes.data.data.filter(
                  (region) => region.country.code === derivedCountryCode
                )
              : regionsRes.data.data
          );
        } else {
          setErrors({ submit: "Failed to load regions data. Please try again." });
        }

        if (countriesRes.data.status.code === 0) {
          setCountries(countriesRes.data.data);
        } else {
          setErrors({ submit: "Failed to load countries data. Please try again." });
        }
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
        setErrors({ submit: "Failed to load data. Please try again." });
      } finally {
        setIsLoading(false);
      }
    };

    if (salespersonId) {
      fetchData();
    } else {
      setErrors({ submit: "No salesperson ID provided. Please select a salesperson to edit." });
    }
  }, [salespersonId]);

  // Filter regions when countryCode changes
  useEffect(() => {
    if (formData.countryCode) {
      const filtered = regions.filter(
        (region) => region.country.code === formData.countryCode
      );
      setFilteredRegions(filtered);
    } else {
      setFilteredRegions(regions);
    }
  }, [formData.countryCode, regions]);

  // Filter routes when regionId changes
  useEffect(() => {
    if (formData.regionId) {
      const filtered = routes.filter(
        (route) => route.region.id === parseInt(formData.regionId, 10)
      );
      setFilteredRoutes(filtered);
    } else {
      setFilteredRoutes(routes);
    }
  }, [formData.regionId, routes]);

  const validateField = (field, value) => {
    if (typeof value === "string" && !value.trim() && field !== "countryCode") {
      return `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")} is required`;
    }
    if (field === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address";
    }
    if (field === "phoneNumber" && value && !/^\+?\d{9,}$/.test(value)) {
      return "Please enter a valid phone number (e.g., +254765746534 or 0765746534)";
    }
    return "";
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const newFormData = { ...prev, [field]: value };
      if (field === "countryCode" && value) {
        const filtered = regions.filter((region) => region.country.code === value);
        if (!filtered.some((region) => region.id === parseInt(prev.regionId, 10))) {
          newFormData.regionId = "";
          newFormData.routeId = "";
        }
      }
      if (field === "regionId" && value) {
        const filtered = routes.filter(
          (route) => route.region.id === parseInt(value, 10)
        );
        if (!filtered.some((route) => route.id === parseInt(prev.routeId, 10))) {
          newFormData.routeId = "";
        }
      }
      return newFormData;
    });
    const error = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (field !== "countryCode") {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        countryCode: formData.countryCode,
        routeId: parseInt(formData.routeId, 10),
        regionId: parseInt(formData.regionId, 10),
      };

      console.log("Submitting payload:", payload);

      await axios.put(`${API_URL}/${salespersonId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      navigate("/salespersons");
    } catch (error) {
      console.error("Error updating salesperson:", error.response?.data || error.message);
      setErrors({
        submit:
          error.response?.data?.message ||
          error.message ||
          "Failed to update salesperson. Please check your connection and try again.",
      });
      navigate("/salespersons");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-body">
        {isLoading && <div className="alert alert-info">Loading salesperson data...</div>}
        {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

        {!isLoading && (
          <form onSubmit={handleSubmit}>
            <div className="row gx-3">
              {/* First Column */}
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  First Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control radius-8 ${errors.firstName ? "is-invalid" : ""}`}
                  placeholder="Enter First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                />
                {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  Last Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control radius-8 ${errors.lastName ? "is-invalid" : ""}`}
                  placeholder="Enter Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
                {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className={`form-control radius-8 ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              {/* Second Column */}
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  Phone Number <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  className={`form-control radius-8 ${errors.phoneNumber ? "is-invalid" : ""}`}
                  placeholder="Enter Phone Number (e.g., +254765746534)"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                />
                {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  Country
                </label>
                <select
                  className="form-control radius-8 form-select"
                  value={formData.countryCode}
                  onChange={(e) => handleInputChange("countryCode", e.target.value)}
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  Region <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-control radius-8 form-select ${errors.regionId ? "is-invalid" : ""}`}
                  value={formData.regionId}
                  onChange={(e) => handleInputChange("regionId", e.target.value)}
                  disabled={!formData.countryCode}
                >
                  <option value="">Select Region</option>
                  {filteredRegions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
                {errors.regionId && <div className="invalid-feedback">{errors.regionId}</div>}
              </div>

              {/* Third Column */}
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  Route <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-control radius-8 form-select ${errors.routeId ? "is-invalid" : ""}`}
                  value={formData.routeId}
                  onChange={(e) => handleInputChange("routeId", e.target.value)}
                  disabled={!formData.regionId}
                >
                  <option value="">Select Route</option>
                  {filteredRoutes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.name}
                    </option>
                  ))}
                </select>
                {errors.routeId && <div className="invalid-feedback">{errors.routeId}</div>}
              </div>
            </div>

            <div className="text-muted small mt-4 mb-3">
              Fields marked with <span className="text-danger">*</span> are required.
            </div>

            <div className="mt-4 d-flex justify-content-end gap-2">
              <button type="submit" className="btn btn-primary px-12" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditSalespersonsLayer;