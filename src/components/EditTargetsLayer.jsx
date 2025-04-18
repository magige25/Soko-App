import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { DatePicker } from "antd"; // Import Ant Design DatePicker
import dayjs from "dayjs"; // Import dayjs for date handling
import toast, { Toaster } from "react-hot-toast"; // Import toast and Toaster

const API_URL = "https://api.bizchain.co.ke/v1/targets";
const TARGET_TYPES_API_URL = "https://api.bizchain.co.ke/v1/targets/types";
const SALESPERSON_API_URL = "https://api.bizchain.co.ke/v1/salesperson";

const EditTargetsLayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { targetId } = location.state || {};

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

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }
      if (!targetId) {
        toast.error("No target ID provided. Please select a target to edit.");
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
          toast.error("Failed to load target types data. Please try again.");
        }

        if (salespeopleRes.data.status.code === 0) {
          setSalespeople(salespeopleRes.data.data);
        } else {
          toast.error("Failed to load salespeople data. Please try again.");
        }

        if (targetRes.data.status.code === 0) {
          const target = targetRes.data.data;
          setFormData({
            salesperson: target.salesperson.id.toString(),
            target: target.target.toString(),
            targetType: target.targetType.code,
            startDate: target.startDate.split("T")[0], // Already in YYYY-MM-DD format
            endDate: target.endDate.split("T")[0], // Already in YYYY-MM-DD format
          });
        } else {
          toast.error("Failed to load target data. Please try again.");
        }
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
        toast.error(err.response?.data?.message || "Failed to load data. Please try again.");
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

  const handleDateChange = (field, date, dateString) => {
    setFormData((prev) => ({
      ...prev,
      [field]: dateString, // Use YYYY-MM-DD format from DatePicker
    }));
    const error = validateField(field, dateString);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const formatDateForServer = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
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
      Object.values(newErrors).forEach((error) => {
        if (error) toast.error(error); // Show toast for each validation error
      });
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
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
        toast.success("Target updated successfully!");
        setTimeout(() => navigate("/targets"), 1500);
      } else {
        throw new Error(response.data.status.message || "Unknown server error");
      }
    } catch (error) {
      console.error("Error updating target:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update target. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          success: { style: { background: "#d4edda", color: "#155724" } },
          error: { style: { background: "#f8d7da", color: "#721c24" } },
        }}
      />
      <div className="card-body">
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
                Start Date <span className="text-danger">*</span>
              </label>
              <DatePicker
                value={formData.startDate ? dayjs(formData.startDate) : null}
                format="YYYY-MM-DD"
                onChange={(date, dateString) => handleDateChange("startDate", date, dateString)}
                className={`h-40-px ${errors.startDate ? "is-invalid" : ""}`}
                style={{ width: "100%" }}
              />
              {errors.startDate && (
                <div className="invalid-feedback" style={{ display: "block" }}>
                  {errors.startDate}
                </div>
              )}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                End Date <span className="text-danger">*</span>
              </label>
              <DatePicker
                value={formData.endDate ? dayjs(formData.endDate) : null}
                format="YYYY-MM-DD"
                onChange={(date, dateString) => handleDateChange("endDate", date, dateString)}
                className={`h-40-px ${errors.endDate ? "is-invalid" : ""}`}
                style={{ width: "100%" }}
              />
              {errors.endDate && (
                <div className="invalid-feedback" style={{ display: "block" }}>
                  {errors.endDate}
                </div>
              )}
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