import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_URL = "https://api.bizchain.co.ke/v1/customers";

const CustomerDetails = () => {
  const { id } = useParams(); 
  const { state } = useLocation();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(state?.customer || null);
  const [loading, setLoading] = useState(!state?.customer); // Only load if no state
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!customer) {
      const fetchCustomer = async () => {
        setLoading(true);
        try {
          const token = sessionStorage.getItem("token");
          if (!token) throw new Error("Please log in");

          const response = await axios.get(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCustomer(response.data.data);
        } catch (err) {
          console.error("Error fetching customer:", err);
          setError(err.message || "Failed to load customer");
          toast.error("Failed to load customer");
        } finally {
          setLoading(false);
        }
      };
      fetchCustomer();
    }
  }, [id, customer]);

  const handleBackClick = () => navigate("/customers");

  if (loading) return <div className="text-center py-3">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!customer) return <div className="text-center py-3">Customer not found</div>;

  return (
    <div className="card h-100 p-0 radius-12">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
        <h6 className="fs-6 mb-0">Customer Details</h6>
        <button className="btn btn-secondary" onClick={handleBackClick}>
          Back to Customers
        </button>
      </div>
      <div className="card-body p-24">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Name:</label>
            <p>{customer.name}</p>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Phone No:</label>
            <p>{customer.phoneNo}</p>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Pricing Category:</label>
            <p>{customer.pricingCategory}</p>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Customer Type:</label>
            <p>{customer.customerType}</p>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Route:</label>
            <p>{customer.route}</p>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Salesperson:</label>
            <p>{customer.salesperson}</p>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Date Created:</label>
            <p>{new Date(customer.dateCreated).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;