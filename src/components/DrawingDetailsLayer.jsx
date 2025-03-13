import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DRAWING_API_URL = "https://api.bizchain.co.ke/v1/drawing";
const DRAWING_DETAILS_API_URL = "https://api.bizchain.co.ke/v1/drawing/details";

const DrawingDetailsLayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawing, setDrawing] = useState(null);
  const [drawingDetails, setDrawingDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const drawingId = location.state?.drawingId;

  useEffect(() => {
    if (!drawingId) {
      setError("No drawing ID provided.");
      setIsLoading(false);
      toast.error("No drawing ID provided. Please select a drawing.");
      navigate("/drawing");
      return;
    }

    const fetchDrawingData = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      try {
        // Fetch basic drawing details
        const drawingResponse = await axios.get(DRAWING_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: 1, limit: 100 },
        });

        if (drawingResponse.data.status.code === 0) {
          const drawingData = drawingResponse.data.data.find(
            (d) => d.id === drawingId
          );
          if (drawingData) {
            setDrawing(drawingData);
          } else {
            throw new Error("Drawing not found in the list.");
          }
        } else {
          throw new Error(`Failed to fetch drawings: ${drawingResponse.data.status.message}`);
        }

        // Fetch detailed drawing information
        const detailsResponse = await axios.get(`${DRAWING_DETAILS_API_URL}/${drawingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (detailsResponse.data.status.code === 0) {
          setDrawingDetails(detailsResponse.data.data);
        } else {
          throw new Error(`Failed to fetch drawing details: ${detailsResponse.data.status.message}`);
        }
      } catch (err) {
        console.error("Error fetching drawing data:", err.response?.data || err.message);
        setError(`Error: ${err.message || "Failed to load drawing details."}`);
        toast.error(`Error: ${err.message || "Failed to load drawing details."}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrawingData();
  }, [drawingId, navigate]);

  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getFullYear();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";
    return `${day}${suffix} ${month} ${year}`;
  };

  const renderStockBatch = (stockBatch) => {
    if (!stockBatch) return "N/A";
    if (typeof stockBatch === "object" && stockBatch !== null) {
      return stockBatch.name || stockBatch.code || "Unnamed Batch"; // Adjust based on actual object structure
    }
    return stockBatch; // If it’s a string
  };

  if (isLoading) {
    return (
      <div className="card h-100 p-0 radius-12">
        <div className="card-body p-24 text-center">Loading drawing details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card h-100 p-0 radius-12">
        <div className="card-body p-24">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-100 p-0 radius-12">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
        <h6 className="mb-0">Drawing Details: {drawing?.drawCode || "N/A"}</h6>
        <button
          className="btn btn-secondary px-12"
          onClick={() => navigate("/drawing")}
        >
          Back to Drawing
        </button>
      </div>
      <div className="card-body p-24">
        {/* Basic Drawing Information */}
        <div className="mb-4">
          <h6 className="fw-semibold text-primary-light mb-3">Basic Information</h6>
          <div className="row">
            <div className="col-md-6">
              <p><strong>Draw Code:</strong> {drawing?.drawCode || "N/A"}</p>
              <p><strong>Total Litres:</strong> {drawing?.totalLitres || 0} L</p>
              <p><strong>Number of Products:</strong> {drawing?.productQty || 0}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Total Items:</strong> {drawing?.itemQty || 0}</p>
              <p><strong>Date Created:</strong> {formatDate(drawing?.dateCreated)}</p>
              <p><strong>Created By:</strong> {drawing?.createdBy?.name || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Storage Facility Details */}
        <div className="mb-4">
          <h6 className="fw-semibold text-primary-light mb-3 mt-3">Storage Facility Details</h6>
          {drawingDetails?.storageFacilityDrawnModels?.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-borderless sm-table mb-0">
                <thead>
                  <tr>
                    <th className="text-start py-3 px-4">Storage Facility</th>
                    <th className="text-start py-3 px-4">Stock Batch</th>
                    <th className="text-start py-3 px-4">Litres</th>
                  </tr>
                </thead>
                <tbody>
                  {drawingDetails.storageFacilityDrawnModels.map((model, index) => (
                    <tr key={index}>
                      <td className="text-start small-text py-3 px-4">
                        {model.storageFacility?.name || "N/A"}
                      </td>
                      <td className="text-start small-text py-3 px-4">
                        {renderStockBatch(model.stockBatch)}
                      </td>
                      <td className="text-start small-text py-3 px-4">
                        {model.litres || 0} L
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No storage facility details available.</p>
          )}
        </div>

        {/* Product Draw Records */}
        <div>
          <h6 className="fw-semibold text-primary-light mb-3 mt-3">Product Draw Records</h6>
          {drawingDetails?.productDrawRecordModels?.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-borderless sm-table mb-0">
                <thead>
                  <tr>
                    <th className="text-start py-3 px-4">Product Name</th>
                    <th className="text-start py-3 px-4">Litres</th>
                    <th className="text-start py-3 px-4">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {drawingDetails.productDrawRecordModels.map((model, index) => (
                    <tr key={index}>
                      <td className="text-start small-text py-3 px-4">
                        {model.product?.name || "N/A"}
                      </td>
                      <td className="text-start small-text py-3 px-4">
                        {model.litres || 0} L
                      </td>
                      <td className="text-start small-text py-3 px-4">
                        {model.qty || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No product draw records available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawingDetailsLayer;