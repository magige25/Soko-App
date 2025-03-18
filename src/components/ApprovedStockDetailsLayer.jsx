import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Icon } from '@iconify/react/dist/iconify.js';

const STOCK_REQUEST_API_URL = "https://api.bizchain.co.ke/v1/stock-requests";

const ApprovedStockDetailsLayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [stockRequest, setStockRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const requestId = location.state?.requestId;

  useEffect(() => {
    if (!requestId) {
      setError("No stock request ID provided.");
      setIsLoading(false);
      toast.error("No stock request ID provided. Please select a stock request.");
      navigate("/approved-stock");
      return;
    }

    const fetchStockRequestData = async () => {
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
        const response = await axios.get(`${STOCK_REQUEST_API_URL}/${requestId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status.code === 0) {
          setStockRequest(response.data.data);
        } else {
          throw new Error(`Failed to fetch stock request details: ${response.data.status.message}`);
        }
      } catch (err) {
        console.error("Error fetching stock request data:", err.response?.data || err.message);
        setError(`Error: ${err.message || "Failed to load stock request details."}`);
        toast.error(`Error: ${err.message || "Failed to load stock request details."}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockRequestData();
  }, [requestId, navigate]);

  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getFullYear();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";
    return `${day}${suffix} ${month} ${year}`;
  };

  const renderBatch = (batchStockAllocationModels) => {
    if (!batchStockAllocationModels || batchStockAllocationModels.length === 0) return "N/A";
    return batchStockAllocationModels.map(batch => batch.batch?.id || "Unnamed Batch").join(", ");
  };

  const handleDownload = () => {
    const stockRequestElement = document.getElementById('stock-request-details');
    html2canvas(stockRequestElement, { scale: 2, width: stockRequestElement.scrollWidth, height: stockRequestElement.scrollHeight }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;
      const marginTop = 20;
      const marginLeft = 5;
      const availableWidth = pdfWidth - 2 * marginLeft;
      const availableHeight = pdfHeight - marginTop;
      const widthRatio = availableWidth / imgWidth;
      const heightRatio = availableHeight / imgHeight;
      const ratio = Math.min(widthRatio, heightRatio);
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;
      const xOffset = marginLeft;
      const yOffset = marginTop;

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, scaledWidth, scaledHeight);
      pdf.save(`StockRequest_${stockRequest?.orderCode || 'details'}.pdf`);
    }).catch((error) => {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    });
  };

  const handlePrint = () => {
    const stockRequestElement = document.getElementById('stock-request-details');
    html2canvas(stockRequestElement, { scale: 2, width: stockRequestElement.scrollWidth, height: stockRequestElement.scrollHeight }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Stock Request #${stockRequest?.orderCode || 'Details'}</title>
            <style>
              body { margin: 0; padding: 10mm; }
              img { width: 190mm; height: auto; display: block; }
            </style>
          </head>
          <body>
            <img src="${imgData}" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }).catch((error) => {
      console.error('Error preparing print:', error);
      toast.error('Failed to prepare print');
    });
  };

  if (isLoading) {
    return (
      <div className="card h-100 p-0 radius-12">
        <div className="card-body p-24 text-center">Loading stock request details...</div>
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
        <h6 className="mb-0 fs-5">Stock Request Details: {stockRequest?.orderCode || "N/A"}</h6>
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={handleDownload}
            className="btn btn-sm btn-success radius-8 d-flex align-items-center gap-1"
          >
            <Icon icon="solar:download-linear" className="text-xl" /> Download
          </button>
          <button
            onClick={handlePrint}
            className="btn btn-sm btn-danger radius-8 d-flex align-items-center gap-1"
          >
            <Icon icon="basil:printer-outline" className="text-xl" /> Print
          </button>
        </div>
      </div>
      <div className="card-body p-24" id="stock-request-details">
        {/* Basic Stock Request Information */}
        <div className="mb-4">
          <h6 className="fw-semibold text-primary-light mb-3">Basic Information</h6>
          <div className="row">
            <div className="col-md-6">
              <p><strong>Order Code:</strong> {stockRequest?.orderCode || "N/A"}</p>
              <p><strong>Depot:</strong> {stockRequest?.depot?.name || "N/A"}</p>
              <p><strong>Number of Products:</strong> {stockRequest?.products || 0}</p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Status:</strong> 
                <span className="badge bg-success ms-2">{stockRequest?.status?.name || "N/A"}</span>
              </p>
              <p><strong>Created By:</strong> {stockRequest?.createdBy?.name || "N/A"}</p>
              <p><strong>Approved By:</strong> {stockRequest?.approvedBy?.name || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mb-5">
          <h6 className="fw-semibold fs-5 text-primary-light mb-4 mt-3">Product Details</h6>
          {stockRequest?.productModelList?.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-borderless sm-table mb-0">
                <thead>
                  <tr>
                    <th className="text-start py-3 px-4">Product Name</th>
                    <th className="text-start py-3 px-4">SKU Code</th>
                    <th className="text-start py-3 px-4">Quantity</th>
                    <th className="text-start py-3 px-4">Batch</th>
                    <th className="text-start py-3 px-4">Date Created</th>
                  </tr>
                </thead>
                <tbody>
                  {stockRequest.productModelList.map((product, index) => (
                    <tr key={index}>
                      <td className="text-start small-text py-3 px-4">
                        {product.product?.name || "N/A"}
                      </td>
                      <td className="text-start small-text py-3 px-4">
                        {product.skuCode || "N/A"}
                      </td>
                      <td className="text-start small-text py-3 px-4">
                        {product.quantityRequested || 0}
                      </td>
                      <td className="text-start small-text py-3 px-4">
                        {renderBatch(product.batchStockAllocationModels)}
                      </td>
                      <td className="text-start small-text py-3 px-4">
                        {formatDate(product.dateCreated)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No product details available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovedStockDetailsLayer;