import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = "https://api.bizchain.co.ke/v1/targets";
const TARGET_TYPES_API_URL = "https://api.bizchain.co.ke/v1/targets/types";
const SALESPERSON_API_URL = "https://api.bizchain.co.ke/v1/salesperson";

const EditTargetsLayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { targetId } = location.state || {}; // Get targetId from navigation state

  const [formData, setFormData] = useState({
    salesperson: "",
    target: "",
    targetType: "",
    startDate: "",
    endDate: "",
  });
  const [targetTypes, setTargetTypes] = useState([]);
  const [salespeople, setSalespeople] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch target types, salespeople, and target data on mount
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrors({ submit: "No authentication token found. Please log in." });
        return;
      }
      if (!targetId) {
        setErrors({ submit: "No target ID provided. Please select a target to edit." });
        return;
      }

      setIsLoading(true);
      try {
        const [targetTypesRes, salespeopleRes, targetRes] = await Promise.all([
          axios.get(TARGET_TYPES_API_URL, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(SALESPERSON_API_URL, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/${targetId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (targetTypesRes.data.status.code === 0) {
          setTargetTypes(targetTypesRes.data.data);
        } else {
          setErrors({ submit: "Failed to load target types data. Please try again." });
        }

        if (salespeopleRes.data.status.code === 0) {
          setSalespeople(salespeopleRes.data.data);
        } else {
          setErrors({ submit: "Failed to load salespeople data. Please try again." });
        }

        if (targetRes.data.status.code === 0) {
          const target = targetRes.data.data;
          setFormData({
            salesperson: target.salesperson.id.toString(), // Convert to string for select
            target: target.target.toString(), // Convert to string for input
            targetType: target.targetType.code,
            startDate: target.startDate.split("T")[0], // Convert to YYYY-MM-DD
            endDate: target.endDate.split("T")[0], // Convert to YYYY-MM-DD
          });
        } else {
          setErrors({ submit: "Failed to load target data. Please try again." });
        }
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
        setErrors({ submit: "Failed to load data. Please try again." });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [targetId]);

  const validateField = (field, value) => {
    if (typeof value === "string" && !value.trim()) {
      return `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")} is required`;
    }
    if (field === "target" && (isNaN(value) || value <= 0)) {
      return "Target must be a positive number";
    }
    if (field === "startDate" && value) {
      const start = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (start < today) {
        return "Start date cannot be in the past";
      }
    }
    if (field === "endDate" && value && formData.startDate) {
      const start = new Date(formData.startDate);
      const end = new Date(value);
      if (end <= start) {
        return "End date must be after start date";
      }
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
    const [year, month, day] = dateString.split("-"); // YYYY-MM-DD from input
    return `${day}/${month}/${year}`; // Convert to DD/MM/YYYY as per AddTargetsLayer
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
      setSuccessMessage("");
      const token = localStorage.getItem("token");
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

      const response = await axios.put(`${API_URL}/${targetId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Server response:", response.data);

      if (response.data.status.code === 0) {
        setSuccessMessage("Target updated successfully! Redirecting...");
        setTimeout(() => navigate("/targets"), 1500);
      } else {
        throw new Error(response.data.status.message || "Unknown server error");
      }
    } catch (error) {
      console.error("Error updating target:", error.response?.data || error.message);
      setErrors({
        submit:
          error.response?.data?.message ||
          error.message ||
          "Failed to update target. Please try again.",
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
            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                Salesperson <span className="text-danger">*</span>
              </label>
              <select
                className={`form-control radius-8 form-select ${errors.salesperson ? "is-invalid" : ""}`}
                value={formData.salesperson}
                onChange={(e) => handleInputChange("salesperson", e.target.value)}
              >
                <option value="">Select Salesperson</option>
                {salespeople.map((person) => (
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
                className={`form-control radius-8 ${errors.target ? "is-invalid" : ""}`}
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
                className={`form-control radius-8 form-select ${errors.targetType ? "is-invalid" : ""}`}
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

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                Start Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className={`form-control radius-8 ${errors.startDate ? "is-invalid" : ""}`}
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

export default EditTargetsLayer;