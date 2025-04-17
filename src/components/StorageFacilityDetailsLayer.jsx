import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Icon } from '@iconify/react';
import { Spinner } from '../hook/spinner-utils';
import { formatDate } from '../hook/format-utils';
import ReactApexChart from 'react-apexcharts';
import { useDateRange } from '../hook/useDateRange';
import moment from 'moment';
import Papa from 'papaparse'; // For CSV export
import jsPDF from 'jspdf'; // For PDF export
import autoTable from 'jspdf-autotable'; // For PDF table generation

const API_URL = 'https://api.bizchain.co.ke/v1/storage-facilities';
const SUMMARY_API_URL = (facilityId) => `${API_URL}/${facilityId}/summary`; // Replace with actual API endpoint

const StorageFacilityDetailsLayer = () => {
  const location = useLocation();
  const facilityId = location.state?.facilityId;
  const navigate = useNavigate();
  const [facilityToView, setFacilityToView] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [drawings, setDrawings] = useState([]);
  const [summary, setSummary] = useState({
    totalVolume: 0,
    numDeliveries: 0,
    volumeDrawn: 0,
    numDrawings: 0,
    remainingVolume: 0,
  });
  const [statusFilter, setStatusFilter] = useState('All');
  const [error, setError] = useState(null);
  const [summaryError, setSummaryError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  // Single date range for the entire page
  const { dateRange, PredefinedDateRanges: DatePicker } = useDateRange();

  // Export to CSV
  const exportToCSV = () => {
    const csvData = filteredDeliveriesForTable.map(delivery => ({
      Supplier: delivery.supplier || 'N/A',
      'Volume (Litres)': delivery.volume.toLocaleString(),
      Date: formatDate(delivery.date) || 'N/A',
      Status: delivery.status || 'N/A',
      'Created By': delivery.createdBy?.name || 'N/A',
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const startDate = moment(dateRange.start).format('YYYY-MM-DD');
    const endDate = moment(dateRange.end).format('YYYY-MM-DD');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `deliveries_${startDate}_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const startDate = moment(dateRange.start).format('MM/DD/YYYY');
    const endDate = moment(dateRange.end).format('MM/DD/YYYY');
    const facilityName = facilityToView?.name || 'Storage Facility';

    // Add header
    doc.setFontSize(16);
    doc.text(`${facilityName} - Delivery Report`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Date Range: ${startDate} - ${endDate}`, 14, 30);

    // Add table
    autoTable(doc,{
      startY: 40,
      head: [['Supplier', 'Volume (Litres)', 'Date', 'Status', 'Created By']],
      body: filteredDeliveriesForTable.map(delivery => [
        delivery.supplier || 'N/A',
        delivery.volume.toLocaleString(),
        formatDate(delivery.date) || 'N/A',
        delivery.status || 'N/A',
        delivery.createdBy?.name || 'N/A',
      ]),
      theme: 'striped',
      headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255] },
      styles: { fontSize: 10 },
    });

    doc.save(`deliveries_${startDate}_${endDate}.pdf`);
  };

  useEffect(() => {
    if (!facilityId) {
      navigate('/storage-facility');
      return;
    }

    const fetchFacilityData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem('token');
        const facilityResponse = await axios.get(`${API_URL}/${facilityId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const facilityData = facilityResponse.data.data;
        setFacilityToView(facilityData);

        // Fetch deliveries and drawings (replace mock data with API calls if available)
        const mockDeliveries = [
          { id: 1, supplier: 'Morwabe', date: '2025-01-01', volume: 1000, status: 'Paid', createdBy: { name: 'John Doe' } },
          { id: 2, supplier: 'Morwabe', date: '2025-02-05', volume: 1500, status: 'Not Billed', createdBy: { name: 'Jane Smith' } },
          { id: 3, supplier: 'Morwabe', date: '2025-03-18', volume: 800, status: 'Paid', createdBy: { name: 'John Doe' } },
          { id: 4, supplier: 'Morwabe', date: '2025-04-13', volume: 300, status: 'Paid', createdBy: { name: 'John Doe' } },
          { id: 5, supplier: 'Morwabe', date: '2025-05-01', volume: 1000, status: 'Paid', createdBy: { name: 'John Doe' } },
          { id: 6, supplier: 'Morwabe', date: '2025-06-05', volume: 1500, status: 'Not Billed', createdBy: { name: 'Jane Smith' } },
          { id: 7, supplier: 'Morwabe', date: '2025-07-18', volume: 800, status: 'Paid', createdBy: { name: 'John Doe' } },
          { id: 8, supplier: 'Morwabe', date: '2025-08-13', volume: 300, status: 'Paid', createdBy: { name: 'John Doe' } },
        ];
        const mockDrawings = [
          { id: 1, date: '2025-01-02', volume: 500 },
          { id: 2, date: '2025-02-06', volume: 700 },
          { id: 3, date: '2025-03-29', volume: 300 },
          { id: 4, date: '2025-04-13', volume: 100 },
          { id: 5, date: '2025-06-02', volume: 500 },
          { id: 6, date: '2025-07-06', volume: 700 },
          { id: 7, date: '2025-08-29', volume: 300 },
          { id: 8, date: '2025-09-13', volume: 100 },
        ];
        setDeliveries(mockDeliveries);
        setDrawings(mockDrawings);
      } catch (error) {
        console.error('Error fetching facility data:', error);
        setError('Failed to fetch facility details or related data.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSummaryData = async () => {
      setIsSummaryLoading(true);
      setSummaryError(null);
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(SUMMARY_API_URL(facilityId), {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            startDate: moment(dateRange.start).format('YYYY-MM-DD'),
            endDate: moment(dateRange.end).format('YYYY-MM-DD'),
            _t: new Date().getTime(),
          },
        });

        const responseData = response.data;
        if (responseData.status.code === 0) {
          setSummary({
            totalVolume: responseData.data.totalVolume || 0,
            numDeliveries: responseData.data.numDeliveries || 0,
            volumeDrawn: responseData.data.volumeDrawn || 0,
            numDrawings: responseData.data.numDrawings || 0,
            remainingVolume: responseData.data.remainingVolume || 0,
          });
        } else {
          throw new Error(responseData.status.message);
        }
      } catch (error) {
        console.error('Error fetching summary data:', error);
        setSummaryError('Failed to fetch summary data. Please try again.');
        setSummary({
          totalVolume: 0,
          numDeliveries: 0,
          volumeDrawn: 0,
          numDrawings: 0,
          remainingVolume: 0,
        });
      } finally {
        setIsSummaryLoading(false);
      }
    };

    fetchFacilityData();
    fetchSummaryData();
  }, [facilityId, navigate, dateRange]);

  // Filter data based on date range (for graphs and table)
  const filteredDeliveries = deliveries.filter(d => {
    const deliveryDate = moment(d.date);
    return deliveryDate.isSameOrAfter(dateRange.start, 'day') && deliveryDate.isSameOrBefore(dateRange.end, 'day');
  });

  const filteredDrawings = drawings.filter(d => {
    const drawingDate = moment(d.date);
    return drawingDate.isSameOrAfter(dateRange.start, 'day') && drawingDate.isSameOrBefore(dateRange.end, 'day');
  });

  // Aggregate data for Supplies graph
  const suppliesData = filteredDeliveries.reduce((acc, d) => {
    const date = moment(d.date).format('YYYY-MM-DD');
    if (!acc[date]) {
      acc[date] = { volume: 0, count: 0 };
    }
    acc[date].volume += d.volume || 0;
    acc[date].count += 1;
    return acc;
  }, {});

  const suppliesSeries = [{
    name: 'Volume Supplied',
    data: Object.keys(suppliesData).map(date => ({
      x: new Date(date).getTime(),
      y: suppliesData[date].volume,
      count: suppliesData[date].count,
    })),
  }];

  // Aggregate data for Drawings graph
  const drawingsData = filteredDrawings.reduce((acc, d) => {
    const date = moment(d.date).format('YYYY-MM-DD');
    if (!acc[date]) {
      acc[date] = { volume: 0, count: 0 };
    }
    acc[date].volume += d.volume || 0;
    acc[date].count += 1;
    return acc;
  }, {});

  const drawingsSeries = [{
    name: 'Volume Drawn',
    data: Object.keys(drawingsData).map(date => ({
      x: new Date(date).getTime(),
      y: drawingsData[date].volume,
      count: drawingsData[date].count,
    })),
  }];

  const chartOptions = (title) => ({
    chart: { type: 'area', height: 350, zoom: { enabled: false } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    grid: {
      borderColor: '#e7e7e7',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    title: { text: title, align: 'left' },
    xaxis: { type: 'datetime', labels: { format: 'MMM dd' } },
    yaxis: { title: { text: 'Volume (Litres)' } },
    tooltip: {
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const data = w.config.series[seriesIndex].data[dataPointIndex];
        const isSupplies = title.includes('Supplies');
        return `
          <div class="apexcharts-tooltip-custom p-2">
            <div><strong>Date:</strong> ${formatDate(data.x)}</div>
            <div><strong>Volume:</strong> ${data.y.toLocaleString()} Litres</div>
            <div><strong>${isSupplies ? 'Deliveries' : 'Drawings'}:</strong> ${data.count}</div>
          </div>
        `;
      },
    },
    colors: [title.includes('Supplies') ? '#00E396' : '#FF4560'],
  });

  // Filter deliveries by status and date for table
  const filteredDeliveriesForTable = statusFilter === 'All'
    ? filteredDeliveries
    : filteredDeliveries.filter(d => d.status === statusFilter);

  // Status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-success-focus text-success-600 px-24 py-4 radius-8 fw-medium text-sm d-inline-block mb-2';
      case 'Not Billed':
        return 'bg-warning-focus text-warning-600 px-24 py-4 radius-8 fw-medium text-sm d-inline-block mb-2';
      default:
        return 'bg-secondary-focus text-secondary-600 px-24 py-4 radius-8 fw-medium text-sm d-inline-block mb-2';
    }
  };

  return (
    <div className="page-wrapper" style={{ width: '100%', maxWidth: 'none', margin: 0, padding: '0 16px' }}>
      <div className="mt-3">
        <div className="d-flex justify-content-end mb-3 align-items-center gap-2">
          <div>{DatePicker}</div>
          <div className="dropdown">
            <button
              className="btn btn-outline-primary dropdown-toggle"
              type="button"
              id="exportDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Export
            </button>
            <ul className="dropdown-menu" aria-labelledby="exportDropdown">
              <li>
                <button className="dropdown-item" onClick={exportToCSV}>
                  Export Deliveries as CSV
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={exportToPDF}>
                  Export Deliveries as PDF
                </button>
              </li>
            </ul>
          </div>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {summaryError && <div className="alert alert-danger">{summaryError}</div>}
        {isLoading ? (
          <Spinner />
        ) : facilityToView ? (
          <>
            {/* Cards */}
            <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 gy-4 mb-3">
              {/* Card 1: Total Volume */}
              <div className="col">
                <div className="card shadow-none border bg-gradient-start-1 h-100">
                  <div className="card-body p-20">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                      <div>
                        <p className="fw-medium text-primary-light mb-1 fs-12">Total Volume</p>
                        <h6 className="mb-0 fs-10">
                          {isSummaryLoading ? <Spinner /> : summary.totalVolume.toLocaleString() + ' Litres'}
                        </h6>
                      </div>
                      <div className="w-50-px h-50-px bg-success-main rounded-circle d-flex justify-content-center align-items-center">
                        <Icon icon="mdi:barrel-outline" className="text-white text-xxl mb-0" />
                      </div>
                    </div>
                    <p className="fw-medium fs-12 text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                      {isSummaryLoading ? (
                        <Spinner />
                      ) : (
                        <span className="d-inline-flex align-items-center gap-1 text-success-main">
                          <Icon icon="bxs:up-arrow" className="fs-12" />
                          {summary.numDeliveries} Deliveries
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              {/* Card 2: Volume Drawn */}
              <div className="col">
                <div className="card shadow-none border bg-gradient-start-2 h-100">
                  <div className="card-body p-20">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                      <div>
                        <p className="fw-medium text-primary-light mb-1 fs-12">Volume Drawn</p>
                        <h6 className="mb-0 fs-10">
                          {isSummaryLoading ? <Spinner /> : summary.volumeDrawn.toLocaleString() + ' Litres'}
                        </h6>
                      </div>
                      <div className="w-50-px h-50-px bg-primary rounded-circle d-flex justify-content-center align-items-center">
                        <Icon icon="mdi:scale" className="text-white text-xxl mb-0" />
                      </div>
                    </div>
                    <p className="fw-medium fs-12 text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                      {isSummaryLoading ? (
                        <Spinner />
                      ) : (
                        <span className="d-inline-flex align-items-center gap-1 text-success-main">
                          <Icon icon="bxs:up-arrow" className="fs-12" />
                          {summary.numDrawings} Drawings
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              {/* Card 3: Remaining Volume */}
              <div className="col">
                <div className="card shadow-none border bg-gradient-start-3 h-100">
                  <div className="card-body p-20">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                      <div>
                        <p className="fw-medium text-primary-light mb-1 fs-12">Remaining Volume</p>
                        <h6 className="mb-0 fs-10">
                          {isSummaryLoading ? <Spinner /> : summary.remainingVolume.toLocaleString() + ' Litres'}
                        </h6>
                      </div>
                      <div className="w-50-px h-50-px bg-info rounded-circle d-flex justify-content-center align-items-center">
                        <Icon icon="mdi:water-pump" className="text-white text-xxl mb-0" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Graph 1: Supplies Over Time */}
            <div className="card shadow-sm mb-3">
              <div className="card-body">
                <ReactApexChart
                  options={chartOptions('Supplies Over Time')}
                  series={suppliesSeries}
                  type="area"
                  height={350}
                />
              </div>
            </div>

            {/* Graph 2: Drawings Over Time */}
            <div className="card shadow-sm mb-3">
              <div className="card-body">
                <ReactApexChart
                  options={chartOptions('Drawings Over Time')}
                  series={drawingsSeries}
                  type="area"
                  height={350}
                />
              </div>
            </div>

            {/* Deliveries Table */}
            <div className="card shadow-sm mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Deliveries</h6>
                  <select
                    className="form-select form-select-sm w-auto"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="Paid">Paid</option>
                    <option value="Not Billed">Not Billed</option>
                  </select>
                </div>
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th className="text-start py-2">Supplier</th>
                        <th className="text-start py-2">Volume (Litres)</th>
                        <th className="text-start py-2">Date</th>
                        <th className="text-start py-2">Status</th>
                        <th className="text-start py-2">Created By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDeliveriesForTable.length > 0 ? (
                        filteredDeliveriesForTable.map((delivery) => (
                          <tr key={delivery.id}>
                            <td className="text-start py-3">{delivery.supplier || 'N/A'}</td>
                            <td className="text-start py-3">{delivery.volume.toLocaleString()}</td>
                            <td className="text-start py-3">{formatDate(delivery.date) || 'N/A'}</td>
                            <td className="text-start py-3">
                              <span className={getStatusBadgeClass(delivery.status)}>
                                {delivery.status}
                              </span>
                            </td>
                            <td className="text-start py-3">{delivery.createdBy?.name || 'N/A'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-3">No deliveries found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <Link to="/storage-facility" className="btn btn-primary">Back</Link>
            </div>
          </>
        ) : (
          <p>No facility data available.</p>
        )}
      </div>
    </div>
  );
};

export default StorageFacilityDetailsLayer;