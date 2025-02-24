import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
//import { Link } from "react-router-dom";

const SettledSuppliesLayer = () => {
  const [settledSupplies, setSettledSupplies] = useState([
    { name: "Kantaram Company", country: "KENYA", orderNo: "ORD123", numberOfItems: "22", amount: 1025, dateSettled: "2024 Jan 20", status: "Settled" },
    { name: "Morwabe Ventures", country: "KENYA", orderNo: "ORD123", numberOfItems: "11", amount: 455, dateSettled: "2024 Jan 5", status: "Settled" },
    { name: "Kireki Enterprises", country: "KENYA", orderNo: "ORD123", numberOfItems: "15", amount: 675, dateSettled: "2024 Jan 25", status: "Settled" },
    { name: "Nuru Limited", country: "KENYA", orderNo: "ORD123", numberOfItems: "45", amount: 965, dateSettled: "2024 Jan 2", status: "Settled" },
    { name: "Monte Company", country: "KENYA", orderNo: "ORD123", numberOfItems: "21", amount: 1500, dateSettled: "2024 Jan 5", status: "Settled" },
    { name: "Mayuo Ventures", country: "KENYA", orderNo: "ORD123", numberOfItems: "90", amount: 755, dateSettled: "2024 Jan 5", status: "Settled" },
    { name: "Xi Xieny", country: "KENYA", orderNo: "ORD124", numberOfItems: "291", amount: 454, dateSettled: "2024 Jan 5", status: "Settled" },
    { name: "Luo Xieny", country: "KENYA", orderNo: "ORD124", numberOfItems: "291", amount: 454, dateSettled: "2024 Jan 5", status: "Settled" },
    { name: "Ka Xieny", country: "KENYA", orderNo: "ORD124", numberOfItems: "291", amount: 454, dateSettled: "2024 Jan 5", status: "Settled" },
    { name: "Dong Xieny", country: "KENYA", orderNo: "ORD124", numberOfItems: "291", amount: 454, dateSettled: "2024 Jan 5", status: "Settled" },
    { name: "Muo Xieny", country: "KENYA", orderNo: "ORD124", numberOfItems: "291", amount: 454, dateSettled: "2024 Jan 5", status: "Settled" },
    { name: "Li Xieny", country: "KENYA", orderNo: "ORD124", numberOfItems: "291", amount: 454, dateSettled: "2024 Jan 5", status: "Settled" },
    { name: "Guo Xieny", country: "KENYA", orderNo: "ORD124", numberOfItems: "291", amount: 454, dateSettled: "2024 Jan 5", status: "Settled" },
    { name: "Lu Ka", country: "KENYA", orderNo: "ORD124", numberOfItems: "291", amount: 454, dateSettled: "2024 Jan 5", status: "Settled" },
  ]);

  const [searchItem, setSearchItem] = useState("");
  const filteredItems = settledSupplies.filter((supply) =>
    supply.name.toLowerCase().includes(searchItem.toLowerCase())
  );

  const [settledSuppliesToDelete, setSettledSuppliesToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Changed to constant since it’s not updated
  const [selectedSupply, setSelectedSupply] = useState(null); // Fixed typo

  const handleDeleteClick = (supply) => {
    setSettledSuppliesToDelete(supply);
  };

  const handleDeleteConfirm = () => {
    const updatedSettledSupplies = settledSupplies.filter(
      (r) => r.name !== settledSuppliesToDelete.name
    );
    setSettledSupplies(updatedSettledSupplies);
    setSettledSuppliesToDelete(null);
  };

  // Pagination logic using filteredItems
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="page-wrapper">
      <div className="row">
        {/* Settled Supplies table */}
        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">
            <div>
              <form
                className="navbar-search"
                style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}
              >
                <input
                  type="text"
                  name="search"
                  placeholder="Search"
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                />
                <Icon icon="ion:search-outline" className="icon" style={{ width: "16px", height: "16px" }} />
              </form>
            </div>
            <div className="table-responsive" style={{ overflow: "visible" }}>
              <table className="table table-borderless text-start small-text" style={{ width: "100%" }}>
                <thead className="table-light text-start small-text">
                  <tr>
                    <th className="text-start">#</th>
                    <th className="text-start">Name</th>
                    <th className="text-start">Country</th>
                    <th className="text-start">Order No.</th>
                    <th className="text-start">No. Of Items</th>
                    <th className="text-start">Amount</th>
                    <th className="text-start">Date Settled</th>
                    <th className="text-start">Status</th>
                    <th className="text-start">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((supply, index) => (
                    <tr key={index}>
                      <th scope="row" className="text-start small-text">
                        {indexOfFirstItem + index + 1}
                      </th>
                      <td className="text-start small-text">{supply.name}</td>
                      <td className="text-start small-text">{supply.country}</td>
                      <td className="text-start small-text">{supply.orderNo}</td>
                      <td className="text-start small-text">{supply.numberOfItems}</td>
                      <td className="text-start small-text">{supply.amount}</td>
                      <td className="text-start small-text">{supply.dateSettled}</td>
                      <td className="text-start small-text">{supply.status}</td>
                      <td className="text-start small-text">
                        <div className="dropdown">
                          <button
                            className="btn btn-light dropdown-toggle btn-sm"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Actions
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#viewModal"
                                onClick={() => setSelectedSupply(supply)}
                              >
                                View
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(supply)}
                                data-bs-toggle="modal"
                                data-bs-target="#deleteModal"
                              >
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-start mt-3">
              <div className="text-muted">
                <span>
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of{" "}
                  {filteredItems.length} entries
                </span>
              </div>
              <nav aria-label="Page navigation">
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      type="button"
                      className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                    >
                      <Icon icon="ep:d-arrow-left" />
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                      <button
                        type="button"
                        className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px"
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                      type="button"
                      className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                    >
                      <Icon icon="ep:d-arrow-right" />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        {/* View Settled Order Modal */}
        <div className="modal fade" id="viewModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Settled Supplies
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </h6>
                {selectedSupply && (
                  <>
                    <div className="mb-3">
                      <strong>Name:</strong> {selectedSupply.name}
                    </div>
                    <div className="mb-3">
                      <strong>Country:</strong> {selectedSupply.country}
                    </div>
                    <div className="mb-3">
                      <strong>No. of Items:</strong> {selectedSupply.numberOfItems}
                    </div>
                    <div className="mb-3">
                      <strong>Amount:</strong> ${selectedSupply.amount}
                    </div>
                    <div className="mb-3">
                      <strong>Date Settled:</strong> {selectedSupply.dateSettled}
                    </div>
                    <div className="mb-3">
                      <strong>Status:</strong> {selectedSupply.status}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <div className="modal fade" id="deleteModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body pt-3 ps-18 pe-18">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="modal-title fs-6">Delete Settled Supplies</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <p className="pb-3 mb-0">
                  Are you sure you want to delete the <strong>{settledSuppliesToDelete?.name}</strong> Settled Supply
                  permanently? This action cannot be undone.
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
    </div>
  );
};

export default SettledSuppliesLayer;