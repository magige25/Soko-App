import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Icon } from '@iconify/react/dist/iconify.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const API_URL = 'https://api.bizchain.co.ke/v1/invoice';

const InvoicesPreviewLayer = () => {
  const [invoice, setInvoice] = useState(null);
  const location = useLocation();
  const invoiceId = location.state?.invoiceId;

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const selectedInvoice = response.data.data.find(inv => inv.id === invoiceId);
        setInvoice(selectedInvoice);
      } catch (error) {
        console.error('Error fetching invoice:', error);
      }
    };
    if (invoiceId) fetchInvoice();
  }, [invoiceId]);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return "";
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

  const handleDownload = () => {
    const invoiceElement = document.getElementById('invoice');
    html2canvas(invoiceElement, { scale: 2, width: invoiceElement.scrollWidth, height: invoiceElement.scrollHeight }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;
      const marginTop = 20; 
      const marginLeft = 10;
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
      pdf.save(`Invoice_${invoice.invoiceNo}.pdf`);
    }).catch((error) => {
      console.error('Error generating PDF:', error);
    });
  };

  const handlePrint = () => {
    const invoiceElement = document.getElementById('invoice');
    html2canvas(invoiceElement, { scale: 2, width: invoiceElement.scrollWidth, height: invoiceElement.scrollHeight }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Invoice #${invoice.invoiceNo}</title>
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
    });
  };

  if (!invoice) return <div>Loading...</div>;

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-end gap-2">
        <Link to="#" className="btn btn-sm btn-primary-600 radius-8 d-flex align-items-center gap-1">
          <Icon icon="pepicons-pencil:paper-plane" className="text-xl" /> Send
        </Link>
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

      <div className="card-body py-40">
        <div className="row justify-content-center" id="invoice">
          <div className="col-lg-8">
            <div className="shadow-4 border radius-8">
              <div className="p-20 d-flex justify-content-between border-bottom">
                <div>
                  <h3 className="text-xl">Invoice #{invoice.invoiceNo}</h3>
                  <p className="mb-1 text-sm">Date Issued: {formatDate(invoice.dateCreated)}</p>
                  <p className="mb-1 text-sm">Due Date: {formatDate(invoice.dateCreated)}</p>
                  <p className="mb-1 text-sm">
                    Status: <span className="bg-warning-focus text-warning-600 px-24 py-4 radius-8 fw-medium text-sm">
                      {invoice.status.name}
                    </span>
                  </p>
                </div>
                <div>
                  <img src="/assets/images/logo.png" alt="image_icon" className="mb-8" />
                  <p className="mb-1 text-sm">4517 Kenyatta Ave. Nairobi, I&M Tower</p>
                  <p className="mb-0 text-sm">tigersoft@gmail.com, +254746721984</p>
                </div>
              </div>

              <div className="py-28 px-20">
                <div className="d-flex justify-content-between align-items-end">
                  <div>
                    <h6 className="text-md">Issued For:</h6>
                    <table className="text-sm text-secondary-light">
                      <tbody>
                        <tr><td>Name:</td><td className="ps-8">{invoice.supplier.name}</td></tr>
                        <tr><td>Phone:</td><td className="ps-8">{invoice.disbursementNumber}</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <table className="text-sm text-secondary-light">
                      <tbody>
                        <tr><td>Issue Date:</td><td className="ps-8">{formatDate(invoice.dateCreated)}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-24">
                  <div className="table-responsive scroll-sm">
                    <table className="table table-borderless sm-table mb-0">
                      <thead>
                        <tr>
                          <th scope="col" className="text-start py-3 px-4">#</th>
                          <th scope="col" className="text-start py-3 px-4">Quantity(Litres)</th>
                          <th scope="col" className="text-start py-3 px-4">Price per Litre</th>
                          <th scope="col" className="text-start py-3 px-4">Date Delivered</th>
                          <th scope="col" className="text-end py-3 px-4">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.deliveries.map((delivery, index) => (
                          <tr key={delivery.id} style={{ transition: 'background-color 0.2s' }}>
                            <td className="text-start small-text py-3 px-4">{index + 1}</td>
                            <td className="text-start small-text py-3 px-4">{delivery.litres}</td>
                            <td className="text-start small-text py-3 px-4">{formatCurrency(delivery.pricePerLitre)}</td>
                            <td className="text-start small-text py-3 px-4">{formatDate(delivery.dateCreated)}</td>
                            <td className="text-end small-text py-3 px-4">{formatCurrency(delivery.totalAmount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="d-flex justify-content-end mt-3"> 
                    <table className="text-sm">
                      <tbody>
                        <tr>
                          <td className="text-end py-3 px-4 fw-semibold">Total Amount:</td> 
                          <td className="text-end py-3 px-4 fw-semibold">
                            {formatCurrency(invoice.deliveries.reduce((sum, del) => sum + del.totalAmount, 0))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicesPreviewLayer;