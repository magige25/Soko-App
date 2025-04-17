import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const RegionDetails = () => {
  const location = useLocation();
  const defaultRegion = {
    name: "",
    salesPersons: 0,
    customers: 0,
    country: "N/A",
    dateCreated: null,
  };
  
  const region = location.state?.region || defaultRegion;
  console.log("location.state:", location.state);
  console.log("Region data:", region);

  const [selectedTable, setSelectedTable] = useState("customers");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDateFilter, setSelectedDateFilter] = useState("");

  const stats = [
    { title: "Total Employees", count: region.salesPersons || 1007, icon: "mdi:account-group", color: "bg-dark" },
    { title: "Active", count: region.salesPersons || 1007, icon: "mdi:account-check", color: "bg-success" },
    { title: "Inactive", count: 0, icon: "mdi:account-off", color: "bg-danger" },
    { title: "New Joiners", count: 67, icon: "mdi:account-plus", color: "bg-info" },
  ];

  if (!region) {
    return <div>No region data found</div>;
  }

  const tables = {
    customers: [
      { id: 1, name: "Murimi", phoneNO: 746779784, email: "customerA@example.com", salesPersons: "James", totalOrders: 12, pendingOrders: 4, pendingPayments: 2000 },
      { id: 2, name: "Mamboleo", phoneNO: 746779784, email: "customerB@example.com", salesPersons: "Leah", totalOrders: 22, pendingOrders: 8, pendingPayments: 1200 },
      { id: 3, name: "Doktari", phoneNO: 746779784, email: "customerC@example.com", salesPersons: "Steve", totalOrders: 16, pendingOrders: 7, pendingPayments: 10500 },
    ],
    orders: [
      { id: 1, orderId: "ORD123", amount: 100, status: "Completed" },
      { id: 2, orderId: "ORD124", amount: 200, status: "Pending" },
      { id: 3, orderId: "ORD125", amount: 200, status: "Defaulted" },
      { id: 3, orderId: "ORD125", amount: 200, status: "Defaulted" },
    ],
    salesPersons: [
      { id: 1, name: "Agent X", region: region.name || "Nyanza" },
      { id: 2, name: "Agent Y", region: region.name || "Coastal" },
      { id: 3, name: "Agent Z", region: region.name || "Nairobi" },
    ],
  };

  const filterOptions = [
    "Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Month", "Last Month", "Custom Range"
  ];

  const tableOptions = ["customers", "orders", "salesPersons"];
  const statusOptions = ["All", "Completed", "Pending", "Defaulted"];

  const filteredOrders = selectedStatus === "All"
    ? tables.orders
    : tables.orders.filter((order) => order.status === selectedStatus);

  const renderTable = () => {
    console.log("Selected table:", selectedTable);
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
                <th className="text-start">Sales Persons</th>
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
                  <td className="text-start small-text">{customer.salesPersons}</td>
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
      case "salesPersons":
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
              {tables.salesPersons.map((agent) => (
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

export default RegionDetails;