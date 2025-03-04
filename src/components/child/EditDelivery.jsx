import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast"; // Import toast and Toaster

const API_URL = "https://api.bizchain.co.ke/v1/supplier-deliveries";

const EditDelivery = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { delivery } = location.state || {};

  // Initialize state with delivery data or fallback values
  const [editDelivery, setEditDelivery] = useState(
    delivery
      ? {
          supplier: delivery.supplier?.id || "",
          supplierName: delivery.supplier?.name || "",
          litres: delivery.litres || "",
          pricePerLitre: delivery.pricePerLitre || "",
        }
      : { supplier: "", supplierName: "", litres: "", pricePerLitre: "" }
  );

  useEffect(() => {
    if (!delivery) {
      toast.error("No delivery selected to edit."); // Toast for missing delivery
      navigate("/deliveries");
    }
  }, [delivery, navigate]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editDelivery.supplier || !editDelivery.litres || !editDelivery.pricePerLitre) {
      toast.error("Please fill in all required fields before saving."); // Toast for validation error
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in."); 
        
        return;
      }

      const payload = {
        supplier: editDelivery.supplier,
        litres: parseFloat(editDelivery.litres),
        pricePerLitre: parseFloat(editDelivery.pricePerLitre),
      };

      const response = await axios.put(`${API_URL}/${delivery.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.success("Delivery updated successfully!");
        navigate("/deliveries");
      }
    } catch (error) {
      console.error("Error updating Delivery:", error);
      toast.error("Failed to update Delivery. Please try again."); // Toast for API error
    }
  };

  const handleCancel = () => navigate("/deliveries");

  return (
    <div className="page-wrapper">
      <Toaster position="top-center" 
      reverseOrder={false}
      toastOptions={{
        success: { style: { background: "#d4edda", color: "#155724" } },
        error: { style: { background: "#f8d7da", color: "#721c24" } },
      }} /> {/* Add Toaster component */}
      <div className="row">
        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">
            <h6 className="fs-6 mb-4">Edit Delivery</h6>
            <form onSubmit={handleEditSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">
                    Supplier Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={editDelivery.supplierName}
                    readOnly
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Volume (L) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={editDelivery.litres}
                    onChange={(e) => setEditDelivery({ ...editDelivery, litres: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">
                    Price/Litre <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={editDelivery.pricePerLitre}
                    onChange={(e) =>
                      setEditDelivery({ ...editDelivery, pricePerLitre: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDelivery;