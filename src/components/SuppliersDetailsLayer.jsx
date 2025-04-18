import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Icon } from '@iconify/react';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import axios from 'axios';
import { formatDate, formatCurrency } from "../hook/format-utils";
import { Spinner } from "../hook/spinner-utils";
import DatePicker from "../hook/datePicker";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";

const API_URL = "https://api.bizchain.co.ke/v1/supplier-report";
const GRAPH_API_URL = "https://api.bizchain.co.ke/v1/supplier-report/graph";
const DELIVERIES_API_URL = "https://api.bizchain.co.ke/v1/supplier-deliveries";
const INVOICES_API_URL = "https://api.bizchain.co.ke/v1/invoice";

const StatsCards = ({ statsData }) => {
  const defaultStats = {
    supplies: { volume: 0, total: 0, deliveries: 0 },
    invoicedBills: { volume: 0, total: 0, deliveries: 0 },
    unpaidBills: { volume: 0, total: 0, deliveries: 0 },
    paidBills: { volume: 0, total: 0, deliveries: 0 },
  };

  const normalizedData = {
    supplies: {
      volume: statsData?.supplies?.volume ?? defaultStats.supplies.volume,
      total: statsData?.supplies?.total ?? defaultStats.supplies.total,
      deliveries: statsData?.supplies?.deliveries ?? defaultStats.supplies.deliveries,
    },
    invoicedBills: {
      volume: statsData?.invoicedBills?.volume ?? defaultStats.invoicedBills.volume,
      total: statsData?.invoicedBills?.total ?? defaultStats.invoicedBills.total,
      deliveries: statsData?.invoicedBills?.deliveries ?? defaultStats.invoicedBills.deliveries,
    },
    unpaidBills: {
      volume: statsData?.unpaidBills?.volume ?? defaultStats.unpaidBills.volume,
      total: statsData?.unpaidBills?.total ?? defaultStats.unpaidBills.total,
      deliveries: statsData?.unpaidBills?.deliveries ?? defaultStats.unpaidBills.deliveries,
    },
    paidBills: {
      volume: statsData?.paidBills?.volume ?? defaultStats.paidBills.volume,
      total: statsData?.paidBills?.total ?? defaultStats.paidBills.total,
      deliveries: statsData?.paidBills?.deliveries ?? defaultStats.paidBills.deliveries,
    },
  };

  return (
    <div className="row row-cols-xxxl-4 row-cols-lg-4 row-cols-sm-2 row-cols-1 gy-4 mb-4">
      <div className="col">
        <div className="card shadow-none border bg-gradient-start-1 h-100">
          <div className="card-body p-20">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <p className="fw-medium text-primary-light mb-1 fs-12">Total Supplies</p>
                <h6 className="mb-0 fs-10">{normalizedData.supplies.volume.toLocaleString()} Litres</h6>
              </div>
              <div className="w-50-px h-50-px bg-cyan rounded-circle d-flex justify-content-center align-items-center">
                <Icon icon="mdi:truck-delivery" className="text-white text-xxl mb-0" />
              </div>
            </div>
            <p className="fw-medium fs-12 text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
              <span className="fs-12 d-inline-flex align-items-center gap-1 text-success-main">
                <Icon icon="bxs:up-arrow" className="fs-12" />
                Deliveries: {normalizedData.supplies.deliveries}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card shadow-none border bg-gradient-start-2 h-100">
          <div className="card-body p-20">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <p className="fw-medium text-primary-light mb-1 fs-12">Unpaid Bills</p>
                <h6 className="mb-0 fs-10">{formatCurrency(normalizedData.unpaidBills.total)}</h6>
              </div>
              <div className="w-50-px h-50-px bg-purple rounded-circle d-flex justify-content-center align-items-center">
                <Icon icon="mdi:receipt" className="text-white text-xxl mb-0" />
              </div>
            </div>
            <p className="fw-medium fs-12 text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
              <span className="fs-12 d-inline-flex align-items-center gap-1 text-danger-main">
                <Icon icon="bxs:down-arrow" className="fs-12" />
                Volume: {normalizedData.unpaidBills.volume.toLocaleString()} Litres | Deliveries: {normalizedData.unpaidBills.deliveries}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card shadow-none border bg-gradient-start-3 h-100">
          <div className="card-body p-20">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <p className="fw-medium text-primary-light mb-1 fs-12">Invoiced</p>
                <h6 className="mb-0 fs-10">{formatCurrency(normalizedData.invoicedBills.total)}</h6>
              </div>
              <div className="w-50-px h-50-px bg-info rounded-circle d-flex justify-content-center align-items-center">
                <Icon icon="mdi:invoice" className="text-white text-xxl mb-0" />
              </div>
            </div>
            <p className="fw-medium fs-12 text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
              <span className="fs-12 d-inline-flex align-items-center gap-1 text-success-main">
                <Icon icon="bxs:up-arrow" className="fs-9" />
                Volume: {normalizedData.invoicedBills.volume.toLocaleString()} Litres | Deliveries: {normalizedData.invoicedBills.deliveries}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card shadow-none border bg-gradient-start-4 h-100">
          <div className="card-body p-20">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <p className="fw-medium text-primary-light mb-1 fs-12">Total Paid</p>
                <h6 className="mb-0 fs-10">{formatCurrency(normalizedData.paidBills.total)}</h6>
              </div>
              <div className="w-50-px h-50-px bg-success-main rounded-circle d-flex justify-content-center align-items-center">
                <Icon icon="mdi:credit-card-check" className="text-white text-xxl mb-0" />
              </div>
            </div>
            <p className="fw-medium fs-12 text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
              <span className="fs-12 d-inline-flex align-items-center gap-1 text-success-main">
                <Icon icon="bxs:up-arrow" className="fs-12" />
                Volume: {normalizedData.paidBills.volume.toLocaleString()} Litres | Deliveries: {normalizedData.paidBills.deliveries}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Volume Chart component
const VolumeChart = ({ supplierId, startDate, endDate }) => {
  const [graphData, setGraphData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const determineGrouping = (start, end) => {
    const diffDays = end.diff(start, 'days');
    const isThisYear = start.isSame(moment().startOf('year'), 'day') && end.isSame(moment().endOf('year'), 'day');
    const isLastYear = start.isSame(moment().subtract(1, 'year').startOf('year'), 'day') && end.isSame(moment().subtract(1, 'year').endOf('year'), 'day');

    if (isThisYear || isLastYear || diffDays >= 365) {
      return 'monthly';
    }
    if (diffDays > 31) {
      return 'weekly';
    }
    if (diffDays <= 31 && diffDays > 1) {
      return 'daily';
    }
    return 'hourly';
  };

  const getFallbackLabels = useCallback((grouping) => {
    if (grouping === 'hourly') {
      return [
        "12:00AM", "2:00AM", "4:00AM", "6:00AM", "8:00AM", "10:00AM",
        "12:00PM", "2:00PM", "4:00PM", "6:00PM", "8:00PM", "10:00PM"
      ];
    }
    if (grouping === 'daily') {
      const labels = [];
      let current = startDate.clone();
      while (current.isSameOrBefore(endDate)) {
        labels.push(current.format('DD/M'));
        current.add(1, 'day');
      }
      return labels;
    }
    if (grouping === 'weekly') {
      const labels = [];
      let current = startDate.clone().startOf('week');
      const end = endDate.clone().endOf('week');
      let weekNum = 1;
      while (current.isSameOrBefore(end)) {
        labels.push(`Week ${weekNum}`);
        current.add(1, 'week');
        weekNum++;
      }
      return labels;
    }
    if (grouping === 'monthly') {
      return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    }
    return [];
  }, [startDate, endDate]);

  const fetchGraphData = useCallback(async () => {
    if (!supplierId || !startDate || !endDate) {
      setError("Missing supplier ID or date range.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGraphData(null);

    const token = sessionStorage.getItem("token");
    if (!token || token.trim() === "") {
      setError("No authentication token found. Please log in.");
      setIsLoading(false);
      return;
    }

    const grouping = determineGrouping(startDate, endDate);
    const from = startDate.format('YYYY-MM-DD');
    const to = grouping === 'hourly' 
      ? endDate.clone().add(1, 'day').format('YYYY-MM-DD')
      : endDate.format('YYYY-MM-DD');

    try {
      const response = await axios.get(GRAPH_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          supplier: supplierId, 
          grouping, 
          from, 
          to, 
          type: 'supplier' 
        },
      });
      const data = response.data;
      if (data.labels && data.data) {
        setGraphData(data);
      } else {
        console.error("Invalid API response:", data);
        setError("Invalid data received from server.");
        setGraphData({
          title: "Supplier Deliveries",
          labels: getFallbackLabels(grouping),
          data: getFallbackLabels(grouping).map(() => ({ 
            volume: 0, 
            deliveries: 0, 
            value: 0,
            paidBills: 0,
            unPaidBills: 0,
            pendingBills: 0 
          })),
        });
      }
    } catch (err) {
      console.error("Error fetching graph data:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(err.response?.data?.message || "Failed to fetch graph data.");
      setGraphData({
        title: "Supplier Deliveries",
        labels: getFallbackLabels(grouping),
        data: getFallbackLabels(grouping).map(() => ({ 
          volume: 0, 
          deliveries: 0, 
          value: 0,
          paidBills: 0,
          unPaidBills: 0,
          pendingBills: 0 
        })),
      });
    } finally {
      setIsLoading(false);
    }
  }, [supplierId, startDate, endDate, getFallbackLabels]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  const chartSeries = graphData
    ? [
        {
          name: "Volume",
          data: graphData.data.map(item => item.volume || 0),
        },
      ]
    : [
        {
          name: "Volume",
          data: [],
        },
      ];

  const chartOptions = {
    chart: {
      type: "area",
      height: 264,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: graphData?.labels || [],
      labels: {
        style: { fontSize: "12px", fontWeight: 500 },
      },
    },
    yaxis: {
      title: {
        text: "Volume (Litres)",
        style: { fontSize: "14px", fontWeight: 600 },
        offsetX: -10,
      },
      labels: {
        formatter: (value) => `${value.toLocaleString()} L`,
        style: { fontSize: "12px", fontWeight: 500 },
        offsetX: -5,
        align: "center",
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (value) => `${value.toLocaleString()} Litres`,
      },
    },
    colors: ["#00D1FF"],
    grid: {
      borderColor: "#e7e7e7",
      strokeDashArray: 4,
      padding: { left: 5, right: 5 },
    },
  };

  const totalVolume = graphData
    ? graphData.data.reduce((sum, item) => sum + (item.volume || 0), 0)
    : 0;

  return (
    <div className="col-12 mt-3">
      <div className="card h-100">
        <div className="card-body">
          {isLoading && <div className="text-center py-3"><Spinner /></div>}
          {error && <div className="alert alert-danger">{error}</div>}
          {!isLoading && !error && (
            <>
              <div className="d-flex flex-wrap align-items-center justify-content-between">
                <h6 className="text-lg mb-0 fw-bold"> Supplier Deliveries </h6>
              </div>
              <div className="d-flex flex-wrap align-items-center gap-2 mt-8">
                <h6 className="mb-0 fs-10">{totalVolume.toLocaleString()} Litres</h6>
              </div>
              <ReactApexChart options={chartOptions} series={chartSeries} type="area" height={264} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Deliveries Table component
const DeliveriesTable = ({ supplierId, startDate, endDate }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDeliveries = useCallback(async () => {
    if (!supplierId) {
      setError("No supplier ID provided.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const token = sessionStorage.getItem("token");
    if (!token || token.trim() === "") {
      setError("No authentication token found. Please log in.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(DELIVERIES_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { supplier: supplierId },
      });
      const result = response.data;
      if (result.status.code === 0) {
        setDeliveries(result.data || []);
      } else {
        setError(`Failed to fetch deliveries: ${result.status.message}`);
        setDeliveries([]);
      }
    } catch (err) {
      console.error("Error fetching deliveries:", err);
      setError(err.response?.data?.message || "Failed to fetch deliveries.");
      setDeliveries([]);
    } finally {
      setIsLoading(false);
    }
  }, [supplierId]);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((item) => {
      const itemDate = moment(item.dateCreated);
      const isWithinDateRange = itemDate.isSameOrAfter(startDate, 'day') && itemDate.isSameOrBefore(endDate, 'day');
      const matchesStatus = filterStatus === "All" || item.status.name === filterStatus;
      return isWithinDateRange && matchesStatus;
    });
  }, [deliveries, filterStatus, startDate, endDate]);

  const paginatedDeliveries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDeliveries.slice(startIndex, endIndex);
  }, [filteredDeliveries, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage);

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="col-lg-6 mt-3">
      <div className="card h-auto">
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
            <h6 className="text-lg mb-0 fw-bold">Deliveries</h6>
            <select
              className="form-select bg-base form-select-sm w-auto"
              value={filterStatus}
              onChange={handleFilterChange}
            >
              <option value="All">All</option>
              <option value="Not Billed">Not Billed</option>
              <option value="Invoiced">Invoiced</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          {isLoading && <div className="text-center py-3"><Spinner /></div>}
          {error && <div className="alert alert-danger">{error}</div>}
          {!isLoading && !error && (
            <>
              <div className="table-responsive">
                <table className="table table-borderless">
                  <thead>
                    <tr>
                      <th className="text-center text-primary-light fw-semibold fs-12">ID</th>
                      <th className="text-primary-light fw-semibold fs-12">Volume (L)</th>
                      <th className="text-primary-light fw-semibold fs-12">Total Amount</th>
                      <th className="text-primary-light fw-semibold fs-12">Status</th>
                      <th className="text-primary-light fw-semibold fs-12">Date Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedDeliveries.map((item, index) => (
                      <tr key={item.id}>
                        <td className="text-center text-primary-light fs-12">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="text-primary-light fs-12">{item.litres.toLocaleString()} Litres</td>
                        <td className="text-primary-light fs-12">{formatCurrency(item.totalAmount)}</td>
                        <td className="text-primary-light fs-12">
                          <span
                            className={`badge ${
                              item.status.name === "Invoiced" || item.status.name === "Paid"
                                ? "bg-success-main"
                                : "bg-danger-main"
                            } text-white`}
                          >
                            {item.status.name}
                          </span>
                        </td>
                        <td className="text-primary-light fs-12">{formatDate(item.dateCreated)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!isLoading && paginatedDeliveries.length === 0 && (
                <div className="text-center py-3">No deliveries found</div>
              )}
              {!isLoading && paginatedDeliveries.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="text-muted" style={{ fontSize: "13px" }}>
                    <span>
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(currentPage * itemsPerPage, filteredDeliveries.length)} of{" "}
                      {filteredDeliveries.length} entries
                    </span>
                  </div>
                  <nav aria-label="Page navigation">
                    <ul className="pagination mb-0" style={{ gap: "6px" }}>
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                          className="page-link btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "24px", height: "24px", padding: "0", transition: "all 0.2s" }}
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <Icon icon="ri-arrow-drop-left-line" style={{ fontSize: "12px" }} />
                        </button>
                      </li>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                          <button
                            className={`page-link btn ${
                              currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"
                            } rounded-circle d-flex align-items-center justify-content-center`}
                            style={{
                              width: "30px",
                              height: "30px",
                              padding: "0",
                              transition: "all 0.2s",
                              fontSize: "10px",
                              color: currentPage === i + 1 ? "#fff" : "",
                            }}
                            onClick={() => handlePageChange(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button
                          className="page-link btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "24px", height: "24px", padding: "0", transition: "all 0.2s" }}
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <Icon icon="ri-arrow-drop-right-line" style={{ fontSize: "12px" }} />
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Invoices Table component
const InvoicesTable = ({ supplierId, startDate, endDate }) => {
  const [invoices, setInvoices] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInvoices = useCallback(async () => {
    if (!supplierId) {
      setError("No supplier ID provided.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const token = sessionStorage.getItem("token");
    if (!token || token.trim() === "") {
      setError("No authentication token found. Please log in.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(INVOICES_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { supplier: supplierId },
      });
      const result = response.data;
      if (result.status.code === 0) {
        setInvoices(result.data || []);
      } else {
        setError(`Failed to fetch invoices: ${result.status.message}`);
        setInvoices([]);
      }
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError(err.response?.data?.message || "Failed to fetch invoices.");
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  }, [supplierId]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filteredInvoices = useMemo(() => {
    return invoices
      .map((item) => ({
        ...item,
        computedVolume: item.deliveries.reduce((sum, d) => sum + (d.litres || 0), 0),
      }))
      .filter((item) => {
        const itemDate = moment(item.dateCreated);
        const isWithinDateRange = itemDate.isSameOrAfter(startDate, 'day') && itemDate.isSameOrBefore(endDate, 'day');
        const matchesStatus = filterStatus === "All" || item.status.name === filterStatus;
        return isWithinDateRange && matchesStatus;
      });
  }, [invoices, filterStatus, startDate, endDate]);

  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredInvoices.slice(startIndex, endIndex);
  }, [filteredInvoices, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="col-md-6 mt-3" style={{ flexGrow: 1 }}>
      <div className="card h-auto">
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
            <h6 className="text-lg mb-0 fw-bold">Invoices</h6>
            <select
              className="form-select bg-base form-select-sm w-auto"
              value={filterStatus}
              onChange={handleFilterChange}
            >
              <option value="All">All</option>
              <option value="Invoiced">Invoiced</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          {isLoading && <div className="text-center py-3"><Spinner /></div>}
          {error && <div className="alert alert-danger">{error}</div>}
          {!isLoading && !error && (
            <>
              <div className="table-responsive">
                <table className="table table-borderless">
                  <thead>
                    <tr>
                      <th className="text-center text-primary-light fw-semibold fs-12">ID</th>
                      <th className="text-primary-light fw-semibold fs-12">Invoice No.</th>
                      <th className="text-primary-light fw-semibold fs-12">Volume (L)</th>
                      <th className="text-primary-light fw-semibold fs-12">Total Amount</th>
                      <th className="text-primary-light fw-semibold fs-12">Status</th>
                      <th className="text-primary-light fw-semibold fs-12">Date Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedInvoices.map((item, index) => (
                      <tr key={item.id}>
                        <td className="text-center text-primary-light fs-12">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="text-primary-light fs-12">{item.invoiceNo}</td>
                        <td className="text-primary-light fs-12">{item.computedVolume.toLocaleString()} Litres</td>
                        <td className="text-primary-light fs-12">{formatCurrency(item.amount)}</td>
                        <td className="text-primary-light fs-12">
                          <span
                            className={`badge ${
                              item.status.name === "Invoiced" || item.status.name === "Paid"
                                ? "bg-success-main"
                                : "bg-danger-main"
                            } text-white`}
                          >
                            {item.status.name}
                          </span>
                        </td>
                        <td className="text-primary-light fs-12">{formatDate(item.dateCreated)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!isLoading && paginatedInvoices.length === 0 && (
                <div className="text-center py-3">No invoices found</div>
              )}
              {!isLoading && paginatedInvoices.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="text-muted" style={{ fontSize: "13px" }}>
                    <span>
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of{" "}
                      {filteredInvoices.length} entries
                    </span>
                  </div>
                  <nav aria-label="Page navigation">
                    <ul className="pagination mb-0" style={{ gap: "6px" }}>
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                          className="page-link btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "24px", height: "24px", padding: "0", transition: "all 0.2s" }}
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <Icon icon="ri-arrow-drop-left-line" style={{ fontSize: "12px" }} />
                        </button>
                      </li>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                          <button
                            className={`page-link btn ${
                              currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"
                            } rounded-circle d-flex align-items-center justify-content-center`}
                            style={{
                              width: "30px",
                              height: "30px",
                              padding: "0",
                              transition: "all 0.2s",
                              fontSize: "10px",
                              color: currentPage === i + 1 ? "#fff" : "",
                            }}
                            onClick={() => handlePageChange(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button
                          className="page-link btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "24px", height: "24px", padding: "0", transition: "all 0.2s" }}
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <Icon icon="ri-arrow-drop-right-line" style={{ fontSize: "12px" }} />
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Suppliers Details Layer component
const SuppliersDetailsLayer = () => {
  const location = useLocation();
  const supplierId = location.state?.supplierId || null;

  const [dateRange, setDateRange] = useState({
    start: moment().subtract(6, 'days'),
    end: moment(),
  });
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const fetchSupplierReport = useCallback(async () => {
    if (!supplierId) {
      setError("No supplier ID provided.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setStatsData(null);

    const token = sessionStorage.getItem("token");
    if (!token || token.trim() === "") {
      setError("No authentication token found. Please log in.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          supplier: supplierId,
          fromDate: dateRange.start.format('YYYY-MM-DD'),
          toDate: dateRange.end.format('YYYY-MM-DD'),
        },
      });
      const result = response.data;
      if (result.status.code === 0) {
        setStatsData(result.data);
      } else {
        setError(`Failed to fetch supplier report: ${result.status.message}`);
        setStatsData({
          supplies: { volume: 0, total: 0, deliveries: 0 },
          invoicedBills: { volume: 0, total: 0, deliveries: 0 },
          unpaidBills: { volume: 0, total: 0, deliveries: 0 },
          paidBills: { volume: 0, total: 0, deliveries: 0 },
        });
      }
    } catch (error) {
      console.error("Error fetching supplier report:", error);
      const message = error.response?.data?.message || error.message;
      if (error.response?.status === 403) {
        setError("Access forbidden: Please check your authentication token or permissions.");
      } else {
        setError(`Error fetching supplier report: ${message}`);
      }
      setStatsData({
        supplies: { volume: 0, total: 0, deliveries: 0 },
        invoicedBills: { volume: 0, total: 0, deliveries: 0 },
        unpaidBills: { volume: 0, total: 0, deliveries: 0 },
        paidBills: { volume: 0, total: 0, deliveries: 0 },
      });
    } finally {
      setIsLoading(false);
    }
  }, [supplierId, dateRange.start, dateRange.end]);

  const fetchDeliveries = useCallback(async () => {
    if (!supplierId) return;

    const token = sessionStorage.getItem("token");
    if (!token || token.trim() === "") return;

    try {
      const response = await axios.get(DELIVERIES_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { supplier: supplierId },
      });
      const result = response.data;
      if (result.status.code === 0) {
        setDeliveries(result.data || []);
      } else {
        setDeliveries([]);
      }
    } catch (err) {
      console.error("Error fetching deliveries:", err);
      setDeliveries([]);
    }
  }, [supplierId]);

  const fetchInvoices = useCallback(async () => {
    if (!supplierId) return;

    const token = sessionStorage.getItem("token");
    if (!token || token.trim() === "") return;

    try {
      const response = await axios.get(INVOICES_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { supplier: supplierId },
      });
      const result = response.data;
      if (result.status.code === 0) {
        setInvoices(result.data || []);
      } else {
        setInvoices([]);
      }
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setInvoices([]);
    }
  }, [supplierId]);

  useEffect(() => {
    fetchSupplierReport();
    fetchDeliveries();
    fetchInvoices();
  }, [fetchSupplierReport, fetchDeliveries, fetchInvoices]);

  const handleDateChange = (start, end) => {
    setDateRange({ start, end });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Supplier Report", 14, 20);

    // Deliveries Table
    doc.text("Deliveries", 14, 30);
    autoTable(doc, {
      head: [["ID", "Volume (Litres)", "Total Amount", "Status", "Date Created"]],
      body: deliveries
        .filter((item) => {
          const itemDate = moment(item.dateCreated);
          return itemDate.isSameOrAfter(dateRange.start, 'day') && itemDate.isSameOrBefore(dateRange.end, 'day');
        })
        .map((item, index) => [
          index + 1,
          item.litres.toLocaleString(),
          formatCurrency(item.totalAmount),
          item.status.name,
          formatDate(item.dateCreated),
        ]),
      startY: 40,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
    });

    // Invoices Table
    const lastY = doc.lastAutoTable.finalY + 10;
    doc.text("Invoices", 14, lastY);
    autoTable(doc, {
      head: [["ID", "Invoice No.", "Volume (Litres)", "Total Amount", "Status", "Date Created"]],
      body: invoices
        .filter((item) => {
          const itemDate = moment(item.dateCreated);
          return itemDate.isSameOrAfter(dateRange.start, 'day') && itemDate.isSameOrBefore(dateRange.end, 'day');
        })
        .map((item, index) => [
          index + 1,
          item.invoiceNo,
          item.deliveries.reduce((sum, d) => sum + (d.litres || 0), 0).toLocaleString(),
          formatCurrency(item.amount),
          item.status.name,
          formatDate(item.dateCreated),
        ]),
      startY: lastY + 10,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
    });

    doc.save("supplier_report.pdf");
  };

  const exportToCSV = () => {
    const deliveriesData = deliveries
      .filter((item) => {
        const itemDate = moment(item.dateCreated);
        return itemDate.isSameOrAfter(dateRange.start, 'day') && itemDate.isSameOrBefore(dateRange.end, 'day');
      })
      .map((item, index) => ({
        ID: index + 1,
        "Volume (Litres)": item.litres.toLocaleString(),
        "Total Amount": formatCurrency(item.totalAmount),
        Status: item.status.name,
        "Date Created": formatDate(item.dateCreated),
      }));

    const invoicesData = invoices
      .filter((item) => {
        const itemDate = moment(item.dateCreated);
        return itemDate.isSameOrAfter(dateRange.start, 'day') && itemDate.isSameOrBefore(dateRange.end, 'day');
      })
      .map((item, index) => ({
        ID: index + 1,
        "Invoice No.": item.invoiceNo,
        "Volume (Litres)": item.deliveries.reduce((sum, d) => sum + (d.litres || 0), 0).toLocaleString(),
        "Total Amount": formatCurrency(item.amount),
        Status: item.status.name,
        "Date Created": formatDate(item.dateCreated),
      }));

    const csvData = [
      { Type: "Deliveries" },
      ...deliveriesData,
      { Type: "Invoices" },
      ...invoicesData,
    ];

    const csv = Papa.unparse(csvData, {
      quotes: true,
      delimiter: ",",
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "supplier_report.csv";
    link.click();
  };

  return (
    <>
      {isLoading && (
        <div className="card h-100 p-0 radius-12">
          <div className="card-body-table p-24 text-center">
            <Spinner />
          </div>
        </div>
      )}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
      {!isLoading && !error && statsData && (
        <>
          <div className="d-flex justify-content-end align-items-center mb-3 gap-3">
            <div className="me-3">
              <DatePicker
                startDate={dateRange.start}
                endDate={dateRange.end}
                onDateChange={handleDateChange}
              />
            </div>
            <div className="export-dropdown">
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <Icon icon="mdi:file-send-outline" className="text-xl icon-green-hover" />
                  Export
                  <Icon icon="mdi:chevron-down" className="text-2xl text-gray-800" />
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button className="dropdown-item d-flex align-items-center gap-2" onClick={exportToPDF}>
                      <Icon icon="mdi:file-pdf-box" className="text-xl text-danger-600" />
                      Export as PDF
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item d-flex align-items-center gap-2" onClick={exportToCSV}>
                      <Icon icon="mdi:file-excel" className="text-xl text-success-600" />
                      Export as CSV
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <StatsCards statsData={statsData} />
          <div className="row">
            <VolumeChart supplierId={supplierId} startDate={dateRange.start} endDate={dateRange.end} />
            <DeliveriesTable supplierId={supplierId} startDate={dateRange.start} endDate={dateRange.end} />
            <InvoicesTable supplierId={supplierId} startDate={dateRange.start} endDate={dateRange.end} />
          </div>
        </>
      )}
    </>
  );
};

export default SuppliersDetailsLayer;