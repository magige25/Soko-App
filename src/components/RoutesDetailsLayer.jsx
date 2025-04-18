import { Icon } from "@iconify/react";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { formatCurrency } from "../hook/format-utils";

const RouteDetails = () => {
  const location = useLocation();
  const [route, setRoute] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [salesPersons, setSalesPersons] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedTable, setSelectedTable] = useState("customers");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDateFilter, setSelectedDateFilter] = useState("");

  const API_BASE_URL = "https://api.bizchain.co.ke/v1";
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("Please login!");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch route data
        const routeId = location.state?.route?.id;
        const routeResponse = routeId
          ? await axios.get(`${API_BASE_URL}/routes/${routeId}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          : { data: null };
        setRoute(routeResponse.data || {
          name: "Default Route",
          numberSalesPerson: 0,
          numberCustomer: 0,
          country: { name: "N/A" },
          dateCreated: null,
        });
        console.log("Route Response:", routeResponse.data);

        // Fetch customers
        const customersResponse = await axios.get(`${API_BASE_URL}/customers`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: page - 1,
            size: itemsPerPage,
            searchValue: searchQuery,
          },
        });
        console.log("Customers Response:", customersResponse.data);
        const customersData = customersResponse.data.data || [];
        if (customersData.length === 0) {
          console.warn("No customers data found in response");
        }
        setCustomers(customersData);

        // Fetch sales persons
        const salesResponse = await axios.get(`${API_BASE_URL}/salesperson`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: page - 1,
            size: itemsPerPage,
            searchValue: searchQuery,
          },
        });
        console.log("SalesPersons Response:", salesResponse.data);
        const salesData = salesResponse.data.data || [];
        setSalesPersons(salesData);

        // Fetch orders
        const ordersResponse = await axios.get(`${API_BASE_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: page - 1,
            size: itemsPerPage,
            searchValue: searchQuery,
          },
        });
        console.log("Orders Response:", ordersResponse.data);
        const ordersData = ordersResponse.data.data || [];
        setOrders(ordersData);

      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.state, page, searchQuery]);

  const stats = route ? [
    { 
      title: "Total Employees", 
      count: route.numberSalesPerson || 0, 
      icon: "mdi:account-group", 
      color: "bg-dark" 
    },
    { 
      title: "Active", 
      count: route.numberSalesPerson || 0, 
      icon: "mdi:account-check", 
      color: "bg-success" 
    },
    { 
      title: "Inactive", 
      count: 0, 
      icon: "mdi:account-off", 
      color: "bg-danger" 
    },
    { 
      title: "New Joiners", 
      count: Array.isArray(customers) && customers.length > 0 
        ? customers.filter(c => c.dateCreated && new Date(c.dateCreated) > new Date(Date.now() - 7*24*60*60*1000)).length 
        : 0,
      icon: "mdi:account-plus", 
      color: "bg-info" 
    },
  ] : [];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!route) return <div>No route data found</div>;

  const tables = {
    customers: (Array.isArray(customers) ? customers : []).map(c => {
      const customerOrders = orders.filter(o => o.customer?.id === c.id);
      console.log(`Mapping customer ${c.id}: Orders found = ${customerOrders.length}`);
      return {
        id: c.id || "",
        name: `${c.firstName || ""} ${c.lastName || ""}`.trim() || "Unknown",
        phoneNo: c.phoneNo || "",
        email: c.email || "",
        outletName: c.outletName || "",
        salesPersons: customerOrders[0]?.salesperson?.name || "",
        totalOrders: customerOrders.length,
        pendingOrders: customerOrders.filter(o => o.orderStatus?.code === "PEND").length,
        pendingPayments: customerOrders.reduce((sum, o) => 
          o.paymentStatus?.code === "NPD" ? sum + (o.amount || 0) : sum, 0),
      };
    }),
    orders: (Array.isArray(orders) ? orders : []).map(o => ({
      id: o.id || "",
      orderId: o.orderCode || "",
      amount: o.amount || 0,
      status: o.orderStatus?.name || "",
    })),
    salesPersons: (Array.isArray(salesPersons) ? salesPersons : []).map(s => ({
      id: s.id || "",
      name: `${s.firstName || ""} ${s.lastName || ""}`.trim() || "Unknown",
      route: s.route?.name || route.name || "",
      region: s.region?.name || "",
    })),
  };

  console.log("Tables Customers:", tables.customers);

  const filterOptions = [
    "Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Month", "Last Month", "Custom Range"
  ];

  const tableOptions = ["customers", "orders", "salesPersons"];
  const statusOptions = ["All", "Completed", "Pending", "Not Paid"];

  const filteredOrders = selectedStatus === "All"
    ? tables.orders
    : tables.orders.filter((order) => order.status === selectedStatus);

  const renderTable = () => {
    switch (selectedTable) {
      case "customers":
        return (
          <table className="table table-borderless text-start small-text">
            <thead className="table-light text-start small-text">
              <tr>
                <th className="text-start">#</th>
                <th className="text-start">Name</th>
                <th className="text-start">Phone No.</th>
                <th className="text-start">Email</th>
                <th className="text-start">Outlet Name</th>
                <th className="text-start">Sales Person</th>
                <th className="text-start">Total Orders</th>
                <th className="text-start">Pending Orders</th>
                <th className="text-start">Pending Payments</th>
              </tr>
            </thead>
            <tbody>
              {tables.customers.length > 0 ? (
                tables.customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="text-start small-text">{customer.id}</td>
                    <td className="text-start small-text">{customer.name}</td>
                    <td className="text-start small-text">{customer.phoneNo}</td>
                    <td className="text-start small-text">{customer.email}</td>
                    <td className="text-start small-text">{customer.outletName}</td>
                    <td className="text-start small-text">{customer.salesPersons}</td>
                    <td className="text-start small-text">{customer.totalOrders}</td>
                    <td className="text-start small-text">{customer.pendingOrders}</td>
                    <td className="text-start small-text">{formatCurrency(customer.pendingPayments)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-start small-text">No customers found</td>
                </tr>
              )}
            </tbody>
          </table>
        );
      case "orders":
        return (
          <table className="table table-borderless text-start small-text">
            <thead className="table-light text-start small-text">
              <tr>
                <th className="text-start">Order ID</th>
                <th className="text-start">Amount</th>
                <th className="text-start">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="text-start small-text">{order.orderId}</td>
                    <td className="text-start small-text">{formatCurrency(order.amount)}</td>
                    <td className="text-start small-text">{order.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-start small-text">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        );
      case "salesPersons":
        return (
          <table className="table table-borderless text-start small-text">
            <thead className="table-light text-start small-text">
              <tr>
                <th className="text-start">#</th>
                <th className="text-start">Name</th>
                <th className="text-start">Route</th>
                <th className="text-start">Region</th>
              </tr>
            </thead>
            <tbody>
              {tables.salesPersons.length > 0 ? (
                tables.salesPersons.map((person) => (
                  <tr key={person.id}>
                    <td className="text-start small-text">{person.id}</td>
                    <td className="text-start small-text">{person.name}</td>
                    <td className="text-start small-text">{person.route}</td>
                    <td className="text-start small-text">{person.region}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-start small-text">No sales persons found</td>
                </tr>
              )}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  return (
    <div className="page-wrapper">
      <div className="d-flex justify-content-end custom-right-align mb-24 mt-2">
        <div className="dropdown">
          <button
            className="btn btn-primary-600 bg-primary-50 border-primary-50 text-primary-600 hover-text-primary not-active px-18 py-11 dropdown-toggle toggle-icon"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            autoFocus
          >
            {selectedDateFilter || "Date Filter"}
          </button>
          <ul className="dropdown-menu">
            {filterOptions.map((option, index) => (
              <li key={index}>
                <button
                  className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                  onClick={() => setSelectedDateFilter(option)}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="row g-4 mb-3">
        {stats.map((item, index) => (
          <div className="col-lg-3 col-md-6 col-sm-12 d-flex" key={index}>
            <div className="card flex-fill full-width-card">
              <div className="card-body d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div className={`avatar avatar-lg ${item.color} rounded-circle d-flex align-items-center justify-content-center`}>
                    <Icon icon={item.icon} className="text-lg text-white" />
                  </div>
                  <div className="ms-2">
                    <p className="fs-8 fw-medium mb-1 text-truncate" style={{ fontSize: "12px" }}>{item.title}</p>
                    <h6 className="mb-0 fs-8 fw-bold">{item.count}</h6>
                  </div>
                </div>
                <div className="stat-change">
                  <span className="badge bg-light text-dark px-1 py-1 d-flex align-items-center gap-1">
                    <Icon icon="tabler:arrow-wave-right-up" className="text-xs text-success" />
                    <small className="fs-8">+19.01%</small>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card shadow-sm mt-3 full-width-card">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="dropdown">
              <button
                className="btn btn-primary-600 bg-primary-50 border-primary-50 text-primary-600 hover-text-primary not-active px-18 py-11 dropdown-toggle toggle-icon"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                autoFocus
              >
                {selectedTable ? selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1) : "Table"}
              </button>
              <ul className="dropdown-menu">
                {tableOptions.map((option, index) => (
                  <li key={index}>
                    <button
                      className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                      onClick={() => setSelectedTable(option)}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="dropdown">
              <button
                className="btn btn-primary-600 bg-primary-50 border-primary-50 text-primary-600 hover-text-primary not-active px-18 py-11 dropdown-toggle toggle-icon"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                autoFocus
              >
                {selectedStatus || "Status"}
              </button>
              <ul className="dropdown-menu">
                {statusOptions.map((option, index) => (
                  <li key={index}>
                    <button
                      className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                      onClick={() => setSelectedStatus(option)}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {renderTable()}
        </div>
      </div>
    </div>
  );
};

export default RouteDetails;