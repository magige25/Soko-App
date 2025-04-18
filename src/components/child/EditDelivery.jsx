import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_URL = "https://api.bizchain.co.ke/v1/supplier-deliveries";
const STG_FACILITY_API = "https://api.bizchain.co.ke/v1/storage-facilities";

const EditDelivery = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { delivery } = location.state || {};
  const [storageFacilities, setStorageFacilities] = useState([]);
  const [fetchingStorageFacilities, setFetchingStorageFacilities] = useState(true);
 
  const [editDelivery, setEditDelivery] = useState(
    delivery
      ? {
          supplier: delivery.supplier?.id || "",
          supplierName: delivery.supplier?.name || "",
          litres: delivery.litres || "",
          pricePerLitre: delivery.pricePerLitre || "",
          storageFacility: delivery?.storageFacility?.id || "",          
        }
      : { supplier: "", supplierName: "", litres: "", pricePerLitre: "", storageFacility: ""}
  );

  useEffect(() => {
    const fetchStorageFacilities = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(STG_FACILITY_API, {
          headers: {
            Authorization:`Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("Storage Facility API response:", response.data.data);
        if (Array.isArray(response.data.data)) {
          setStorageFacilities(response.data.data);
        } else if (response.data.data && typeof response.data.data === "object") {
          setStorageFacilities([response.data.data]);
        } else {
          throw new Error("Unexpected API response");      
        }
      } catch (error) {
        console.error("Error fetching Storage Facilities:", error);
        
      } finally {
        setFetchingStorageFacilities(false);
      }
    };
    fetchStorageFacilities();
    if (!delivery) {
      toast.error("No delivery selected to edit.");
      navigate("/deliveries");
      
    }
  }, [delivery, navigate]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editDelivery.supplier || !editDelivery.litres || !editDelivery.pricePerLitre || !editDelivery.storageFacility) {
      toast.error("Please fill in all required fields before saving.");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("Please log in."); 
        
        return;
      }

      const payload = {
        supplier: editDelivery.supplier,
        litres: parseFloat(editDelivery.litres),
        pricePerLitre: parseFloat(editDelivery.pricePerLitre),
        storageFacilityId: editDelivery.storageFacility,
      };

      console.log("Available storage facilities:", storageFacilities);
      console.log("Payload being sent:", payload);

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
      console.error("Error updating Delivery:", error.response?.data || error.message);
      toast.error("Failed to update Delivery. Please try again.");
    }
  };

  const handleCancel = () => navigate("/deliveries");

  return (
        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <Toaster position="top-center" 
            reverseOrder={false}
            toastOptions={{
            success: { style: { background: "#d4edda", color: "#155724" } },
            error: { style: { background: "#f8d7da", color: "#721c24" } },
          }} />
          <div className="card-body">
            <form onSubmit={handleEditSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">
                    Supplier Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-select"
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
                <div className="col-md-6">
                  <label className="form-label">
                    Storage Facility <span className="text-danger">*</span>
                  </label>
                  <select                    
                    className="form-control form-select"
                    value={editDelivery.storageFacility}
                    onChange={(e) =>
                      setEditDelivery({ ...editDelivery, storageFacility: e.target.value })
                    }
                    required
                    disabled={fetchingStorageFacilities}
                  >
                  <option value ="">Select Storage Facility</option>
                  {storageFacilities.length > 0 ? (
                      storageFacilities.map((facility) => (
                        <option key={facility.id} value={facility.id}>
                          {`${facility.name}`}
                        </option>
                      ))
                    ) : (
                      <option value="">No storage facilities available</option>
                    )}
                  </select>
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
  );
};

export default EditDelivery;