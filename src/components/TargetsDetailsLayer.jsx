import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://api.bizchain.co.ke/v1/targets";

const TargetsDetailsLayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const targetId = location.state?.targetId;

  const [viewTarget, setViewTarget] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!targetId) {
      navigate("/targets");
      return;
    }

    const parsedId = parseInt(targetId, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      setError("Invalid target ID: Must be a positive number");
      setIsLoading(false);
      return;
    }

    const fetchTargetDetails = async () => {
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
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        console.log("Full API Response:", data);

        if (data.status && data.status.code === 0 && data.data) {
          const target = data.data;
          return {
            id: target.id || "N/A",
            salesperson: target.salesperson?.name || "N/A",
            targetAmount: target.target || 0,
            targetType: target.targetType?.name || "N/A",
            achieved: target.achievement || 0,
            startDate: target.startDate?.split("T")[0] || "N/A",
            endDate: target.endDate?.split("T")[0] || "N/A",
            status: target.status?.name || "N/A",
            dateCreated: target.dateCreated?.split("T")[0] || "N/A",
          };
        } else {
          setError("No valid target data found in response");
          return null;
        }
      } catch (error) {
        console.error("Error fetching target details:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        setError(`Error fetching target details: ${error.response?.data?.message || error.message}`);
        return null;
      }
    };

    const loadTargetDetails = async () => {
      setIsLoading(true);
      const detailedTarget = await fetchTargetDetails();
      setViewTarget(detailedTarget);
      setIsLoading(false);
    };
    loadTargetDetails();
  }, [targetId, navigate]);

  const formatValue = (value, targetType) => {
    if (!value && value !== 0) return "N/A";
    if (targetType === "Sales") {
      return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(value);
    }
    return value;
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Always return valid JSX
  if (isLoading) {
    return (
      <div className="page-wrapper">
        <div className="row">
          <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
            <div className="card-body">
              <p>Loading target details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !viewTarget) {
    return (
      <div className="page-wrapper">
        <div className="row">
          <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {!error && !viewTarget && <p>No target data available.</p>}
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
                  <label className="form-label fw-semibold text-primary-light">Salesperson</label>
                  <p className="text-muted">{viewTarget.salesperson}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Target Amount</label>
                  <p className="text-muted">
                    {formatValue(viewTarget.targetAmount, viewTarget.targetType)}
                  </p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Target Type</label>
                  <p className="text-muted">{viewTarget.targetType}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Date Created</label>
                  <p className="text-muted">{formatDate(viewTarget.dateCreated)}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Achieved Amount</label>
                  <p className="text-muted">
                    {formatValue(viewTarget.achieved, viewTarget.targetType)}
                  </p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Start Date</label>
                  <p className="text-muted">{formatDate(viewTarget.startDate)}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">End Date</label>
                  <p className="text-muted">{formatDate(viewTarget.endDate)}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Status</label>
                  <p className="text-muted">{viewTarget.status}</p>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-secondary" onClick={() => navigate("/targets")}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TargetsDetailsLayer;