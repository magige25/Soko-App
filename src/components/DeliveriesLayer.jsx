import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Spinner } from "../hook/spinner-utils";
import { formatDate, formatCurrency } from "../hook/format-utils";
import moment from "moment";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import DatePicker from "../hook/datePicker";

const API_URL = "https://api.bizchain.co.ke/v1/supplier-deliveries";
const STATS_API_URL = "https://api.bizchain.co.ke/v1/supplier-report";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

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
                    <p className="fw-medium text-primary-light mb-1 fs-12">Total Volume</p>
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
            <div className="card shadow-none border bg-gradient-start-3 h-100">
              <div className="card-body p-20">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div>
                    <p className="fw-medium text-primary-light mb-1 fs-12">Unpaid</p>
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
            <div className="card shadow-none border bg-gradient-start-4 h-100">
              <div className="card-body p-20">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div>
                    <p className="fw-medium text-primary-light mb-1 fs-12">Paid</p>
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

// Main DeliveriesLayer component
const DeliveriesLayer = () => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState({
    start: moment().subtract(6, "days"),
    end: moment(),
  });
  const [deliveryToDelete, setDeliveryToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statsError, setStatsError] = useState(null);
  const debouncedQuery = useDebounce(query, 300);

  const fetchStatsData = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(null);
    setStatsData(null);

    const token = sessionStorage.getItem("token");
    if (!token || token.trim() === "") {
      setStatsError("No authentication token found. Please log in.");
      setStatsLoading(false);
      return;
    }

    try {
      const response = await axios.get(STATS_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          fromDate: dateRange.start.format("YYYY-MM-DD"),
          toDate: dateRange.end.format("YYYY-MM-DD"),
        },
      });
      const result = response.data;
      if (result.status.code === 0) {
        setStatsData(result.data);
      } else {
        setStatsError(`Failed to fetch stats: ${result.status.message}`);
        setStatsData({
          supplies: { volume: 0, total: 0, deliveries: 0 },
          invoicedBills: { volume: 0, total: 0, deliveries: 0 },
          unpaidBills: { volume: 0, total: 0, deliveries: 0 },
          paidBills: { volume: 0, total: 0, deliveries: 0 },
        });
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
      setStatsError(err.response?.data?.message || "Failed to fetch stats.");
      setStatsData({
        supplies: { volume: 0, total: 0, deliveries: 0 },
        invoicedBills: { volume: 0, total: 0, deliveries: 0 },
        unpaidBills: { volume: 0, total: 0, deliveries: 0 },
        paidBills: { volume: 0, total: 0, deliveries: 0 },
      });
    } finally {
      setStatsLoading(false);
    }
  }, [dateRange.start, dateRange.end]);

  const fetchDeliveries = useCallback(
    async (page = 1, searchQuery = "", start = "", end = "") => {
      setIsLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem("token");
        if (!token || token.trim() === "") {
          setError("No authentication token found. Please log in.");
          setIsLoading(false);
          return;
        }

        const params = {
          page: page - 1,
          size: itemsPerPage,
          searchValue: searchQuery,
        };
        if (start) params.startDate = start;
        if (end) params.endDate = end;

        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });

        const data = response.data.data || [];
        const total = response.data.totalElements || data.length;
        setDeliveries(data);
        setTotalItems(total);
      } catch (error) {
        console.error("Error fetching deliveries:", error);
        setError("Failed to fetch deliveries. Please try again.");
        toast.error("Failed to fetch deliveries.");
        setDeliveries([]);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage]
  );

  useEffect(() => {
    fetchStatsData();
    fetchDeliveries(currentPage, debouncedQuery, dateRange.start.format("YYYY-MM-DD"), dateRange.end.format("YYYY-MM-DD"));
  }, [currentPage, debouncedQuery, dateRange.start, dateRange.end, fetchStatsData, fetchDeliveries]);

  const handleDeleteClick = (delivery) => {
    setDeliveryToDelete(delivery);
  };

  const handleDeleteConfirm = async () => {
    if (!deliveryToDelete) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`${API_URL}/${deliveryToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeliveryToDelete(null);
      fetchDeliveries(currentPage, debouncedQuery, dateRange.start.format("YYYY-MM-DD"), dateRange.end.format("YYYY-MM-DD"));
      toast.success("Delivery deleted successfully!");
    } catch (error) {
      console.error("Error deleting delivery:", error);
      setError(error.response?.data?.message || "Failed to delete delivery.");
      toast.error(error.response?.data?.message || "Failed to delete delivery.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleDateChange = (start, end) => {
    setDateRange({ start, end });
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleAddDeliveryClick = () => {
    navigate("/deliveries/add-delivery");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Supplier Deliveries", 14, 20);

    autoTable(doc, {
      head: [
        [
          "ID",
          "Supplier",
          "Volume (L)",
          "Price/Litre",
          "Storage Facility",
          "Total Amount",
          "Status",
          "Created By",
          "Date Created",
        ],
      ],
      body: deliveries.map((delivery, index) => [
        (currentPage - 1) * itemsPerPage + index + 1,
        delivery.supplier.name,
        delivery.litres,
        formatCurrency(delivery.pricePerLitre.toFixed(2)),
        delivery?.storageFacility?.name || "N/A",
        formatCurrency(delivery.totalAmount.toFixed(2)),
        delivery.status.name,
        delivery.createdBy.name,
        formatDate(delivery.dateCreated),
      ]),
      startY: 30,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
    });

    doc.save("deliveries.pdf");
  };

  const exportToCSV = () => {
    const csvData = deliveries.map((delivery, index) => ({
      "ID": (currentPage - 1) * itemsPerPage + index + 1,
      Supplier: delivery.supplier.name,
      "Volume (L)": delivery.litres,
      "Price/Litre": `Kshs ${delivery.pricePerLitre.toFixed(2)}`,
      "Storage Facility": delivery?.storageFacility?.name || "N/A",
      "Total Amount": `Kshs ${delivery.totalAmount.toFixed(2)}`,
      Status: delivery.status.name,
      "Created By": delivery.createdBy.name,
      "Date Created": formatDate(delivery.dateCreated),
    }));

    const csv = Papa.unparse(csvData, {
      quotes: true,
      delimiter: ",",
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "deliveries.csv";
    link.click();
  };

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          success: { style: { background: "#d4edda", color: "#155724" } },
          error: { style: { background: "#f8d7da", color: "#721c24" } },
        }}
      />
      <div className="d-flex justify-content-end align-items-center mb-3 gap-3">
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

      <StatsCards statsData={statsData} isLoading={statsLoading} error={statsError} />

      <div className="card h-100 p-0 radius-12 mt-3">
        <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
          <div className="d-flex align-items-center flex-wrap gap-3">
            <form className="navbar-search">
              <input
                type="text"
                className="bg-base h-40-px w-auto"
                name="search"
                placeholder="Search Supplier"
                value={query}
                onChange={handleSearchInputChange}
              />
              <Icon icon="ion:search-outline" className="icon" />
            </form>
          </div>
          <button
            type="button"
            className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
            onClick={handleAddDeliveryClick}
          >
            <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
            Add Delivery
          </button>
        </div>

        <div className="card-body-table p-24">
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="table-responsive scroll-sm">
            <table className="table table-borderless sm-table mb-0">
              <thead>
                <tr>
                  <th scope="col" className="text-center py-3 px-6">ID</th>
                  <th scope="col" className="text-start py-3 px-4">Supplier</th>
                  <th scope="col" className="text-start py-3 px-4">Volume (L)</th>
                  <th scope="col" className="text-start py-3 px-4">Price/Litre</th>
                  <th scope="col" className="text-start py-3 px-4">Storage Facility</th>
                  <th scope="col" className="text-start py-3 px-4">Total Amount</th>
                  <th scope="col" className="text-start py-3 px-4">Status</th>
                  <th scope="col" className="text-start py-3 px-4">Created By</th>
                  <th scope="col" className="text-start py-3 px-4">Date Created</th>
                  <th scope="col" className="text-start py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="10" className="text-center py-3">
                      <Spinner />
                    </td>
                  </tr>
                ) : deliveries.length > 0 ? (
                  deliveries.map((delivery, index) => (
                    <tr key={delivery.id} style={{ transition: "background-color 0.2s" }}>
                      <td className="text-center small-text py-3 px-6">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="text-start small-text py-3 px-4">{delivery.supplier.name}</td>
                      <td className="text-start small-text py-3 px-4">{delivery.litres}</td>
                      <td className="text-start small-text py-3 px-4">
                        {formatCurrency(delivery.pricePerLitre.toFixed(2))}
                      </td>
                      <td className="text-start small-text py-3 px-4">
                        {delivery?.storageFacility?.name || "N/A"}
                      </td>
                      <td className="text-start small-text py-3 px-4">
                        {formatCurrency(delivery.totalAmount.toFixed(2))}
                      </td>
                      <td className="text-start small-text py-3 px-4">
                        <span
                          className={`bg-${
                            delivery.status.name === "Not Billed" ? "warning-focus" : "success-focus"
                          } text-${
                            delivery.status.name === "Not Billed" ? "warning-600" : "success-600"
                          } px-24 py-4 radius-8 fw-medium text-sm`}
                        >
                          {delivery.status.name}
                        </span>
                      </td>
                      <td className="text-start small-text py-3 px-4">{delivery.createdBy.name}</td>
                      <td className="text-start small-text py-3 px-4">
                        {formatDate(delivery.dateCreated)}
                      </td>
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
                                <button
                                  className="dropdown-item"
                                  onClick={() => navigate("/deliveries/edit-delivery", { state: { delivery } })}
                                >
                                  <Icon icon="ri-edit-line" />
                                  Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => handleDeleteClick(delivery)}
                                  data-bs-toggle="modal"
                                  data-bs-target="#deleteModal"
                                >
                                  <Icon icon="mdi:trash-can" />
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
                    <td colSpan="10" className="text-center py-3">
                      No deliveries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!isLoading && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted" style={{ fontSize: "13px" }}>
                <span>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
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

                  {totalPages > 6 ? (
                    <>
                      <li className={`page-item ${currentPage === 1 ? "active" : ""}`}>
                        <button
                          className={`page-link btn ${currentPage === 1 ? "btn-primary" : "btn-outline-primary"} rounded-circle`}
                          style={{ width: "30px", height: "30px", fontSize: "10px" }}
                          onClick={() => handlePageChange(1)}
                        >
                          1
                        </button>
                      </li>

                      {currentPage > 3 && (
                        <li className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      )}

                      {Array.from({ length: 5 }, (_, i) => currentPage - 2 + i)
                        .filter((page) => page > 1 && page < totalPages)
                        .map((page) => (
                          <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                            <button
                              className={`page-link btn ${
                                currentPage === page ? "btn-primary" : "btn-outline-primary"
                              } rounded-circle`}
                              style={{ width: "30px", height: "30px", fontSize: "10px" }}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          </li>
                        ))}

                      {currentPage < totalPages - 2 && (
                        <li className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      )}

                      <li className={`page-item ${currentPage === totalPages ? "active" : ""}`}>
                        <button
                          className={`page-link btn ${
                            currentPage === totalPages ? "btn-primary" : "btn-outline-primary"
                          } rounded-circle`}
                          style={{ width: "30px", height: "30px", fontSize: "10px" }}
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </button>
                      </li>
                    </>
                  ) : (
                    Array.from({ length: totalPages }, (_, i) => (
                      <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                        <button
                          className={`page-link btn ${
                            currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"
                          } rounded-circle`}
                          style={{ width: "30px", height: "30px", fontSize: "10px" }}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))
                  )}

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
        </div>

        <div className="modal fade" id="deleteModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body pt-3 ps-18 pe-18">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="modal-title fs-6">Delete Delivery</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <p className="pb-3 mb-0">
                  Are you sure you want to delete the delivery from{" "}
                  <strong>{deliveryToDelete?.supplier.name}</strong> permanently? This action cannot be undone.
                </p>
              </div>
              <div className="d-flex justify-content-end gap-2 px-12 pb-3">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  data-bs-dismiss="modal"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveriesLayer;