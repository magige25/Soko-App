import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

const PendingSuppliesLayer = () => {
    const [pendingSupplies, setPendingSupplies] = useState( [
        { name: "Apexio Company", orderNo: "ORD123", numberOfItems: "22", amount: 1025 , dateOrdered: "24 Jan 2025", status: "Received",  },
        { name: "Joy Link Ventures", orderNo: "ORD123", numberOfItems: "11", amount: 455, dateOrdered: "24 Jan 2025", status: "Received"  },
        { name: "Charmie Enterprises", orderNo: "ORD123", numberOfItems: "15", amount: 675, dateOrdered: "24 Jan 2025", status: "Received"  },
        { name: "Customs Limited", orderNo: "ORD123", numberOfItems: "45", amount: 965, dateOrdered: "24 Jan 2025", status: "Not Received"  },
        { name: "Plastic Company", orderNo: "ORD123", numberOfItems: "21", amount: 1500, dateOrdered: "24 Jan 2025", status: "Received"  },
        { name: "Wesa Ventures", orderNo: "ORD123", numberOfItems: "90", amount: 755, dateOrdered: "24 Jan 2025", status: "Received"  },
      ]);

    const [editPendingSupplies, setEditPendingSupplies] = React.useState({ name: '', orderNo: '', numberOfItems: '', amount: '', dateOrdered: '',  status:'' });
    const [newPendingSupplies, setNewPendingSupplies] = useState({ name: '', orderNo: '', numberOfItems: '', amount: '', dateOrdered: '',  status:'' });
    const [pendingSuppliesToDelete, setPendingSuppliesToDelete] = React.useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
  

    const handleEditClick = (PendingSupplies) => {
    setEditPendingSupplies(PendingSupplies);
  };

    const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedPendingSupplies = pendingSupplies.map((r) =>
      r.name === editPendingSupplies.name ? { ...r, ...editPendingSupplies } : r
    );
    setPendingSupplies(updatedPendingSupplies);
  };

  const handleDeleteClick = (pendingSupplies) => {
    setPendingSuppliesToDelete(pendingSupplies);
  };

  const handleDeleteConfirm = () => {
    const updatedPendingSupplies = pendingSupplies.filter((r) => r.name !== pendingSuppliesToDelete.name);
    setPendingSupplies(updatedPendingSupplies);
    setPendingSuppliesToDelete(null);
  };

  const handleAddPendingSupplies = (e) => {
    e.preventDefault();
    if (!newPendingSupplies.name || !newPendingSupplies.orderNo || !newPendingSupplies.numberOfItems) {
      alert("Please fill in all fields before saving.");
      return;
    }
    const newPendingSuppliesData = {
      name: newPendingSupplies.name,
      orderNo: newPendingSupplies.orderNo,
      numberOfItems: newPendingSupplies.numberOfItems,
      amount: newPendingSupplies.amount,
      dateOrdered: newPendingSupplies.dateOrdered,
      status: newPendingSupplies.status,
      
    };
    setPendingSupplies([...pendingSupplies, newPendingSuppliesData]);
    setNewPendingSupplies({ name: '', orderNo: '', numberOfItems: '', amount: '', dateOrdered: '',  status:'' }); // Reset form state
    e.target.reset(); // Reset the form
  };
// Function to format amount as dollars
const formatAmount = (amount) => {
  return `$${amount.toLocaleString()}`; // Adds a dollar sign and formats with commas
};

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pendingSupplies.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(pendingSupplies.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="page-wrapper">
      <div className="row">

        {/* Add Supply */}
        <div className="d-flex align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="ms-auto">
            <button
              type="button"
              className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add Pending Supply
            </button>
          </div>
        </div>

        {/* Pending Supplies table */}
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
                    <th className="text-start">Order No.</th>
                    <th className="text-start">No. Of Items</th>
                    <th className="text-start">Amount</th>
                    <th className="text-start">Date Ordered</th>
                    <th className="text-start">Status</th>
                    <th className="text-start">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((PendingSupplies, index) => (
                    <tr key={index}>
                      <th scope="row" className="text-start small-text">{indexOfFirstItem + index + 1}</th>
                      <td className="text-start small-text">{PendingSupplies.name}</td>
                      <td className="text-start small-text">{PendingSupplies.orderNo}</td>
                      <td className="text-start small-text">{PendingSupplies.numberOfItems}</td>
                      <td className="text-start small-text">{formatAmount(PendingSupplies.amount)}</td>
                      <td className="text-start small-text">{PendingSupplies.dateOrdered}</td>
                      <td className="text-start small-text">{PendingSupplies.status}</td>
                      <td className="text-start small-text">
                        <div className="dropdown">
                          <button className="btn btn-light dropdown-toggle btn-sm" type="button" data-bs-toggle="dropdown">
                            Actions
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <Link
                                className="dropdown-item"
                                to={`/Pending-supplies/${PendingSupplies.name}`}
                                state={{ PendingSupplies }}
                                onClick={() => console.log("Link clicked:", PendingSupplies)} // Debugging
                              >
                                View
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item"
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#editModal"
                                onClick={() => handleEditClick(PendingSupplies)}
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(PendingSupplies)}
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
                <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, pendingSupplies.length)} of {pendingSupplies.length} entries</span>
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

        {/* Add Pending Supplies Modal */}
        <div className="modal fade" id="exampleModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Add Pending Supply
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                <form onSubmit={handleAddPendingSupplies}>
                  <div className="mb-3">
                    <label className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control w-100"
                      name="name"
                      placeholder="Enter Pending Supplies Name"
                      value={newPendingSupplies.name}
                      onChange={(e) => setNewPendingSupplies({ ...newPendingSupplies, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Order NO. <span className="text-danger">*</span>
                    </label>
                    <input
                      type="alphanumeric"
                      className="form-control w-100"
                      orderNo="order No"
                      placeholder="Enter Order Number"
                      value={newPendingSupplies.orderNo}
                      onChange={(e) => setNewPendingSupplies({ ...newPendingSupplies, orderNo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Amount <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control w-100"
                      name="amountphone No"
                      placeholder="Enter Amount"
                      value={newPendingSupplies.amount}
                      onChange={(e) => setNewPendingSupplies({ ...newPendingSupplies, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      No. Of Items <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control w-100"
                      name="Number Of Items"
                      placeholder="Enter No. Of Items"
                      value={newPendingSupplies.numberOfItems}
                      onChange={(e) => setNewPendingSupplies({ ...newPendingSupplies, numberOfItems: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Date Ordered <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control w-100"
                      name="date ordered"
                      placeholder="Enter Date Ordered"
                      value={newPendingSupplies.dateOrdered}
                      onChange={(e) => setNewPendingSupplies({ ...newPendingSupplies, dateOrdered: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <div className="position-relative">
                      <label className="form-label">
                        Status <span className="text-danger">*</span>
                      </label>
                      <div
                        className="form-control d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowDropdown(!showDropdown)}
                      >
                        <span>{newPendingSupplies.status || "Select Status"}</span>
                        <i className="dropdown-toggle ms-2"></i>
                      </div>
                      {showDropdown && (
                        <ul className="dropdown-menu w-100 show" style={{ position: "absolute", top: "100%", left: 0, zIndex: 1000 }}>
                          {["Received", "Not Received"].map((status, index) => (
                            <li key={index}>
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => {
                                  setNewPendingSupplies({ ...newPendingSupplies, status });
                                  setShowDropdown(false);
                                }}
                              >
                                {status}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

         {/* Edit Pending Supplies Modal */}
        <div className="modal fade" id="editModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Edit Pending Supplies
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Pending Supplies Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Pending Supplies Name"
                      value={editPendingSupplies.name}
                      onChange={(e) => setEditPendingSupplies({ ...editPendingSupplies, name: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Customers</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter Number of Customers"
                      value={editPendingSupplies.customers}
                      onChange={(e) => setEditPendingSupplies({ ...editPendingSupplies, customers: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Sales Agents</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter Number of Sales Agents"
                      value={editPendingSupplies.salesAgents}
                      onChange={(e) => setEditPendingSupplies({ ...editPendingSupplies, salesAgents: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <div className="modal fade" id="deleteModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body pt-3 ps-18 pe-18">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="modal-title fs-6">Delete Pending Supplies</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <p className="pb-3 mb-0">
                  Are you sure you want to delete the <strong>{pendingSuppliesToDelete?.name}</strong> Pending Supply permanently? This action cannot be undone.
                </p>
              </div>
              <div className="d-flex justify-content-end gap-2 px-12 pb-3">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDeleteConfirm}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingSuppliesLayer;