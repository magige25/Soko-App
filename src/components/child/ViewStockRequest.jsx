import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Icon } from "@iconify/react/dist/iconify.js";
import { formatDate } from "../../hook/format-utils";

const PENDING_STOCK_API_URL = "https://api.bizchain.co.ke/v1/stock-requests";

const ViewStockRequest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pendingStock, setPendingStock] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const requestId = location.state?.requestId;

  useEffect(() => {
    if (!requestId) {
      setError("No pending stock request ID provided.");
      setIsLoading(false);
      toast.error("No pending stock request ID provided. Please select a pending stock request.");
      navigate("/stock-request");
      return;
    }

    const fetchPendingStockData = async () => {
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
        const response = await axios.get(`${PENDING_STOCK_API_URL}/${requestId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status.code === 0) {
          setPendingStock(response.data.data);
        } else {
          throw new Error(`Failed to fetch pending stock details: ${response.data.status.message}`);
        }
      } catch (err) {
        console.error("Error fetching pending stock data:", err.response?.data || err.message);
        setError(`Error: ${err.message || "Failed to load pending stock details."}`);
        toast.error(`Error: ${err.message || "Failed to load pending stock details."}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingStockData();
  }, [requestId, navigate]);

  const renderBatch = (batchStockAllocationModels) => {
    if (!batchStockAllocationModels || batchStockAllocationModels.length === 0) return "N/A";
    return batchStockAllocationModels.map((batch) => batch.batch?.id || "Unnamed Batch").join(", ");
  };

  const handleDownload = () => {
    const pendingStockElement = document.getElementById("pending-stock-details");
    html2canvas(pendingStockElement, {
      scale: 2,
      width: pendingStockElement.scrollWidth,
      height: pendingStockElement.scrollHeight,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
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

      pdf.addImage(imgData, "PNG", xOffset, yOffset, scaledWidth, scaledHeight);
      pdf.save(`PendingStock_${pendingStock?.orderCode || "details"}.pdf`);
    }).catch((error) => {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    });
  };

  const handlePrint = () => {
    const pendingStockElement = document.getElementById("pending-stock-details");
    html2canvas(pendingStockElement, {
      scale: 2,
      width: pendingStockElement.scrollWidth,
      height: pendingStockElement.scrollHeight,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Pending Stock #${pendingStock?.orderCode || "Details"}</title>
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
      console.error("Error preparing print:", error);
      toast.error("Failed to prepare print");
    });
  };

  if (isLoading) {
    return (
      <div className="card h-100 p-0 radius-12">
        <div className="card-body p-24 text-center">Loading pending stock details...</div>
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
        <h6 className="mb-0 fs-5">Stock: {pendingStock?.orderCode || "N/A"}</h6>
        <div className="d-flex gap-2">
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
      <div className="card-body p-24" id="pending-stock-details">
        {/* Basic Pending Stock Information */}
        <div className="mb-4">
          <h6 className="fw-semibold text-primary-light mb-3">Basic Information</h6>
          <div className="row">
            <div className="col-md-6">
              <p><strong>Order Code:</strong> {pendingStock?.orderCode || "N/A"}</p>
              <p><strong>Depot:</strong> {pendingStock?.depot?.name || "N/A"}</p>
              <p><strong>Number of Products:</strong> {pendingStock?.products || 0}</p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Status:</strong>
                <span className="badge bg-success ms-2">{pendingStock?.status?.name || "N/A"}</span>
              </p>
              <p><strong>Created By:</strong> {pendingStock?.createdBy?.name || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mb-5">
          <h6 className="fw-semibold fs-5 text-primary-light mb-3 mt-3">Product Details</h6>
          {pendingStock?.productModelList?.length > 0 ? (
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
                  {pendingStock.productModelList.map((product, index) => (
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

export default ViewStockRequest;