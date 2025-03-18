import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_URL = "https://api.bizchain.co.ke/v1/supplier-deliveries";
const SUPPLIERS_API_URL = "https://api.bizchain.co.ke/v1/suppliers";
const STG_FACILITY_API = "https://api.bizchain.co.ke/v1/storage-facilities";

const AddDelivery = () => {
  const navigate = useNavigate();
  const [newDelivery, setNewDelivery] = useState({
    supplier: "",
    litres: "",
    pricePerLitre: "",
    storageFacilityId: "",
  });
  const [suppliers, setSuppliers] = useState([]);
  const [storageFacilities, setStorageFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSuppliers, setFetchingSuppliers] = useState(true);
  const [fetchingStorageFacilities, setFetchingStorageFacilities] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(SUPPLIERS_API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Suppliers API response:", response.data.data);

        if (Array.isArray(response.data.data)) {
          setSuppliers(response.data.data);
        } else if (response.data.data && typeof response.data.data === "object") {
          setSuppliers([response.data.data]);
        } else {
          throw new Error("Unexpected API response format");
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        setError("Failed to load suppliers");
      } finally {
        setFetchingSuppliers(false);
      }
    };
    const fetchStorageFacilities = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(STG_FACILITY_API, {
          headers: {
            Authorization: `Bearer ${token}`,
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
        setError("Failed to load Storage Facilities");
      } finally {
        setFetchingStorageFacilities(false);
      }
    };

    fetchSuppliers();
    fetchStorageFacilities();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!newDelivery.supplier || !newDelivery.litres || !newDelivery.pricePerLitre) {
      setFormError("Please fill in all required fields before saving.");
      return;
    }

    // Show confirmation modal instead of saving immediately
    setShowSaveConfirmation(true);
  };

  const handleSaveConfirm = async () => {
    setLoading(true);
    setFormError("");

    const newDeliveryData = {
      supplier: parseInt(newDelivery.supplier),
      litres: parseFloat(newDelivery.litres),
      pricePerLitre: parseFloat(newDelivery.pricePerLitre),
      storageFacilityId: parseInt(newDelivery.storageFacilityId) || null,
    };

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(API_URL, newDeliveryData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Delivery added successfully!");
        setNewDelivery({
          supplier: "",
          litres: "",
          pricePerLitre: "",
          storageFacilityId: "",
        });
        setShowSaveConfirmation(false);
        navigate("/deliveries");
      }
    } catch (error) {
      console.error("Error adding delivery:", error);
      setFormError("Failed to add delivery. Please try again.");
      setShowSaveConfirmation(false); // Close modal on error to allow retry
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = () => {
    setShowSaveConfirmation(false);
    // Form remains open with prefilled data for review
  };

  const handleCancel = () => navigate("/deliveries");

  const getSupplierName = (id) => {
    const supplier = suppliers.find((s) => s.id === parseInt(id));
    return supplier ? `${supplier.firstName} ${supplier.lastName}` : "N/A";
  };

  const getStorageFacilityName = (id) => {
    const facility = storageFacilities.find((f) => f.id === parseInt(id));
    return facility ? facility.name : "N/A";
  };

  return (
    <div className="page-wrapper">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="row">
        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">
            <h6 className="fs-6 mb-4">Add Delivery</h6>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">
                    Supplier <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={newDelivery.supplier}
                    onChange={(e) =>
                      setNewDelivery({ ...newDelivery, supplier: e.target.value })
                    }
                    required
                    disabled={fetchingSuppliers}
                  >
                    <option value="">Select a supplier</option>
                    {suppliers.length > 0 ? (
                      suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {`${supplier.firstName} ${supplier.lastName}`}
                        </option>
                      ))
                    ) : (
                      <option value="">No suppliers available</option>
                    )}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Volume (L) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={newDelivery.litres}
                    onChange={(e) =>
                      setNewDelivery({ ...newDelivery, litres: e.target.value })
                    }
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
                    value={newDelivery.pricePerLitre}
                    onChange={(e) =>
                      setNewDelivery({ ...newDelivery, pricePerLitre: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Storage Facility
                  </label>
                  <select
                    className="form-control"
                    value={newDelivery.storageFacilityId}
                    onChange={(e) =>
                      setNewDelivery({ ...newDelivery, storageFacilityId: e.target.value })
                    }
                    disabled={fetchingStorageFacilities}
                  >
                    <option value="">Select a Storage Facility</option>
                    {storageFacilities.length > 0 ? (
                      storageFacilities.map((storageFacility) => (
                        <option key={storageFacility.id} value={storageFacility.id}>
                          {`${storageFacility.name}`}
                        </option>
                      ))
                    ) : (
                      <option value="">No storage facilities available</option>
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

      {/* Save Confirmation Modal */}
      {showSaveConfirmation && (
        <div className="modal fade show custom-modal-backdrop" style={{ display: "block" }} tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md top-center-modal">
            <div className="modal-content">
              <div className="modal-body pt-3 ps-18 pe-18">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="modal-title fs-6">Confirm Save</h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowSaveConfirmation(false)}
                  ></button>
                </div>
                <p className="pb-3 mb-0">
                  Please confirm the details before saving:
                  <ul>
                    <li>Supplier: <strong>{getSupplierName(newDelivery.supplier)}</strong></li>
                    <li>Volume: <strong>{newDelivery.litres} L</strong></li>
                    <li>Price/Litre: <strong>KES {parseFloat(newDelivery.pricePerLitre).toFixed(2)}</strong></li>
                    <li>Storage Facility: <strong>{getStorageFacilityName(newDelivery.storageFacilityId) || "N/A"}</strong></li>
                  </ul>
                  Do you want to proceed?
                </p>
              </div>
              <div className="d-flex justify-content-end gap-2 px-12 pb-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleReviewClick}
                >
                  Review
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveConfirm}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Continue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDelivery;