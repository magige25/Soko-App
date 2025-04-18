import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Icon } from '@iconify/react';
import { Spinner } from '../hook/spinner-utils';
import { formatDate } from '../hook/format-utils';
import ReactApexChart from 'react-apexcharts';
import { useDateRange } from '../hook/useDateRange';
import moment from 'moment';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Toast, ToastContainer } from 'react-bootstrap';

const API_URL = 'https://api.bizchain.co.ke/v1/storage-facilities';
const SUMMARY_API_URL = (facilityId) => `${API_URL}/${facilityId}/summary`;

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
  const [showToast, setShowToast] = useState(false);

  const { dateRange, PredefinedDateRanges: DatePicker } = useDateRange();

  // Export functions (unchanged)
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

  const exportToPDF = () => {
    const doc = new jsPDF();
    const startDate = moment(dateRange.start).format('MM/DD/YYYY');
    const endDate = moment(dateRange.end).format('MM/DD/YYYY');
    const facilityName = facilityToView?.name || 'Storage Facility';
    doc.setFontSize(16);
    doc.text(`${facilityName} - Delivery Report`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Date Range: ${startDate} - ${endDate}`, 14, 30);
    autoTable(doc, {
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

  const exportDrawingsToCSV = () => {
    const csvData = filteredDrawings.map(drawing => ({
      Drawer: drawing.drawer || 'N/A',
      'Volume (Litres)': drawing.volume.toLocaleString(),
      Date: formatDate(drawing.date) || 'N/A',
      'Created By': drawing.createdBy?.name || 'N/A',
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const startDate = moment(dateRange.start).format('YYYY-MM-DD');
    const endDate = moment(dateRange.end).format('YYYY-MM-DD');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `drawings_${startDate}_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportDrawingsToPDF = () => {
    const doc = new jsPDF();
    const startDate = moment(dateRange.start).format('MM/DD/YYYY');
    const endDate = moment(dateRange.end).format('MM/DD/YYYY');
    const facilityName = facilityToView?.name || 'Storage Facility';
    doc.setFontSize(16);
    doc.text(`${facilityName} - Drawings Report`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Date Range: ${startDate} - ${endDate}`, 14, 30);
    autoTable(doc, {
      startY: 40,
      head: [['Drawer', 'Volume (Litres)', 'Date', 'Created By']],
      body: filteredDrawings.map(drawing => [
        drawing.drawer || 'N/A',
        drawing.volume.toLocaleString(),
        formatDate(drawing.date) || 'N/A',
        drawing.createdBy?.name || 'N/A',
      ]),
      theme: 'striped',
      headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255] },
      styles: { fontSize: 10 },
    });
    doc.save(`drawings_${startDate}_${endDate}.pdf`);
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

        const mockDeliveries = [
          { id: 1, supplier: 'Morwabe', date: '2025-03-01T08:00:00Z', volume: 1200, status: 'Paid', createdBy: { name: 'John Doe' } },
          { id: 2, supplier: 'Morwabe', date: '2025-03-05T12:00:00Z', volume: 1000, status: 'Not Billed', createdBy: { name: 'Jane Smith' } },
          { id: 3, supplier: 'Morwabe', date: '2025-03-10T15:00:00Z', volume: 900, status: 'Paid', createdBy: { name: 'John Doe' } },
          { id: 4, supplier: 'Morwabe', date: '2025-03-13T09:00:00Z', volume: 800, status: 'Paid', createdBy: { name: 'John Doe' } },
          { id: 5, supplier: 'Morwabe', date: '2025-03-15T14:00:00Z', volume: 900, status: 'Paid', createdBy: { name: 'John Doe' } },
          { id: 6, supplier: 'Morwabe', date: '2025-03-20T11:00:00Z', volume: 1500, status: 'Not Billed', createdBy: { name: 'Jane Smith' } },
          { id: 7, supplier: 'Morwabe', date: '2025-03-29T16:00:00Z', volume: 800, status: 'Paid', createdBy: { name: 'John Doe' } },
          { id: 8, supplier: 'Morwabe', date: '2025-04-04T10:00:00Z', volume: 500, status: 'Paid', createdBy: { name: 'John Doe' } },
        ];
        const mockDrawings = [
          { id: 1, drawer: 'Morara', date: '2025-03-02T07:00:00Z', volume: 900, createdBy: { name: 'John Doe' } },
          { id: 2, drawer: 'Morara', date: '2025-03-06T13:00:00Z', volume: 700, createdBy: { name: 'Jane Smith' } },
          { id: 3, drawer: 'Morara', date: '2025-03-08T08:00:00Z', volume: 600, createdBy: { name: 'John Doe' } },
          { id: 4, drawer: 'Morara', date: '2025-03-13T10:00:00Z', volume: 150, createdBy: { name: 'John Doe' } },
          { id: 5, drawer: 'Morara', date: '2025-03-23T15:00:00Z', volume: 450, createdBy: { name: 'Jane Smith' } },
          { id: 6, drawer: 'Morara', date: '2025-03-27T12:00:00Z', volume: 700, createdBy: { name: 'John Doe' } },
          { id: 7, drawer: 'Morara', date: '2025-03-30T09:00:00Z', volume: 350, createdBy: { name: 'John Doe' } },
          { id: 8, drawer: 'Morara', date: '2025-04-05T14:00:00Z', volume: 250, createdBy: { name: 'Jane Smith' } },
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

  useEffect(() => {
    if (summaryError) {
      setShowToast(true);
    }
  }, [summaryError]);

  // Filter data
  const filteredDeliveries = deliveries.filter(d => {
    const deliveryDate = moment(d.date);
    return deliveryDate.isSameOrAfter(dateRange.start, 'day') && deliveryDate.isSameOrBefore(dateRange.end, 'day');
  });

  const filteredDrawings = drawings.filter(d => {
    const drawingDate = moment(d.date);
    return drawingDate.isSameOrAfter(dateRange.start, 'day') && drawingDate.isSameOrBefore(dateRange.end, 'day');
  });

  const filteredDeliveriesForTable = statusFilter === 'All'
    ? filteredDeliveries
    : filteredDeliveries.filter(d => d.status === statusFilter);

  // Detect date range type
  const isToday = dateRange.start.isSame(moment().startOf('day'), 'day') && dateRange.end.isSame(moment().startOf('day'), 'day');
  const isYesterday = dateRange.start.isSame(moment().subtract(1, 'day').startOf('day'), 'day') && dateRange.end.isSame(moment().subtract(1, 'day').startOf('day'), 'day');
  const isMonthBased = dateRange.start.isSame(dateRange.end, 'month') && 
                      dateRange.start.date() === 1 && 
                      dateRange.end.isSame(dateRange.end.clone().endOf('month'), 'day');
  const isYearBased = dateRange.start.isSame(dateRange.end, 'year') && 
                     dateRange.start.isSame(dateRange.start.clone().startOf('year'), 'day') && 
                     dateRange.end.isSame(dateRange.end.clone().endOf('year'), 'day');
  const isHourly = isToday || isYesterday;

  // Generate labels
  const getFallbackLabels = () => {
    if (isHourly) {
      const labels = [];
      const baseDate = isToday ? moment().startOf('day') : moment().subtract(1, 'day').startOf('day');
      for (let i = 0; i < 24; i++) {
        labels.push(baseDate.clone().add(i, 'hours').format('YYYY-MM-DD HH:00'));
      }
      return labels;
    } else if (isMonthBased) {
      const labels = [];
      let current = moment(dateRange.start);
      while (current.isSameOrBefore(dateRange.end, 'day')) {
        labels.push(current.format('YYYY-MM-DD'));
        current.add(1, 'day');
      }
      return labels;
    } else if (isYearBased) {
      const labels = [];
      let current = moment(dateRange.start).startOf('month');
      while (current.isSameOrBefore(dateRange.end, 'month')) {
        labels.push(current.format('YYYY-MM'));
        current.add(1, 'month');
      }
      return labels;
    } else {
      const labels = [];
      let current = moment(dateRange.start);
      while (current.isSameOrBefore(dateRange.end, 'day')) {
        labels.push(current.format('YYYY-MM-DD'));
        current.add(1, 'day');
      }
      return labels;
    }
  };

  // Aggregate data for graphs
  const suppliesData = filteredDeliveries.reduce((acc, d) => {
    const key = isHourly
      ? moment(d.date).format('YYYY-MM-DD HH:00')
      : isMonthBased
      ? moment(d.date).format('YYYY-MM-DD')
      : isYearBased
      ? moment(d.date).format('YYYY-MM')
      : moment(d.date).format('YYYY-MM-DD');
    if (!acc[key]) {
      acc[key] = { volume: 0, count: 0 };
    }
    acc[key].volume += d.volume || 0;
    acc[key].count += 1;
    return acc;
  }, {});

  const suppliesGraphData = {
    labels: getFallbackLabels(),
    data: getFallbackLabels().map(label => ({
      volume: suppliesData[label]?.volume || 0,
      count: suppliesData[label]?.count || 0,
    })),
  };

  const suppliesSeries = [{
    name: 'Volume Supplied',
    data: suppliesGraphData.data.map(item => item.volume),
  }];

  const drawingsData = filteredDrawings.reduce((acc, d) => {
    const key = isHourly
      ? moment(d.date).format('YYYY-MM-DD HH:00')
      : isMonthBased
      ? moment(d.date).format('YYYY-MM-DD')
      : isYearBased
      ? moment(d.date).format('YYYY-MM')
      : moment(d.date).format('YYYY-MM-DD');
    if (!acc[key]) {
      acc[key] = { volume: 0, count: 0 };
    }
    acc[key].volume += d.volume || 0;
    acc[key].count += 1;
    return acc;
  }, {});

  const drawingsGraphData = {
    labels: getFallbackLabels(),
    data: getFallbackLabels().map(label => ({
      volume: drawingsData[label]?.volume || 0,
      count: drawingsData[label]?.count || 0,
    })),
  };

  const drawingsSeries = [{
    name: 'Volume Drawn',
    data: drawingsGraphData.data.map(item => item.volume),
  }];

  // Chart options
  const chartOptions = (title) => ({
    chart: {
      type: 'area',
      height: 264,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: suppliesGraphData.labels,
      labels: {
        style: { fontSize: '12px', fontWeight: 500 },
        formatter: isHourly
          ? (value) => moment(value).format('HH:mm')
          : isMonthBased
          ? (value) => moment(value).format('DD')
          : isYearBased
          ? (value) => moment(value).format('MMM')
          : (value) => moment(value).format('MMM DD'),
      },
      tickAmount: isHourly ? 12 : isYearBased ? 12 : undefined,
    },
    yaxis: {
      title: {
        text: 'Volume (Litres)',
        style: { fontSize: '14px', fontWeight: 600 },
        offsetX: -10,
      },
      labels: {
        formatter: (value) => `${value.toLocaleString()} L`,
        style: { fontSize: '12px', fontWeight: 500 },
        offsetX: -5,
        align: 'center',
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (value) => `${value.toLocaleString()} Litres`,
      },
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const data = w.config.series[seriesIndex].data[dataPointIndex];
        const isSupplies = title.includes('Supplies');
        const count = isSupplies
          ? suppliesGraphData.data[dataPointIndex]?.count || 0
          : drawingsGraphData.data[dataPointIndex]?.count || 0;
        const labelValue = w.globals.categoryLabels[dataPointIndex];
        let label, labelType;
    
        if (isHourly) {
          const parsedDate = moment(labelValue, 'HH:00');
          label = `${formatDate(parsedDate)} ${parsedDate.format('HH:mm')}`;
          labelType = 'Date';
        } else if (isMonthBased) {
          const parsedDate = moment(labelValue, 'DD-MM');
          label = formatDate(parsedDate);
          labelType = 'Date';
        } else if (isYearBased) {
          const parsedDate = moment(labelValue, 'YYYY-MM-DD');
          label = formatDate(parsedDate);
          labelType = 'Month';
        } else {
          const parsedDate = moment(labelValue, 'DD-MM');  
          label = formatDate(parsedDate);
          labelType = 'Date';
        }
    
        return `
          <div class="apexcharts-tooltip-custom p-2">
            <div><strong>${labelType}:</strong> ${label}</div>
            <div><strong>Volume:</strong> ${data.toLocaleString()} Litres</div>
            <div><strong>${isSupplies ? 'Deliveries' : 'Drawings'}:</strong> ${count}</div>
          </div>
        `;
      },
    },
    colors: ['#00D1FF'],
    grid: {
      borderColor: '#e7e7e7',
      strokeDashArray: 4,
      padding: { left: 5, right: 5 },
    },
  });

  // Calculate total volumes for summary metrics
  const totalSuppliesVolume = filteredDeliveries.reduce((sum, d) => sum + (d.volume || 0), 0);
  const totalDrawingsVolume = filteredDrawings.reduce((sum, d) => sum + (d.volume || 0), 0);

  return (
    <div className="page-wrapper" style={{ width: '100%', maxWidth: 'none', margin: 0, padding: '0 16px' }}>
      <div className="mt-3">
        <div className="d-flex justify-content-end mb-3 align-items-center gap-2">
          <div>{DatePicker}</div>
          <div className="dropdown">
            <button
              className="btn btn-outline-primary text-sm btn-sm px-10 py-12 radius-8 d-flex align-items-center gap-2"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <Icon icon="mdi:file-send-outline" className="text-xl icon-green-hover"/>
              Export
              {/* <Icon icon="mdi:chevron-down" className="text-2xl text-gray-800" /> */}
            </button>
            <ul className="dropdown-menu" aria-labelledby="exportDropdown">
              <li>
                <button className="dropdown-item d-flex align-items-center gap-2" onClick={exportToCSV}>
                  <Icon icon="mdi:file-delimited-outline" className="text-xl text-success-600" />
                  Export Deliveries as CSV
                </button>
              </li>
              <li>
                <button className="dropdown-item d-flex align-items-center gap-2" onClick={exportToPDF}>
                  <Icon icon="mdi:file-pdf-box" className="text-xl text-danger-600" />
                  Export Deliveries as PDF
                </button>
              </li>
              <li>
                <button className="dropdown-item d-flex align-items-center gap-2" onClick={exportDrawingsToCSV}>
                  <Icon icon="mdi:file-excel" className="text-xl text-success-600" />
                  Export Drawings as CSV
                </button>
              </li>
              <li>
                <button className="dropdown-item d-flex align-items-center gap-2" onClick={exportDrawingsToPDF}>
                  <Icon icon="mdi:file-pdf-box" className="text-xl text-danger-600" />
                  Export Drawings as PDF
                </button>
              </li>
            </ul>
          </div>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1055 }}>
          <Toast
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={5000}
            autohide
            bg="danger"
            className="text-white"
          >
            <Toast.Header>
              <strong className="me-auto">Error</strong>
            </Toast.Header>
            <Toast.Body>{summaryError}</Toast.Body>
          </Toast>
        </ToastContainer>
        {isLoading ? (
          <Spinner />
        ) : facilityToView ? (
          <>
            <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 gy-4 mb-3">
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
            <div className="row">
              <div className="col-12 mt-3">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex flex-wrap align-items-center justify-content-between">
                      <h6 className="text-lg mb-0 fw-bold">Supplies Over Time</h6>
                    </div>
                    <div className="d-flex flex-wrap align-items-center gap-2 mt-8">
                      <h6 className="mb-0 fs-10">{totalSuppliesVolume.toLocaleString()} Litres</h6>
                    </div>
                    <ReactApexChart
                      options={chartOptions('Supplies Over Time')}
                      series={suppliesSeries}
                      type="area"
                      height={264}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex flex-wrap align-items-center justify-content-between">
                      <h6 className="text-lg mb-0 fw-bold">Drawings Over Time</h6>
                    </div>
                    <div className="d-flex flex-wrap align-items-center gap-2 mt-8">
                      <h6 className="mb-0 fs-10">{totalDrawingsVolume.toLocaleString()} Litres</h6>
                    </div>
                    <ReactApexChart
                      options={chartOptions('Drawings Over Time')}
                      series={drawingsSeries}
                      type="area"
                      height={264}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mt-3">
                <div className="card h-auto">
                  <div className="card-body">
                    <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
                      <h6 className="text-lg mb-0 fw-bold">Deliveries</h6>
                      <select
                        className="form-select bg-base form-select-sm w-auto"
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
                            <th className="text-center text-primary-light fw-semibold fs-12">ID</th>
                            <th className="text-primary-light fw-semibold fs-12">Supplier</th>
                            <th className="text-primary-light fw-semibold fs-12">Volume (L)</th>
                            <th className="text-primary-light fw-semibold fs-12">Date</th>
                            <th className="text-primary-light fw-semibold fs-12">Status</th>
                            <th className="text-primary-light fw-semibold fs-12">Created By</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDeliveriesForTable.length > 0 ? (
                            filteredDeliveriesForTable.map((delivery, index) => (
                              <tr key={delivery.id}>
                                <td className="text-center text-primary-light fs-12">{index + 1}</td>
                                <td className="text-primary-light fs-12">{delivery.supplier || 'N/A'}</td>
                                <td className="text-primary-light fs-12">{delivery.volume.toLocaleString()} Litres</td>
                                <td className="text-primary-light fs-12">{formatDate(delivery.date) || 'N/A'}</td>
                                <td className="text-primary-light fs-12">
                                  <span
                                    className={`badge ${
                                      delivery.status === 'Paid' ? 'bg-success-main' : 'bg-danger-main'
                                    } text-white`}
                                  >
                                    {delivery.status}
                                  </span>
                                </td>
                                <td className="text-primary-light fs-12">{delivery.createdBy?.name || 'N/A'}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center py-3">No deliveries found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mt-3" style={{ flexGrow: 1 }}>
                <div className="card h-auto">
                  <div className="card-body">
                    <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
                      <h6 className="text-lg mb-0 fw-bold">Drawings</h6>
                      <select
                        className="form-select bg-base form-select-sm w-auto"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        disabled
                      >
                        <option value="All">All</option>
                      </select>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-borderless">
                        <thead>
                          <tr>
                            <th className="text-center text-primary-light fw-semibold fs-12">ID</th>
                            <th className="text-primary-light fw-semibold fs-12">Drawer</th>
                            <th className="text-primary-light fw-semibold fs-12">Volume (L)</th>
                            <th className="text-primary-light fw-semibold fs-12">Date</th>
                            <th className="text-primary-light fw-semibold fs-12">Created By</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDrawings.length > 0 ? (
                            filteredDrawings.map((drawing, index) => (
                              <tr key={drawing.id}>
                                <td className="text-center text-primary-light fs-12">{index + 1}</td>
                                <td className="text-primary-light fs-12">{drawing.drawer || 'N/A'}</td>
                                <td className="text-primary-light fs-12">{drawing.volume.toLocaleString()} Litres</td>
                                <td className="text-primary-light fs-12">{formatDate(drawing.date) || 'N/A'}</td>
                                <td className="text-primary-light fs-12">{drawing.createdBy?.name || 'N/A'}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="text-center py-3">No drawings found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
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