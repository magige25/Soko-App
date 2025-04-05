import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://api.bizchain.co.ke/v1/targets";
const TARGET_TYPES_API_URL = "https://api.bizchain.co.ke/v1/targets/types";
const SALESPERSON_API_URL = "https://api.bizchain.co.ke/v1/salesperson";

const AddTargetsLayer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    salesperson: "",
    target: "",
    targetType: "",
    startDate: "",
    endDate: "",
  });
  const [targetTypes, setTargetTypes] = useState([]);
  const [salesperson, setSalesperson] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(""); // Added for success feedback

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setErrors({ submit: "No authentication token found. Please log in." });
        return;
      }

      try {
        const [targetTypesRes, salespersonRes] = await Promise.all([
          axios.get(TARGET_TYPES_API_URL, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(SALESPERSON_API_URL, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (targetTypesRes.data.status.code === 0) {
          setTargetTypes(targetTypesRes.data.data);
        } else {
          setErrors({ submit: "Failed to load target types data. Please try again." });
        }

        if (salespersonRes.data.status.code === 0) {
          setSalesperson(salespersonRes.data.data);
        } else {
          setErrors({ submit: "Failed to load salesperson data. Please try again." });
        }
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
        setErrors({ submit: "Failed to load dropdown data. Please try again." });
      }
    };
    fetchData();
  }, []);

  const validateField = (field, value) => {
    if (typeof value === "string" && !value.trim()) {
      return `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")} is required`;
    }
    if (field === "target" && (isNaN(value) || value <= 0)) {
      return "Target must be a positive number";
    }
    return "";
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    const error = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const formatDateForServer = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-"); // Assuming input type="date" gives YYYY-MM-DD
    return `${day}/${month}/${year}`; // Convert to DD/MM/YYYY
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      setSuccessMessage(""); // Reset success message
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const payload = {
        salesperson: parseInt(formData.salesperson, 10),
        target: parseFloat(formData.target),
        targetType: formData.targetType,
        startDate: formatDateForServer(formData.startDate),
        endDate: formatDateForServer(formData.endDate),
      };

      console.log("Submitting payload:", payload);

      const response = await axios.post(API_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Server response:", response.data); // Log server response

      if (response.data.status.code === 0) {
        setSuccessMessage("Target added successfully! Redirecting...");
        setTimeout(() => navigate("/targets"), 1500); // Delay navigation for feedback
      } else {
        throw new Error(response.data.status.message || "Unknown server error");
      }
    } catch (error) {
      console.error("Error adding target:", error.response?.data || error.message);
      setErrors({
        submit:
          error.response?.data?.message ||
          error.message ||
          "Failed to add target. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-body">
        {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row gx-3">
            {/* First Column */}
            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                Salesperson <span className="text-danger">*</span>
              </label>
              <select
                className={`form-control radius-4 form-select ${errors.salesperson ? "is-invalid" : ""}`}
                value={formData.salesperson}
                onChange={(e) => handleInputChange("salesperson", e.target.value)}
              >
                <option value="">Select Salesperson</option>
                {salesperson.map((person) => (
                  <option key={person.id} value={person.id}>
                    {`${person.firstName} ${person.lastName}`}
                  </option>
                ))}
              </select>
              {errors.salesperson && <div className="invalid-feedback">{errors.salesperson}</div>}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                Target Amount <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                className={`form-control radius-4 ${errors.target ? "is-invalid" : ""}`}
                placeholder="Enter Target Amount"
                value={formData.target}
                onChange={(e) => handleInputChange("target", e.target.value)}
              />
              {errors.target && <div className="invalid-feedback">{errors.target}</div>}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                Target Type <span className="text-danger">*</span>
              </label>
              <select
                className={`form-control radius-4 form-select ${errors.targetType ? "is-invalid" : ""}`}
                value={formData.targetType}
                onChange={(e) => handleInputChange("targetType", e.target.value)}
              >
                <option value="">Select Target Type</option>
                {targetTypes.map((type) => (
                  <option key={type.code} value={type.code}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.targetType && <div className="invalid-feedback">{errors.targetType}</div>}
            </div>

            {/* Second Column */}
            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                Start Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className={`form-control radius-4 ${errors.startDate ? "is-invalid" : ""}`}
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
              />
              {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                End Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className={`form-control radius-8 ${errors.endDate ? "is-invalid" : ""}`}
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
              />
              {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
            </div>
          </div>

          <div className="text-muted small mt-4 mb-3">
            Fields marked with <span className="text-danger">*</span> are required.
          </div>

          <div className="mt-4 d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-secondary px-12"
              onClick={() => navigate("/targets")}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary px-12" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTargetsLayer;