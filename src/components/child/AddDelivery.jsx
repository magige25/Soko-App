import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://api.bizchain.co.ke/v1/supplier-deliveries";
const SUPPLIERS_API_URL = "https://api.bizchain.co.ke/v1/suppliers";

const AddDelivery = () => {
  const navigate = useNavigate();
  const [newDelivery, setNewDelivery] = useState({
    supplier: "",
    litres: "",
    pricePerLitre: "",
  });
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSuppliers, setFetchingSuppliers] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(SUPPLIERS_API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Suppliers API response:", response.data);

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

    fetchSuppliers();
  }, []);

  const handleAddDelivery = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!newDelivery.supplier || !newDelivery.litres || !newDelivery.pricePerLitre) {
      setFormError("Please fill in all required fields before saving.");
      return;
    }

    const newDeliveryData = {
      supplier: parseInt(newDelivery.supplier),
      litres: parseFloat(newDelivery.litres),
      pricePerLitre: parseFloat(newDelivery.pricePerLitre),
    };

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(API_URL, newDeliveryData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        alert("Delivery added successfully!");
        navigate("/deliveries");
      }
    } catch (error) {
      console.error("Error adding delivery:", error);
      setFormError("Failed to add delivery. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/deliveries");

  return (
    <div className="page-wrapper">
      <div className="row">
        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">
            <h6 className="fs-6 mb-4">Add Delivery</h6>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleAddDelivery}>
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
                    onChange={(e) => setNewDelivery({ ...newDelivery, litres: e.target.value })}
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
    </div>
  );
};

export default AddDelivery;