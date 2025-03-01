import React, { useState, useEffect } from "react";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";

const API_URL = "";

const SettledBillsLayer = () => {
  const [settledBills, setSettledBills] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [settledBillsToDelete, setSettledBillsToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBill, setSelectedBill] = useState(null);
  const itemsPerPage = 10;

  // Fetching settled bills
  useEffect(() => {
    fetchSettledBills();
  }, []);

  const fetchSettledBills = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response Data:", response.data.data);
      setSettledBills(response.data.data);
    } catch (error) {
      console.error("Error fetching Settled Bills:", error);
    }
  };

  const filteredItems = settledBills.filter((bill) =>
    Object.values(bill).some((value) =>
      String(value).toLowerCase().includes(searchItem.toLowerCase())
    )
  );

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(amount);

  const handleDeleteClick = (bill) => {
    setSettledBillsToDelete(bill);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${settledBillsToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`Successfully deleted bill with ID: ${settledBillsToDelete.id}`);
      const updatedSettledBills = settledBills.filter(
        (r) => r.id !== settledBillsToDelete.id
      );
      setSettledBills(updatedSettledBills);
      setSettledBillsToDelete(null);
    } catch (error) {
      console.error("Error deleting Settled Bill:", error);
    }
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
        {/* Settled Bills table */}
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
                    <th scope="col" className="text-start">#</th>
                    <th scope="col" className="text-start">Name</th>
                    <th scope="col" className="text-start">Country</th>
                    <th scope="col" className="text-start">Order No.</th>
                    <th scope="col" className="text-start">No. Of Items</th>
                    <th scope="col" className="text-start">Amount</th>
                    <th scope="col" className="text-start">Date Settled</th>
                    <th scope="col" className="text-start">Status</th>
                    <th scope="col" className="text-start">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((bill, index) => (
                    <tr key={bill.id}>
                      <th scope="row" className="text-start small-text">
                        {indexOfFirstItem + index + 1}
                      </th>
                      <td className="text-start small-text">{bill.name}</td>
                      <td className="text-start small-text">{bill.country}</td>
                      <td className="text-start small-text">{bill.orderNo}</td>
                      <td className="text-start small-text">{bill.numberOfItems}</td>
                      <td className="text-start small-text">{formatCurrency(bill.amount)}</td>
                      <td className="text-start small-text">{bill.dateSettled}</td>
                      <td className="text-start small-text">{bill.status}</td>
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
                                onClick={() => setSelectedBill(bill)}
                              >
                                View
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(bill)}
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
                  Showing {filteredItems.length > 0 ? indexOfFirstItem + 1 : 0} to{" "}
                  {Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} entries
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

        {/* View Settled Bill Modal */}
        <div className="modal fade" id="viewModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Settled Bills
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </h6>
                {selectedBill && (
                  <>
                    <div className="mb-3">
                      <strong>Name:</strong> {selectedBill.name}
                    </div>
                    <div className="mb-3">
                      <strong>Country:</strong> {selectedBill.country}
                    </div>
                    <div className="mb-3">
                      <strong>No. of Items:</strong> {selectedBill.numberOfItems}
                    </div>
                    <div className="mb-3">
                      <strong>Amount:</strong> {formatCurrency(selectedBill.amount)}
                    </div>
                    <div className="mb-3">
                      <strong>Date Settled:</strong> {selectedBill.dateSettled}
                    </div>
                    <div className="mb-3">
                      <strong>Status:</strong> {selectedBill.status}
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
                  <h6 className="modal-title fs-6">Delete Settled Bill</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <p className="pb-3 mb-0">
                  Are you sure you want to delete the <strong>{settledBillsToDelete?.name}</strong> Settled Bill
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

export default SettledBillsLayer;