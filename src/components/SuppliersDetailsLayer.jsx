import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner } from "../hook/spinner-utils";
import { formatDate, formatCurrency } from "../hook/format-utils";

const API_URL = "https://api.bizchain.co.ke/v1/suppliers";

const SuppliersDetailsLayer = () => {
  const location = useLocation();
  const supplierId = location.state?.supplierId;
  const navigate = useNavigate();
  const [viewSupplier, setViewSupplier] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supplierId) {
      navigate("suppliers")
      return;
    }

    const parsedId = parseInt(supplierId, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      setError("Invalid supplier ID: Must be a positive number");
      setIsLoading(false);
      return;
    }

    const fetchSupplierDetails = async () => {
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
          const supplier = data.data; 
          return {
            id: supplier.id,
            firstName: supplier.firstName,
            lastName: supplier.lastName,
            phoneNumber: supplier.phoneNumber,
            productionQuantity: supplier.productionQuantity,
            numberCattle: supplier.numberCattle,
            pendingBills: supplier.pendingBills,
            unpaidBills: supplier.unpaidBills,
            residence: supplier.supplierResidence.name,
            paymentMethod: supplier.disbursementMethod.name,
            transportMode: supplier.transportMode.name,
            dateCreated: supplier.dateCreated?.split("T")[0] || "N/A",
            expansionCapacity: supplier.expansionCapacity,
            contactPersonName: supplier.contactPersonName,
            disbursementCriteria: supplier.disbursementCriteria.name,
            paymentCycle: supplier.paymentCycle ? supplier.paymentCycle.name : "N/A",
            disbursementPhoneNumber: supplier.disbursementPhoneNumber,
          };
        } else {
          setError("No valid supplier data found in response");
          return null;
        }
      } catch (error) {
        console.error("Error fetching supplier details:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        setError(`Error fetching supplier details: ${error.response?.data?.message || error.message}`);
        return null;
      }
    };

    const loadSupplierDetails = async () => {
      setIsLoading(true); // Start loading
      const detailedSupplier = await fetchSupplierDetails();
      setViewSupplier(detailedSupplier);
      setIsLoading(false); // End loading
    };
    loadSupplierDetails();
  }, [supplierId, navigate]);

  // Always return valid JSX
  if (isLoading) {
    return (
      <div className="page-wrapper">
        <div className="row">
          <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  if (error || !viewSupplier) {
    return (
      <div className="page-wrapper">
        <div className="row">
          <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {!error && !viewSupplier && <p>No supplier data available.</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Full Name</label>
                  <p className="text-muted">{`${viewSupplier.firstName} ${viewSupplier.lastName}`}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Phone Number</label>
                  <p className="text-muted">{viewSupplier.phoneNumber}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Production Quantity (Litres)</label>
                  <p className="text-muted">{viewSupplier.productionQuantity}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Number of Cattle</label>
                  <p className="text-muted">{viewSupplier.numberCattle}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Pending Bills</label>
                  <p className="text-muted">{formatCurrency(viewSupplier.pendingBills)}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Expansion Capacity</label>
                  <p className="text-muted">{viewSupplier.expansionCapacity}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Date Created</label>
                  <p className="text-muted">{viewSupplier.dateCreated}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Transport Mode</label>
                  <p className="text-muted">{viewSupplier.transportMode}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Unpaid Bills</label>
                  <p className="text-muted">{formatCurrency(viewSupplier.unpaidBills)}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Residence</label>
                  <p className="text-muted">{viewSupplier.residence}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Payment Method</label>
                  <p className="text-muted">{viewSupplier.paymentMethod}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Date Created</label>
                  <p className="text-muted">{formatDate(viewSupplier.dateCreated)}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Contact Person Name</label>
                  <p className="text-muted">{viewSupplier.contactPersonName}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Disbursement Criteria</label>
                  <p className="text-muted">{viewSupplier.disbursementCriteria}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Payment Cycle</label>
                  <p className="text-muted">{viewSupplier.paymentCycle}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary-light">Disbursement Phone Number</label>
                  <p className="text-muted">{viewSupplier.disbursementPhoneNumber}</p>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-secondary" onClick={() => navigate("/suppliers")}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default SuppliersDetailsLayer;