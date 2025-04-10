import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Spinner } from "../hook/spinner-utils";
import { formatDate, formatCurrency } from "../hook/format-utils";

const API_URL = "https://api.bizchain.co.ke/v1/invoice";

const InvoicesLayer = () => {
  const [invoices, setInvoices] = useState([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInvoices = useCallback(async (page = 1, searchQuery = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: page - 1,
          size: itemsPerPage,
          searchValue: searchQuery,
          _t: new Date().getTime(),
        },
      });

      console.log('Full API Response:', response.data);
      const responseData = response.data;
      if (responseData.status.code === 0) {
        const invoicedOnly = (responseData.data || [])
          .filter(invoice => invoice.status.code === "INV")
          .map(invoice => ({
            ...invoice,
            totalLitres: invoice.deliveries.reduce((sum, delivery) => sum + (delivery.litres || 0), 0),
          }));
        console.log("Invoiced Data with Total Litres:", invoicedOnly);
        setInvoices(invoicedOnly);
        setTotalItems(responseData.totalElements || invoicedOnly.length);
      } else {
        throw new Error(responseData.status.message);
      }
    } catch (error) {
      console.error("Error fetching Invoices:", error);
      setError("Failed to fetch invoices. Please try again.");
      setInvoices([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchInvoices(currentPage, query);
  }, [currentPage, query, fetchInvoices]);

  const handleSearchInputChange = (e) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };


  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <form className="navbar-search">
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              name="search"
              placeholder="Search by supplier, invoice number, etc."
              value={query}
              onChange={handleSearchInputChange}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
        </div>
      </div>

      <div className="card-body p-24">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="table-responsive scroll-sm">
          <table className="table table-borderless sm-table mb-0">
            <thead>
              <tr>
                <th scope="col" className="text-center py-3 px-6">#</th>
                <th scope="col" className="text-start py-3 px-4">Supplier</th>
                <th scope="col" className="text-start py-3 px-4">Invoice Number</th>
                <th scope="col" className="text-start py-3 px-4">Volume(Litres)</th>
                <th scope="col" className="text-start py-3 px-4">Total Amount</th>
                <th scope="col" className="text-start py-3 px-4">Status</th>
                <th scope="col" className="text-start py-3 px-4">Disbursement Method</th>
                <th scope="col" className="text-start py-3 px-4">Disbursement Criteria</th>
                <th scope="col" className="text-start py-3 px-4">Phone Number</th>
                <th scope="col" className="text-start py-3 px-4">Date Created</th>
                <th scope="col" className="text-start py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="11" className="text-center py-3">
                    <Spinner />
                  </td>
                </tr>
              ) : invoices.length > 0 ? (
                invoices.map((invoice, index) => (
                  <tr key={invoice.id} style={{ transition: "background-color 0.2s" }}>
                    <td className="text-center small-text py-3 px-6">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="text-start small-text py-3 px-4">
                      <Link
                        to="/pending-invoices/invoice"
                        state={{ invoiceId: invoice.id }}
                        className="text-primary text-hover-primary"
                      >
                        {invoice.supplier.name}
                      </Link>
                    </td>
                    <td className="text-start small-text py-3 px-4">{invoice.invoiceNo}</td>
                    <td className="text-start small-text py-3 px-4">{invoice.totalLitres}</td>
                    <td className="text-start small-text py-3 px-4">{formatCurrency(invoice.amount)}</td>
                    <td className="text-start small-text py-3 px-4">
                      <span
                        className={`bg-warning-focus text-warning-600 px-24 py-4 radius-8 fw-medium text-sm`}
                      >
                        {invoice.status.name}
                      </span>
                    </td>
                    <td className="text-start small-text py-3 px-4">{invoice.disbursementMethod.name}</td>
                    <td className="text-start small-text py-3 px-4">{invoice.disbursementCriteria.name}</td>
                    <td className="text-start small-text py-3 px-4">{invoice.disbursementNumber}</td>
                    <td className="text-start small-text py-3 px-4">{formatDate(invoice.dateCreated)}</td>
                    <td className="text-start small-text py-3 px-4">
                      <div className="action-dropdown">
                        <div className="dropdown">
                          <button
                            className="btn btn-outline-secondary btn-sm dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Actions
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <Link
                                className="dropdown-item"
                                to="/pending-invoices/invoice"
                                state={{ invoiceId: invoice.id }}
                              >
                                View
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center py-3">
                    No pending invoices found
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
                    aria-label="Previous page"
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
                    aria-label="Next page"
                  >
                    <Icon icon="ri-arrow-drop-right-line" style={{ fontSize: "12px" }} />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicesLayer;