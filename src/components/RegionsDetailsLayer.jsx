import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { useLocation, useParams, } from "react-router-dom";

const RegionDetails = () => {
  const location = useLocation();
  const { regionName } = useParams();
  const { region } = location.state || { region: { name: "Default Region" } };
  console.log("Region data:", region);

  const [selectedTable, setSelectedTable] = useState("customers");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const stats = [
    { title: "Total Employees", count: 1007, icon: "mdi:account-group", color: "bg-dark" },
    { title: "Active", count: 1007, icon: "mdi:account-check", color: "bg-success" },
    { title: "Inactive", count: 1007, icon: "mdi:account-off", color: "bg-danger" },
    { title: "New Joiners", count: 67, icon: "mdi:account-plus", color: "bg-info" },
  ];

  if (!region) {
    return <div>No region data found for {regionName}</div>;
  }

  const tables = {
    customers: [
      { id: 1, name: "Customer A", phoneNO: 746779784, email: "customerA@example.com", salesAgents: "James", totalOrders: 12, pendingOrders: 4, pendingPayments: 2000 },
      { id: 2, name: "Customer B", phoneNO: 746779784, email: "customerB@example.com", salesAgents: "Leah", totalOrders: 22, pendingOrders: 8, pendingPayments: 1200 },
      { id: 3, name: "Customer C", phoneNO: 746779784, email: "customerC@example.com", salesAgents: "Steve", totalOrders: 16, pendingOrders: 7, pendingPayments: 10500 },
    ],
    orders: [
      { id: 1, orderId: "ORD123", amount: 100, status: "Completed" },
      { id: 2, orderId: "ORD124", amount: 200, status: "Pending" },
      { id: 3, orderId: "ORD125", amount: 200, status: "Defaulted" },
    ],
    salesAgents: [
      { id: 1, name: "Agent X", region: "Nyanza" },
      { id: 2, name: "Agent Y", region: "Coastal" },
      { id: 3, name: "Agent Z", region: "Nairobi" },
    ],
  };
  
  const filterOptions = [
      "Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Month", "Last Month", "Custom Range"
    ];

  const filteredOrders = selectedStatus === "All"
    ? tables.orders
    : tables.orders.filter(order => order.status === selectedStatus);

  const renderTable = () => {
  console.log("Selected table:", selectedTable); // Log the selected table
  console.log("Table data:", tables[selectedTable]); 
    switch (selectedTable) {
      case "customers":
        return (
          <table className="table table-borderless text-start small-text">
            <thead className="table-light text-start small-text">
              <tr>
                <th className="text-start">#</th>
                <th className="text-start">Name</th>
                <th className="text-start">Phone NO.</th>
                <th className="text-start">Email</th>
                <th className="text-start">Sales Agent</th>
                <th className="text-start">Total Orders</th>
                <th className="text-start">Pending Orders</th>
                <th className="text-start">Pending Payments</th>
              </tr>
            </thead>
            <tbody>
              {tables.customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="text-start small-text">{customer.id}</td>
                  <td className="text-start small-text">{customer.name}</td>
                  <td className="text-start small-text">{customer.phoneNO}</td>
                  <td className="text-start small-text">{customer.email}</td>
                  <td className="text-start small-text">{customer.salesAgents}</td>
                  <td className="text-start small-text">{customer.totalOrders}</td>
                  <td className="text-start small-text">{customer.pendingOrders}</td>
                  <td className="text-start small-text">{customer.pendingPayments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "orders":
        return (
          <table className="table table-borderless text-start small-text">
            <thead className="table-light text-start small-text">
              <tr>
                <th className="text-start">#</th>
                <th className="text-start">Order ID</th>
                <th className="text-start">Amount</th>
                <th className="text-start">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="text-start small-text">{order.id}</td>
                  <td className="text-start small-text">{order.orderId}</td>
                  <td className="text-start small-text">${order.amount}</td>
                  <td className="text-start small-text">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "salesAgents":
        return (
          <table className="table table-borderless text-start small-text">
            <thead className="table-light text-start small-text">
              <tr>
                <th className="text-start">#</th>
                <th className="text-start">Name</th>
                <th className="text-start">Region</th>
              </tr>
            </thead>
            <tbody>
              {tables.salesAgents.map((agent) => (
                <tr key={agent.id}>
                  <td className="text-start small-text">{agent.id}</td>
                  <td className="text-start small-text">{agent.name}</td>
                  <td className="text-start small-text">{agent.region}</td>
                </tr>
              ))}
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
            className="btn btn-primary-600 bg-primary-50 border-primary-50 text-primary-600 hover-text-primary not-active px-18 py-11 dropdown-toggle"
            type="button"
            id="dateFilterDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Date Filter
          </button>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dateFilterDropdown">
            {filterOptions.map((option, index) => (
              <li key={index}>
                <button className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900" type="button">
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="row g-2">
        {stats.map((item, index) => (
          <div className="col-lg-3 col-md-6 col-sm-12 d-flex" key={index}>
            <div className="card flex-fill full-width-card">
              <div className="card-body d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div className={`avatar avatar-lg ${item.color} rounded-circle d-flex align-items-center justify-content-center`}>
                    <Icon icon={item.icon} className="text-lg text-white" />
                  </div>
                  <div className="ms-2">
                    <p className="fs-8 fw-medium mb-1 text-truncate">{item.title}</p>
                    <h6 className="mb-0 fs-8 fw-bold">{item.count}</h6>
                  </div>
                </div>
                <div className="stat-change">
                  <span className="badge bg-light text-dark px-1 py-1 d-flex align-items-center gap-1">
                    <Icon icon="mdi:trending-up" className="text-xs text-success" />
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
            <div className="dropdown d-flex align-items-center justify-content-between mb-3 bg-light">
              <button className="btn btn-white dropdown-toggle" data-bs-toggle="dropdown">
                Select Table
              </button>
              <ul className="dropdown-menu dropdown-menu-end p-3">
                <li><button className="dropdown-item" onClick={() => setSelectedTable("customers")}>Customers</button></li>
                <li><button className="dropdown-item" onClick={() => setSelectedTable("orders")}>Orders</button></li>
                <li><button className="dropdown-item" onClick={() => setSelectedTable("salesAgents")}>Sales Agents</button></li>
              </ul>
            </div>
            <div className="dropdown d-flex align-items-center justify-content-between mb-3 bg-light">
              <button className="btn btn-white dropdown-toggle" data-bs-toggle="dropdown">
                Select Status
              </button>
              <ul className="dropdown-menu dropdown-menu-end p-3">
                <li><button className="dropdown-item" onClick={() => setSelectedStatus("All")}>All</button></li>
                <li><button className="dropdown-item" onClick={() => setSelectedStatus("Completed")}>Completed</button></li>
                <li><button className="dropdown-item" onClick={() => setSelectedStatus("Pending")}>Pending</button></li>
                <li><button className="dropdown-item" onClick={() => setSelectedStatus("Defaulted")}>Defaulted</button></li>
              </ul>
            </div>
          </div>
          {renderTable()}
        </div>
      </div>
    </div>
  );
};

export default RegionDetails;