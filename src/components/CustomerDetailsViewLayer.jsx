import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "../hook/spinner-utils";
import { formatDate } from "../hook/format-utils";
import { Icon } from "@iconify/react/dist/iconify.js"; // Import Icon for the back arrow

const ORDER_ITEMS_API_URL = "https://api.bizchain.co.ke/v1/orders/items";

const CustomerDetailsViewLayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const orderId = location.state?.orderId;
  const customerId = location.state?.customerId; // Retrieve customerId from state

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided.");
      setIsLoading(false);
      toast.error("No order ID provided. Please select an order.");
      navigate("/customers/details", { state: { customerId } }); // Redirect back to CustomerDetails with customerId
      return;
    }

    const fetchOrderItems = async () => {
      setIsLoading(true);
      setError(null);
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      try {
        const itemsResponse = await axios.get(ORDER_ITEMS_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
          params: { order: orderId },
        });

        if (itemsResponse.data.status.code === 0) {
          setOrderItems(itemsResponse.data.data);
        } else {
          throw new Error(`Failed to fetch order items: ${itemsResponse.data.status.message}`);
        }
      } catch (err) {
        console.error("Error fetching order items:", err.response?.data || err.message);
        setError(`Error: ${err.message || "Failed to load order items."}`);
        toast.error(`Error: ${err.message || "Failed to load order items."}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderItems();
  }, [orderId, customerId, navigate]);

  const handleBackClick = () => {
    navigate("/customers/orders", { state: { customerId } }); // Navigate back with customerId
  };

  if (isLoading) {
    return (
      <div className="card h-100 p-0 radius-12">
        <div className="card-body p-24 text-center">
          <Spinner />
        </div>
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
        <div className="d-flex align-items-center">
          <button
            className="btn btn-outline-secondary btn-sm me-3"
            onClick={handleBackClick}
            title="Back to orders"
          >
            <Icon icon="mdi:arrow-left" width="20" height="16" />
            Back
          </button>
          <h6 className="mb-0 fs-6">Products Ordered</h6>
        </div>
      </div>
      <div className="card-body p-24">
        <div className="mb-5">
          {orderItems.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-borderless sm-table mb-0">
                <thead>
                  <tr>
                    <th className="text-start py-3 px-4">Product Name</th>
                    <th className="text-start py-3 px-4">SKU Code</th>
                    <th className="text-start py-3 px-4">Quantity</th>
                    <th className="text-start py-3 px-4">Price</th>
                    <th className="text-start py-3 px-4">Total Price</th>
                    <th className="text-start py-3 px-4">Date Created</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item.id}>
                      <td className="text-start small-text py-3 px-4">{item.product?.name || "N/A"}</td>
                      <td className="text-start small-text py-3 px-4">{item.productSkuCode || "N/A"}</td>
                      <td className="text-start small-text py-3 px-4">{item.quantity || 0}</td>
                      <td className="text-start small-text py-3 px-4">Ksh {item.price?.toFixed(2) || "0.00"}</td>
                      <td className="text-start small-text py-3 px-4">Ksh {item.totalPrice?.toFixed(2) || "0.00"}</td>
                      <td className="text-start small-text py-3 px-4">{formatDate(item.dateCreated) || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No items found for this order.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsViewLayer;