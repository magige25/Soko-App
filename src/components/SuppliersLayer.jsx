import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const SuppliersLayer = () => {
  const suppliers = [
    { name: "Apexio Company", email: "apexio@gmail.com", phoneNo: 756453475, paymentMethod: "Cash", status: "Active" },
    { name: "Joy Link Ventures", email: "joylink@gmail.com", phoneNo: 756453475, paymentMethod: "Bank", status: "Active"  },
    { name: "Charmie Enterprises", email: "charmie@gmail.com", phoneNo: 756453475, paymentMethod: "Cash", status: "Active"  },
    { name: "Customs Limited", email: "customs@gmail.com", phoneNo: 756453475, paymentMethod: "PAybill", status: "Inactive"  },
    { name: "Plastic Company", email: "plastic@gmail.com", phoneNo: 756453475, paymentMethod: "Cash", status: "Active"  },
    { name: "Wesa Ventures", email: "wesa@gmail.com", phoneNo: 756453475, paymentMethod: "Paybill", status: "Active"  },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page
  const totalPages = Math.ceil(suppliers.length / itemsPerPage);

  // Calculate current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = suppliers.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="page-wrapper">
      <div className="row">
        <div className="card shadow-sm mt-3 full-width-card" style={{ width: '100%' }}>
          <div className="card-body">
            <div>
              <form className="navbar-search" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', width: "32px" }}>
                <input type='text' name='search' placeholder='Search' />
                <Icon icon='ion:search-outline' className='icon' style={{ width: '16px', height: '16px' }} />
              </form>
            </div>
            <div className="table-responsive" style={{ overflow: 'visible' }}>
              <table className="table table-borderless text-start small-text" style={{ width: '100%' }}>
                <thead className="table-light text-start small-text">
                  <tr>
                    <th className="text-start">#</th>
                    <th className="text-start">Name</th>
                    <th className="text-start">Email</th>
                    <th className="text-start">Phone No.</th>
                    <th className="text-start">Payment Method</th>
                    <th className="text-start">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((supplier, index) => (
                    <tr key={index}>
                      <th scope="row" className="text-start small-text">{indexOfFirstItem + index + 1}</th>
                      <td className="text-start small-text">{supplier.name} Supplier</td>
                      <td className="text-start small-text">{supplier.email}</td>
                      <td className="text-start small-text">{supplier.phoneNo}</td>
                      <td className="text-start small-text">{supplier.paymentMethod}</td>
                      <td className="text-start small-text">{supplier.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-start mt-3">
              <div className="text-muted">
                <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, suppliers.length)} of {suppliers.length} entries</span>
              </div>
              <nav aria-label="Page navigation">
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <Icon icon="ep:d-arrow-left" />
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button
                        className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px"
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <Icon icon="ep:d-arrow-right" />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppliersLayer;