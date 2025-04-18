import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Icon } from '@iconify/react';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import axios from 'axios';
import { formatCurrency } from "../hook/format-utils";
import { Spinner } from "../hook/spinner-utils";
import DatePicker from "../hook/datePicker";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";

const API_URL = "https://api.bizchain.co.ke/v1/supplier-report";
const GRAPH_API_URL = "https://api.bizchain.co.ke/v1/supplier-report/graph";
const TOP_SUPPLIERS_API_URL = "https://api.bizchain.co.ke/v1/supplier-report/top-supplier";
const TOP_REGIONS_API_URL = "https://api.bizchain.co.ke/v1/supplier-report/top-region";

// Stats Cards component
const StatsCards = ({ statsData, isLoading, error }) => {
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
      {isLoading && (
        <div className="col-12 text-center py-3">
          <Spinner />
        </div>
      )}
      {error && (
        <div className="col-12">
          <div className="alert alert-danger">{error}</div>
        </div>
      )}
      {!isLoading && !error && (
        <>
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
                    Volume: {normalizedData.unpaidBills.volume?.toLocaleString() ?? 0} Litres | Deliveries: {normalizedData.unpaidBills.deliveries}
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
                    <Icon icon="bxs:up-arrow" className="fs-12" />
                    Volume: {normalizedData.invoicedBills.volume?.toLocaleString() ?? 0} Litres | Deliveries: {normalizedData.invoicedBills.deliveries}
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
                    Volume: {normalizedData.paidBills.volume?.toLocaleString() ?? 0} Litres | Deliveries: {normalizedData.paidBills.deliveries}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Graph 1: Supplies vs. Time
const SuppliesChart = ({ startDate, endDate }) => {
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
    if (!startDate || !endDate) {
      setError("Missing date range.");
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
          grouping, 
          from, 
          to, 
          type: 'supplies' 
        },
      });
      const data = response.data;
      if (data.labels && data.data) {
        setGraphData(data);
      } else {
        setError("Invalid data received from server.");
        setGraphData({
          title: "Supplies",
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
      console.error("Error fetching graph data:", err);
      setError(err.response?.data?.message || "Failed to fetch graph data.");
      setGraphData({
        title: "Supplies",
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
  }, [startDate, endDate, getFallbackLabels]);

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
        text: "Supplies (Litres)",
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
      custom: ({ series, seriesIndex, dataPointIndex }) => {
        const data = graphData?.data[dataPointIndex] || {};
        return `
          <div class="apexcharts-tooltip-custom p-2">
            <div><strong>${data.label || 'N/A'}</strong></div>
            <div>Volume: ${data.volume?.toLocaleString() || 0} Litres</div>
            <div>Paid Bills: Kshs ${data.paidBills?.toLocaleString() || 0}</div>
            <div>Unpaid Bills: Kshs ${data.unPaidBills?.toLocaleString() || 0}</div>
            <div>Deliveries: ${data.deliveries || 0}</div>
          </div>
        `;
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
                <h6 className="text-lg mb-0 fw-bold"> Supplies </h6>
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

// Graph 2: Total vs. Time
const TotalChart = ({ startDate, endDate }) => {
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
    if (!startDate || !endDate) {
      setError("Missing date range.");
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
          grouping, 
          from, 
          to, 
          type: 'supplies' 
        },
      });
      const data = response.data;
      if (data.labels && data.data) {
        setGraphData(data);
      } else {
        setError("Invalid data received from server.");
        setGraphData({
          title: "Total Amount",
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
      console.error("Error fetching graph data:", err);
      setError(err.response?.data?.message || "Failed to fetch graph data.");
      setGraphData({
        title: "Total Amount",
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
  }, [startDate, endDate, getFallbackLabels]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  const chartSeries = graphData
    ? [
        {
          name: "Total Amount",
          data: graphData.data.map(item => item.paidBills || 0),
        },
      ]
    : [
        {
          name: "Total Amount",
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
        text: "Total Amount (Kshs)",
        style: { fontSize: "14px", fontWeight: 600 },
        offsetX: -10,
      },
      labels: {
        formatter: (value) => `Kshs ${value.toLocaleString()}`,
        style: { fontSize: "12px", fontWeight: 500 },
        offsetX: 0,
        align: "center",
      },
    },
    tooltip: {
      enabled: true,
      custom: ({ series, seriesIndex, dataPointIndex }) => {
        const data = graphData?.data[dataPointIndex] || {};
        return `
          <div class="apexcharts-tooltip-custom p-2">
            <div><strong>${data.label || 'N/A'}</strong></div>
            <div>Total Amount: Kshs ${data.paidBills?.toLocaleString() || 0}</div>
            <div>Volume: ${data.volume?.toLocaleString() || 0} Litres</div>
          </div>
        `;
      },
    },
    colors: ["#FFA500"],
    grid: {
      borderColor: "#e7e7e7",
      strokeDashArray: 4,
      padding: { left: 5, right: 5 },
    },
  };

  const totalAmount = graphData
    ? graphData.data.reduce((sum, item) => sum + (item.paidBills || 0), 0)
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
                <h6 className="text-lg mb-0 fw-bold"> Total Amount </h6>
              </div>
              <div className="d-flex flex-wrap align-items-center gap-2 mt-8">
                <h6 className="mb-0 fs-10">Kshs {totalAmount.toLocaleString()}</h6>
              </div>
              <ReactApexChart options={chartOptions} series={chartSeries} type="area" height={264} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Table 1: Top Suppliers
const TopSuppliersTable = ({ startDate, endDate }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuppliers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const token = sessionStorage.getItem("token");
    if (!token || token.trim() === "") {
      setError("No authentication token found. Please log in.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(TOP_SUPPLIERS_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: 0,
          size: 5,
          fromDate: startDate.format('YYYY-MM-DD'),
          toDate: endDate.format('YYYY-MM-DD'),
        },
      });
      const result = response.data;
      if (result.status.code === 0) {
        setSuppliers(result.data || []);
      } else {
        setError(`Failed to fetch top suppliers: ${result.status.message}`);
        setSuppliers([]);
      }
    } catch (err) {
      console.error("Error fetching top suppliers:", err);
      setError(err.response?.data?.message || "Failed to fetch top suppliers.");
      setSuppliers([]);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const paginatedSuppliers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return suppliers.slice(startIndex, endIndex);
  }, [suppliers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(suppliers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="col-lg-6 mt-3">
      <div className="card h-auto">
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
            <h6 className="text-lg mb-0 fw-bold">Top Suppliers</h6>
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
                      <th className="text-primary-light fw-semibold fs-12">Name</th>
                      <th className="text-primary-light fw-semibold fs-12">Phone Number</th>
                      <th className="text-primary-light fw-semibold fs-12">Deliveries</th>
                      <th className="text-primary-light fw-semibold fs-12">Volume (L)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSuppliers.map((item, index) => (
                      <tr key={item.id}>
                        <td className="text-center text-primary-light fs-12">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="text-primary-light fs-12">{`${item.firstName} ${item.lastName}`}</td>
                        <td className="text-primary-light fs-12">{item.phone}</td>
                        <td className="text-primary-light fs-12">{item.deliveries}</td>
                        <td className="text-primary-light fs-12">{item.volume.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!isLoading && paginatedSuppliers.length === 0 && (
                <div className="text-center py-3">No suppliers found</div>
              )}
              {!isLoading && paginatedSuppliers.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="text-muted" style={{ fontSize: "13px" }}>
                    <span>
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(currentPage * itemsPerPage, suppliers.length)} of{" "}
                      {suppliers.length} entries
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

// Table 2: Top Supply Regions
const TopSupplyRegionsTable = ({ startDate, endDate }) => {
  const [regions, setRegions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRegions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const token = sessionStorage.getItem("token");
    if (!token || token.trim() === "") {
      setError("No authentication token found. Please log in.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(TOP_REGIONS_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: 0,
          size: 5,
          fromDate: startDate.format('YYYY-MM-DD'),
          toDate: endDate.format('YYYY-MM-DD'),
        },
      });
      const result = response.data;
      if (result.status.code === 0) {
        setRegions(result.data || []);
      } else {
        setError(`Failed to fetch top regions: ${result.status.message}`);
        setRegions([]);
      }
    } catch (err) {
      console.error("Error fetching top regions:", err);
      setError(err.response?.data?.message || "Failed to fetch top regions.");
      setRegions([]);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  const paginatedRegions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return regions.slice(startIndex, endIndex);
  }, [regions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(regions.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="col-lg-6 mt-3">
      <div className="card h-auto">
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
            <h6 className="text-lg mb-0 fw-bold">Top Regions</h6>
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
                      <th className="text-primary-light fw-semibold fs-12">Name</th>
                      <th className="text-primary-light fw-semibold fs-12">Volume (L)</th>
                      <th className="text-primary-light fw-semibold fs-12">Deliveries</th>
                      <th className="text-primary-light fw-semibold fs-12">Suppliers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRegions.map((item, index) => (
                      <tr key={item.id}>
                        <td className="text-center text-primary-light fs-12">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="text-primary-light fs-12">{item.name}</td>
                        <td className="text-primary-light fs-12">{item.volume.toLocaleString()}</td>
                        <td className="text-primary-light fs-12">{item.deliveries}</td>
                        <td className="text-primary-light fs-12">{item.suppliers}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!isLoading && paginatedRegions.length === 0 && (
                <div className="text-center py-3">No regions found</div>
              )}
              {!isLoading && paginatedRegions.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="text-muted" style={{ fontSize: "13px" }}>
                    <span>
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(currentPage * itemsPerPage, regions.length)} of{" "}
                      {regions.length} entries
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

// Main SuppliesLayer component
const SuppliesLayer = () => {
  const [dateRange, setDateRange] = useState({
    start: moment().subtract(6, 'days'),
    end: moment(),
  });
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatsData = useCallback(async () => {
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
          fromDate: dateRange.start.format('YYYY-MM-DD'),
          toDate: dateRange.end.format('YYYY-MM-DD'),
        },
      });
      const result = response.data;
      if (result.status.code === 0) {
        setStatsData(result.data);
      } else {
        setError(`Failed to fetch stats: ${result.status.message}`);
        setStatsData({
          supplies: { volume: 0, total: 0, deliveries: 0 },
          invoicedBills: { volume: 0, total: 0, deliveries: 0 },
          unpaidBills: { volume: 0, total: 0, deliveries: 0 },
          paidBills: { volume: 0, total: 0, deliveries: 0 },
        });
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError(err.response?.data?.message || "Failed to fetch stats.");
      setStatsData({
        supplies: { volume: 0, total: 0, deliveries: 0 },
        invoicedBills: { volume: 0, total: 0, deliveries: 0 },
        unpaidBills: { volume: 0, total: 0, deliveries: 0 },
        paidBills: { volume: 0, total: 0, deliveries: 0 },
      });
    } finally {
      setIsLoading(false);
    }
  }, [dateRange.start, dateRange.end]);

  useEffect(() => {
    fetchStatsData();
  }, [fetchStatsData]);

  const handleDateChange = (start, end) => {
    setDateRange({ start, end });
  };

  const exportTopSuppliersToPDF = () => {
    const doc = new jsPDF();
    doc.text("Top Suppliers", 14, 20);

    axios.get(TOP_SUPPLIERS_API_URL, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      params: {
        page: 0,
        size: 5,
        fromDate: dateRange.start.format('YYYY-MM-DD'),
        toDate: dateRange.end.format('YYYY-MM-DD'),
      },
    }).then(response => {
      const filteredData = response.data.data || [];
      autoTable(doc, {
        head: [["ID", "Name", "Phone Number", "Deliveries", "Volume (Litres)"]],
        body: filteredData.map((item, index) => [
          index + 1,
          `${item.firstName} ${item.lastName}`,
          item.phone,
          item.deliveries,
          item.volume.toLocaleString(),
        ]),
        startY: 30,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
        styles: { fontSize: 8 },
      });
      doc.save("top_suppliers.pdf");
    }).catch(err => {
      console.error("Error exporting PDF:", err);
    });
  };

  const exportTopSuppliersToCSV = () => {
    axios.get(TOP_SUPPLIERS_API_URL, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      params: {
        page: 0,
        size: 5,
        fromDate: dateRange.start.format('YYYY-MM-DD'),
        toDate: dateRange.end.format('YYYY-MM-DD'),
      },
    }).then(response => {
      const filteredData = response.data.data || [];
      const csvData = filteredData.map((item, index) => ({
        ID: index + 1,
        Name: `${item.firstName} ${item.lastName}`,
        "Phone Number": item.phone,
        Deliveries: item.deliveries,
        "Volume (Litres)": item.volume.toLocaleString(),
      }));

      const csv = Papa.unparse(csvData, {
        quotes: true,
        delimiter: ",",
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "top_suppliers.csv";
      link.click();
    }).catch(err => {
      console.error("Error exporting CSV:", err);
    });
  };

  const exportTopSupplyRegionsToPDF = () => {
    const doc = new jsPDF();
    doc.text("Top Supply Regions", 14, 20);

    axios.get(TOP_REGIONS_API_URL, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      params: {
        page: 0,
        size: 5,
        fromDate: dateRange.start.format('YYYY-MM-DD'),
        toDate: dateRange.end.format('YYYY-MM-DD'),
      },
    }).then(response => {
      const filteredData = response.data.data || [];
      autoTable(doc, {
        head: [["Name", "Volume (Litres)", "Deliveries", "Suppliers"]],
        body: filteredData.map(item => [
          item.name,
          item.volume.toLocaleString(),
          item.deliveries,
          item.suppliers,
        ]),
        startY: 30,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
        styles: { fontSize: 8 },
      });
      doc.save("top_supply_regions.pdf");
    }).catch(err => {
      console.error("Error exporting PDF:", err);
    });
  };

  const exportTopSupplyRegionsToCSV = () => {
    axios.get(TOP_REGIONS_API_URL, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      params: {
        page: 0,
        size: 5,
        fromDate: dateRange.start.format('YYYY-MM-DD'),
        toDate: dateRange.end.format('YYYY-MM-DD'),
      },
    }).then(response => {
      const filteredData = response.data.data || [];
      const csvData = filteredData.map(item => ({
        Name: item.name,
        "Volume (Litres)": item.volume.toLocaleString(),
        Deliveries: item.deliveries,
        Suppliers: item.suppliers,
      }));

      const csv = Papa.unparse(csvData, {
        quotes: true,
        delimiter: ",",
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "top_supply_regions.csv";
      link.click();
    }).catch(err => {
      console.error("Error exporting CSV:", err);
    });
  };

  return (
    <>
      <div className="d-flex justify-content-end align-items-center mb-3 gap-3" >
        <div className="custom-date-picker">
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
            <ul className="dropdown-menu" style={{ minWidth: "auto", width: "260px" }}>
              <li>
                <button className="dropdown-item d-flex align-items-center gap-2" onClick={exportTopSuppliersToPDF}>
                  <Icon icon="mdi:file-pdf-box" className="text-xl text-danger-600" />
                  Export Top Suppliers as PDF
                </button>
              </li>
              <li>
                <button className="dropdown-item d-flex align-items-center gap-2" onClick={exportTopSuppliersToCSV}>
                  <Icon icon="mdi:file-excel" className="text-xl text-success-600" />
                  Export Top Suppliers as CSV
                </button>
              </li>
              <li>
                <button className="dropdown-item d-flex align-items-center gap-2" onClick={exportTopSupplyRegionsToPDF}>
                  <Icon icon="mdi:file-pdf-box" className="text-xl text-danger-600" />
                  Export Top Supply Regions as PDF
                </button>
              </li>
              <li>
                <button className="dropdown-item d-flex align-items-center gap-2" onClick={exportTopSupplyRegionsToCSV}>
                  <Icon icon="mdi:file-excel" className="text-xl text-success-600" />
                  Export Top Supply Regions as CSV
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <StatsCards statsData={statsData} isLoading={isLoading} error={error} />
      <div className="row">
        <SuppliesChart startDate={dateRange.start} endDate={dateRange.end} />
        <TotalChart startDate={dateRange.start} endDate={dateRange.end} />
        <TopSuppliersTable startDate={dateRange.start} endDate={dateRange.end} />
        <TopSupplyRegionsTable startDate={dateRange.start} endDate={dateRange.end} />
      </div>
    </>
  );
};

export default SuppliesLayer;