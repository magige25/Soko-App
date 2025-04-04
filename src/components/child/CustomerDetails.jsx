import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Spinner } from "../../hook/spinner-utils";
import { formatDate } from "../../hook/format-utils";
import { Icon } from '@iconify/react';

const CUSTOMER_API_URL = "https://api.bizchain.co.ke/v1/customers";
const ORDERS_API_URL = "https://api.bizchain.co.ke/v1/orders";

const CustomerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const customerId = location.state?.customerId;
  const [viewCustomer, setViewCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!customerId) {
      setError("No customer ID provided");
      navigate("/customers");
      return;
    }

    const parsedId = parseInt(customerId, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      setError("Invalid customer ID: Must be a positive number");
      setIsLoading(false);
      return;
    }

    const fetchCustomerDetails = async () => {
      const token = sessionStorage.getItem("token");
      if (!token || token.trim() === "") {
        setError("No authentication token found. Please log in.");
        navigate("/login");
        return null;
      }

      try {
        const customerRes = await axios.get(`${CUSTOMER_API_URL}/${parsedId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!customerRes?.data?.status || customerRes.data.status.code !== 0) {
          throw new Error("Failed to fetch customer data");
        }

        const customer = customerRes.data.data;
        if (!customer) {
          throw new Error("No customer data found in response");
        }

        return {
          id: customer.id || "N/A",
          firstName: customer.firstName || "N/A",
          lastName: customer.lastName || "N/A",
        };
      } catch (error) {
        console.error("Error fetching customer details:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        setError(`Error fetching customer details: ${error.response?.data?.message || error.message}`);
        return null;
      }
    };

    const fetchOrders = async () => {
      const token = sessionStorage.getItem("token");
      if (!token || token.trim() === "") {
        setError("No authentication token found. Please log in.");
        navigate("/login");
        return [];
      }

      try {
        const ordersRes = await axios.get(ORDERS_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
          params: { customer: parsedId },
        });

        const result = ordersRes.data;
        if (result.status.code === 0) {
          return result.data.map((order) => ({
            id: order.id, // UUID for order items API
            orderCode: order.orderCode,
            amount: `Ksh ${order.amount.toFixed(2)}`,
            itemsQty: order.itemsQty,
            orderStatus: order.orderStatus.name,
            paymentStatus: order.paymentStatus.name,
            dateCreated: order.dateCreated,
          }));
        } else {
          throw new Error(`Failed to fetch orders: ${result.status.message}`);
        }
      } catch (error) {
        console.error("Error fetching orders:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        setError(`Error fetching orders: ${error.response?.data?.message || error.message}`);
        return [];
      }
    };

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [detailedCustomer, customerOrders] = await Promise.all([
          fetchCustomerDetails(),
          fetchOrders(),
        ]);

        if (detailedCustomer) {
          setViewCustomer(detailedCustomer);
          setOrders(customerOrders);
          setError(null);
        } else {
          setOrders([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [customerId, navigate]);

  if (isLoading) {
    return (
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <Spinner />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !viewCustomer) {
    return (
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {!error && !viewCustomer && <p className="text-muted">No customer data available.</p>}
              <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-secondary" onClick={() => navigate("/customers")}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12">
        <div className="card shadow-none border col-2 mb-3">
          <div className="card-body d-flex align-items-center justify-content-center">
            <h6 className="mb-0 fs-5 text-primary fw-semibold text-center">
              {`${viewCustomer.firstName} ${viewCustomer.lastName}`}
            </h6>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="row row-cols-xxxl-5 row-cols-lg-5 row-cols-sm-2 row-cols-1 gy-4">
          <div className="col">
            <div className="card shadow-none border bg-gradient-start-1 h-100">
              <div className="card-body p-20">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div>
                    <p className="fw-medium text-primary-light mb-1 fs-12">Pending Payments</p>
                    <h6 className="mb-0 fs-10">$500</h6>
                  </div>
                  <div className="w-50-px h-50-px bg-cyan rounded-circle d-flex justify-content-center align-items-center">
                    <Icon icon="solar:wallet-bold" className="text-white text-xxl mb-0" />
                  </div>
                </div>
                <p className="fw-medium fs-12 text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                  <span className="fs-12 d-inline-flex align-items-center gap-1 text-success-main">
                    <Icon icon="bxs:up-arrow" className="fs-12" /> +$100
                  </span>
                  Last 30 days
                </p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card shadow-none border bg-gradient-start-2 h-100">
              <div className="card-body p-20">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div>
                    <p className="fw-medium text-primary-light mb-1 fs-12">Pending Deliveries</p>
                    <h6 className="mb-0 fs-10">3</h6>
                  </div>
                  <div className="w-50-px h-50-px bg-purple rounded-circle d-flex justify-content-center align-items-center">
                    <Icon icon="fa-solid:truck" className="text-white text-xl mb-0" />
                  </div>
                </div>
                <p className="fw-medium fs-12 text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                  <span className="d-inline-flex align-items-center gap-1 text-danger-main">
                    <Icon icon="bxs:down-arrow" className="fs-12" /> -1
                  </span>
                  Last 30 days
                </p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card shadow-none border bg-gradient-start-3 h-100">
              <div className="card-body p-20">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div>
                    <p className="fw-medium text-primary-light mb-1 fs-12">Total Orders</p>
                    <h6 className="mb-0 fs-10">{orders.length}</h6>
                  </div>
                  <div className="w-50-px h-50-px bg-info rounded-circle d-flex justify-content-center align-items-center">
                    <Icon icon="fa-solid:shopping-cart" className="text-white text-xl mb-0" />
                  </div>
                </div>
                <p className="fw-medium fs-12 text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                  <span className="d-inline-flex align-items-center gap-1 text-success-main">
                    <Icon icon="bxs:up-arrow" className="fs-12" /> +5
                  </span>
                  Last 30 days
                </p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card shadow-none border bg-gradient-start-4 h-100">
              <div className="card-body p-20">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div>
                    <p className="fw-medium text-primary-light mb-1 fs-12">Due Invoices</p>
                    <h6 className="mb-0 fs-10">$200</h6>
                  </div>
                  <div className="w-50-px h-50-px bg-success-main rounded-circle d-flex justify-content-center align-items-center">
                    <Icon icon="fa6-solid:file-invoice-dollar" className="text-white text-xxl mb-0" />
                  </div>
                </div>
                <p className="fw-medium fs-12 text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                  <span className="d-inline-flex align-items-center gap-1 text-success-main">
                    <Icon icon="bxs:up-arrow" className="fs-12" /> +$50
                  </span>
                  Last 30 days
                </p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card shadow-none border bg-gradient-start-5 h-100">
              <div className="card-body p-20">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div>
                    <p className="fw-medium text-primary-light mb-1 fs-12">Total Paid</p>
                    <h6 className="mb-0 fs-10">$1,000</h6>
                  </div>
                  <div className="w-50-px h-50-px bg-red rounded-circle d-flex justify-content-center align-items-center">
                    <Icon icon="solar:card-bold" className="text-white text-xxl mb-0" />
                  </div>
                </div>
                <p className="fw-medium fs-12 text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                  <span className="d-inline-flex align-items-center gap-1 text-success-main">
                    <Icon icon="bxs:up-arrow" className="fs-12" /> +$200
                  </span>
                  Last 30 days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table Card */}
        <div className="card shadow-sm mt-3">
          <div className="card-body">
            <h6 className="fw-semibold fs-6 text-primary-light mb-3">Order Information</h6>
            <div className="table-responsive">
              <table className="table table-borderless sm-table mb-0">
                <thead>
                  <tr>
                    <th className="text-start py-3 px-4">Order Code</th>
                    <th className="text-start py-3 px-4">Amount</th>
                    <th className="text-start py-3 px-4">Items Quantity</th>
                    <th className="text-start py-3 px-4">Order Status</th>
                    <th className="text-start py-3 px-4">Payment Status</th>
                    <th className="text-start py-3 px-4">Date Created</th>
                    <th className="text-start py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td className="text-start small-text py-3 px-4">{order.orderCode}</td>
                        <td className="text-start small-text py-3 px-4">{order.amount}</td>
                        <td className="text-start small-text py-3 px-4">{order.itemsQty}</td>
                        <td className="text-start small-text py-3 px-4">{order.orderStatus}</td>
                        <td className="text-start small-text py-3 px-4">{order.paymentStatus}</td>
                        <td className="text-start small-text py-3 px-4">{formatDate(order.dateCreated)}</td>
                        <td className="text-start small-text py-3 px-4">
                          <div className="action-dropdown">
                            <div className="dropdown">
                              <button
                                className="btn btn-outline-secondary btn-sm dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                              >
                                Actions
                              </button>
                              <ul className="dropdown-menu">
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to="/customers/orders/products" 
                                    state={{ orderId: order.id, customerId: viewCustomer.id }} 
                                  >
                                    View
                                  </Link>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item text-danger"
                                    onClick={() => console.log(`Delete order ${order.orderCode}`)}
                                  >
                                    Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-3">
                        No orders found for this customer.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;