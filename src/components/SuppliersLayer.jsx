import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "https://biz-system-production.up.railway.app/v1/suppliers";

const PAYMENT_METHODS = {
  "Mpesa": "MPS",
  "Bank": "BNK", // Adjust based on server docs
  "Cash": "CSH", // Adjust based on server docs
};
const TRANSPORT_MODES = {
  "Walking": "WKG",
  "Public": "PBLC",
  "Truck": "TRK", // Adjust based on server docs
};

const SuppliersLayer = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [editSupplier, setEditSupplier] = useState({
    id: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    productionQuantity: "",
    numberCattle: "",
    pendingBills: "",
    unpaidBills: "",
    residence: "",
    paymentMethod: "",
    transportMode: "",
  });
  const [newSupplier, setNewSupplier] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    productionQuantity: "",
    numberCattle: "",
    pendingBills: "",
    unpaidBills: "",
    residence: "",
    paymentMethod: "",
    transportMode: "",
  });
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [viewSupplier, setViewSupplier] = useState(null);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [showTransportDropdown, setShowTransportDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }
      try {
        const response = await axios.get(API_URL, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const result = response.data;
        if (result.status.code === 0) {
          const mappedSuppliers = result.data.map((supplier) => ({
            id: supplier.id,
            firstName: supplier.firstName,
            lastName: supplier.lastName,
            phoneNumber: supplier.phoneNumber,
            productionQuantity: supplier.productionQuantity,
            numberCattle: supplier.numberCattle,
            pendingBills: supplier.pendingBills,
            unpaidBills: supplier.unpaidBills,
            residence: supplier.supplierResidence.name,
            paymentMethod: supplier.disbursementMethod.name,
            transportMode: supplier.transportMode.name,
            dateCreated: supplier.dateCreated.split("T")[0],
            expansionCapacity: supplier.expansionCapacity,
            contactPersonName: supplier.contactPersonName,
            disbursementCriteria: supplier.disbursementCriteria.name,
            paymentCycle: supplier.paymentCycle ? supplier.paymentCycle.name : "N/A",
            disbursementPhoneNumber: supplier.disbursementPhoneNumber,
          }));
          setSuppliers(mappedSuppliers);
          setError(null);
        } else {
          setError(`Failed to fetch suppliers: ${result.status.message}`);
        }
      } catch (error) {
        setError(`Error fetching suppliers: ${error.message}`);
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  const fetchSupplierDetails = async (supplierId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      return null;
    }
    try {
      const response = await axios.get(`${API_URL}/${supplierId}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = response.data;
      if (data.status.code === 0) {
        const supplier = data.data;
        return {
          id: supplier.id,
          firstName: supplier.firstName,
          lastName: supplier.lastName,
          phoneNumber: supplier.phoneNumber,
          productionQuantity: supplier.productionQuantity,
          numberCattle: supplier.numberCattle,
          pendingBills: supplier.pendingBills,
          unpaidBills: supplier.unpaidBills,
          residence: supplier.supplierResidence.name,
          paymentMethod: supplier.disbursementMethod.name,
          transportMode: supplier.transportMode.name,
          dateCreated: supplier.dateCreated.split("T")[0],
          expansionCapacity: supplier.expansionCapacity,
          contactPersonName: supplier.contactPersonName,
          disbursementCriteria: supplier.disbursementCriteria.name,
          paymentCycle: supplier.paymentCycle ? supplier.paymentCycle.name : "N/A",
          disbursementPhoneNumber: supplier.disbursementPhoneNumber,
        };
      } else {
        console.error("Failed to fetch supplier details:", data.status.message);
        return null;
      }
    } catch (error) {
      console.error("Error fetching supplier details:", error);
      return null;
    }
  };

  const handleEditClick = (supplier) => {
    setEditSupplier(supplier);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }
    try {
      let phoneNumber = editSupplier.phoneNumber;
      if (phoneNumber.startsWith("+254")) {
        phoneNumber = phoneNumber.replace("+254", "0");
      } else if (!phoneNumber.startsWith("0")) {
        phoneNumber = `0${phoneNumber}`;
      }

      const payload = {
        firstName: editSupplier.firstName,
        lastName: editSupplier.lastName,
        phoneNumber: phoneNumber,
        productionQuantity: parseFloat(editSupplier.productionQuantity) || 0,
        numberCattle: parseInt(editSupplier.numberCattle, 10) || 0,
        supplierResidence: 1, // Hardcoded; adjust if dynamic
        disbursementMethod: PAYMENT_METHODS[editSupplier.paymentMethod] || "MPS",
        transportMode: TRANSPORT_MODES[editSupplier.transportMode] || "PBLC",
        expansionSpace: true,
        expansionCapacity: 5,
        contactPersonName: editSupplier.firstName,
        contactPersonPhoneNumber: phoneNumber,
        disbursementCriteria: "TM",
        paymentCycle: "WKLY",
        disbursementPhoneNumber: phoneNumber,
      };
      console.log("Edit Supplier Payload:", payload);
      const response = await axios.put(`${API_URL}/${editSupplier.id}`, payload, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      });
      console.log("Edit Supplier Response:", response.data);
      if (response.status === 200 && response.data.status?.code === 0) {
        const updatedSuppliers = suppliers.map((r) =>
          r.id === editSupplier.id ? { ...r, ...editSupplier } : r
        );
        setSuppliers(updatedSuppliers);
        setEditSupplier({
          id: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
          productionQuantity: "",
          numberCattle: "",
          pendingBills: "",
          unpaidBills: "",
          residence: "",
          paymentMethod: "",
          transportMode: "",
        });
        setError(null);
      } else {
        setError("Failed to update supplier: Unexpected server response.");
      }
    } catch (error) {
      setError(`Error updating supplier: ${error.response?.data?.message || error.message}`);
      console.error("Error updating supplier:", error.response?.data || error);
    }
  };

  const handleDeleteClick = (supplier) => {
    setSupplierToDelete(supplier);
  };

  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }
    try {
      const response = await axios.delete(`${API_URL}/${supplierToDelete.id}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (response.status === 200 && response.data.status?.code === 0) {
        const updatedSuppliers = suppliers.filter((r) => r.id !== supplierToDelete.id);
        setSuppliers(updatedSuppliers);
        setSupplierToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }
    const requiredFields = [
      "firstName",
      "lastName",
      "phoneNumber",
      "productionQuantity",
      "numberCattle",
      "residence",
      "paymentMethod",
      "transportMode",
    ];
    if (requiredFields.some((field) => !newSupplier[field])) {
      setError("Please fill in all required fields before saving.");
      return;
    }
    try {
      let phoneNumber = newSupplier.phoneNumber;
      if (phoneNumber.startsWith("+254")) {
        phoneNumber = phoneNumber.replace("+254", "0");
      } else if (!phoneNumber.startsWith("0")) {
        phoneNumber = `0${phoneNumber}`;
      }

      const payload = {
        firstName: newSupplier.firstName,
        lastName: newSupplier.lastName,
        phoneNumber: phoneNumber,
        productionQuantity: parseFloat(newSupplier.productionQuantity) || 0,
        numberCattle: parseInt(newSupplier.numberCattle, 10) || 0,
        supplierResidence: 1,
        disbursementMethod: PAYMENT_METHODS[newSupplier.paymentMethod] || "MPS",
        transportMode: TRANSPORT_MODES[newSupplier.transportMode] || "PBLC",
        expansionSpace: true,
        expansionCapacity: 5,
        contactPersonName: newSupplier.firstName,
        contactPersonPhoneNumber: phoneNumber,
        disbursementCriteria: "TM",
        paymentCycle: "WKLY",
        disbursementPhoneNumber: phoneNumber,
      };
      console.log("Add Supplier Payload:", payload);
      const response = await axios.post(API_URL, payload, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const addedSupplier = response.data;
      console.log("Add Supplier Response:", addedSupplier);
      if (response.status === 201 && addedSupplier.status.code === 0) {
        const mappedSupplier = {
          id: addedSupplier.data.id,
          firstName: addedSupplier.data.firstName,
          lastName: addedSupplier.data.lastName,
          phoneNumber: addedSupplier.data.phoneNumber,
          productionQuantity: addedSupplier.data.productionQuantity,
          numberCattle: addedSupplier.data.numberCattle,
          pendingBills: addedSupplier.data.pendingBills || 0,
          unpaidBills: addedSupplier.data.unpaidBills || 0,
          residence: addedSupplier.data.supplierResidence.name,
          paymentMethod: addedSupplier.data.disbursementMethod.name,
          transportMode: addedSupplier.data.transportMode.name,
          dateCreated: addedSupplier.data.dateCreated.split("T")[0],
          expansionCapacity: addedSupplier.data.expansionCapacity,
          contactPersonName: addedSupplier.data.contactPersonName,
          disbursementCriteria: addedSupplier.data.disbursementCriteria.name,
          paymentCycle: addedSupplier.data.paymentCycle ? addedSupplier.data.paymentCycle.name : "N/A",
          disbursementPhoneNumber: addedSupplier.data.disbursementPhoneNumber,
        };
        setSuppliers([...suppliers, mappedSupplier]);
        setNewSupplier({
          firstName: "",
          lastName: "",
          phoneNumber: "",
          productionQuantity: "",
          numberCattle: "",
          pendingBills: "",
          unpaidBills: "",
          residence: "",
          paymentMethod: "",
          transportMode: "",
        });
        setError(null);
      } else {
        setError("Failed to add supplier: Unexpected server response.");
      }
    } catch (error) {
      setError(`Error adding supplier: ${error.response?.data?.message || error.message}`);
      console.error("Error adding supplier:", error.response?.data || error);
    }
  };

  const handleViewClick = async (supplier) => {
    const detailedSupplier = await fetchSupplierDetails(supplier.id);
    setViewSupplier(detailedSupplier);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = suppliers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(suppliers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="page-wrapper">
      <div className="row">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="d-flex align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="ms-auto">
            <button
              type="button"
              className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add Supplier
            </button>
          </div>
        </div>

        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">
            <div className="table-responsive" style={{ overflow: "visible" }}>
              <table className="table table-borderless text-start small-text" style={{ width: "100%", fontSize: "14px" }}>
                <thead className="table-light text-start small-text">
                  <tr>
                    <th className="text-start">#</th>
                    <th className="text-start">Name</th>
                    <th className="text-start">Phone Number</th>
                    <th className="text-start">Production (L)</th>
                    <th className="text-start">Cattle</th>
                    <th className="text-start">Pending Bills</th>
                    <th className="text-start">Unpaid Bills</th>
                    <th className="text-start">Residence</th>
                    <th className="text-start">Payment Method</th>
                    <th className="text-start">Date Created</th>
                    <th className="text-start">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((supplier, index) => (
                    <tr key={supplier.id}>
                      <th scope="row" className="text-start small-text">{indexOfFirstItem + index + 1}</th>
                      <td className="text-start small-text">{`${supplier.firstName} ${supplier.lastName}`}</td>
                      <td className="text-start small-text">{supplier.phoneNumber}</td>
                      <td className="text-start small-text">{supplier.productionQuantity}</td>
                      <td className="text-start small-text">{supplier.numberCattle}</td>
                      <td className="text-start small-text">{supplier.pendingBills}</td>
                      <td className="text-start small-text">{supplier.unpaidBills}</td>
                      <td className="text-start small-text">{supplier.residence}</td>
                      <td className="text-start small-text">{supplier.paymentMethod}</td>
                      <td className="text-start small-text">{supplier.dateCreated}</td>
                      <td className="text-start small-text">
                        <div className="dropdown">
                          <button className="btn btn-light dropdown-toggle btn-sm" type="button" data-bs-toggle="dropdown">
                            Actions
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleViewClick(supplier)}
                                data-bs-toggle="modal"
                                data-bs-target="#viewModal"
                              >
                                View
                              </button>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item"
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#editModal"
                                onClick={() => handleEditClick(supplier)}
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(supplier)}
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

            <div className="d-flex justify-content-between align-items-start mt-3">
              <div className="text-muted">
                <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, suppliers.length)} of {suppliers.length} entries</span>
              </div>
              <nav aria-label="Page navigation">
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <Icon icon="ep:d-arrow-left" />
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                      <button
                        className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px"
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
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

        <div className="modal fade" id="exampleModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Add Supplier
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                <form onSubmit={handleAddSupplier}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          First Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter supplier's first name"
                          value={newSupplier.firstName}
                          onChange={(e) => setNewSupplier({ ...newSupplier, firstName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Phone Number <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter a valid phone number"
                          value={newSupplier.phoneNumber}
                          onChange={(e) => setNewSupplier({ ...newSupplier, phoneNumber: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Production Quantity (Liters) <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter production in liters"
                          value={newSupplier.productionQuantity}
                          onChange={(e) => setNewSupplier({ ...newSupplier, productionQuantity: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Pending Bills</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter pending bills amount"
                          value={newSupplier.pendingBills}
                          onChange={(e) => setNewSupplier({ ...newSupplier, pendingBills: e.target.value })}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Transport Mode <span className="text-danger">*</span>
                        </label>
                        <div
                          className="form-control d-flex justify-content-between align-items-center"
                          style={{ cursor: "pointer" }}
                          onClick={() => setShowTransportDropdown(!showTransportDropdown)}
                        >
                          <span>{newSupplier.transportMode || "Select Transport"}</span>
                          <i className="dropdown-toggle ms-2"></i>
                        </div>
                        {showTransportDropdown && (
                          <ul className="dropdown-menu show" style={{ position: "absolute", zIndex: 1000, minWidth: "auto" }}>
                            {Object.keys(TRANSPORT_MODES).map((mode) => (
                              <li key={mode}>
                                <button
                                  type="button"
                                  className="dropdown-item"
                                  onClick={() => {
                                    setNewSupplier({ ...newSupplier, transportMode: mode });
                                    setShowTransportDropdown(false);
                                  }}
                                >
                                  {mode}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Last Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter supplier's last name"
                          value={newSupplier.lastName}
                          onChange={(e) => setNewSupplier({ ...newSupplier, lastName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Number of Cattle <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter total number of cattle"
                          value={newSupplier.numberCattle}
                          onChange={(e) => setNewSupplier({ ...newSupplier, numberCattle: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Unpaid Bills</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter unpaid bills amount"
                          value={newSupplier.unpaidBills}
                          onChange={(e) => setNewSupplier({ ...newSupplier, unpaidBills: e.target.value })}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Payment Method <span className="text-danger">*</span>
                        </label>
                        <div
                          className="form-control d-flex justify-content-between align-items-center"
                          style={{ cursor: "pointer" }}
                          onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
                        >
                          <span>{newSupplier.paymentMethod || "Select Payment"}</span>
                          <i className="dropdown-toggle ms-2"></i>
                        </div>
                        {showPaymentDropdown && (
                          <ul className="dropdown-menu show" style={{ position: "absolute", zIndex: 1000, minWidth: "auto" }}>
                            {Object.keys(PAYMENT_METHODS).map((method) => (
                              <li key={method}>
                                <button
                                  type="button"
                                  className="dropdown-item"
                                  onClick={() => {
                                    setNewSupplier({ ...newSupplier, paymentMethod: method });
                                    setShowPaymentDropdown(false);
                                  }}
                                >
                                  {method}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Residence <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter supplier's residence"
                          value={newSupplier.residence}
                          onChange={(e) => setNewSupplier({ ...newSupplier, residence: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-muted small mt-3">
                    Fields marked with <span className="text-danger">*</span> are required.
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="editModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Edit Supplier
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                <form onSubmit={handleEditSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          First Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter supplier's first name"
                          value={editSupplier.firstName}
                          onChange={(e) => setEditSupplier({ ...editSupplier, firstName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Phone Number <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter a valid phone number"
                          value={editSupplier.phoneNumber}
                          onChange={(e) => setEditSupplier({ ...editSupplier, phoneNumber: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Production Quantity (Liters) <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter production in liters"
                          value={editSupplier.productionQuantity}
                          onChange={(e) => setEditSupplier({ ...editSupplier, productionQuantity: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Pending Bills</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter pending bills amount"
                          value={editSupplier.pendingBills}
                          onChange={(e) => setEditSupplier({ ...editSupplier, pendingBills: e.target.value })}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Transport Mode <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter transport mode"
                          value={editSupplier.transportMode}
                          onChange={(e) => setEditSupplier({ ...editSupplier, transportMode: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Last Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter supplier's last name"
                          value={editSupplier.lastName}
                          onChange={(e) => setEditSupplier({ ...editSupplier, lastName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Number of Cattle <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter total number of cattle"
                          value={editSupplier.numberCattle}
                          onChange={(e) => setEditSupplier({ ...editSupplier, numberCattle: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Unpaid Bills</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter unpaid bills amount"
                          value={editSupplier.unpaidBills}
                          onChange={(e) => setEditSupplier({ ...editSupplier, unpaidBills: e.target.value })}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Payment Method <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter payment method"
                          value={editSupplier.paymentMethod}
                          onChange={(e) => setEditSupplier({ ...editSupplier, paymentMethod: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Residence <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter supplier's residence"
                          value={editSupplier.residence}
                          onChange={(e) => setEditSupplier({ ...editSupplier, residence: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-muted small mt-3">
                    Fields marked with <span className="text-danger">*</span> are required.
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="viewModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Supplier Details
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                {viewSupplier && (
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <p>{`${viewSupplier.firstName} ${viewSupplier.lastName}`}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <p>{viewSupplier.phoneNumber}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Production Quantity (Liters)</label>
                        <p>{viewSupplier.productionQuantity}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Number of Cattle</label>
                        <p>{viewSupplier.numberCattle}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Pending Bills</label>
                        <p>{viewSupplier.pendingBills}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Expansion Capacity</label>
                        <p>{viewSupplier.expansionCapacity}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Unpaid Bills</label>
                        <p>{viewSupplier.unpaidBills}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Residence</label>
                        <p>{viewSupplier.residence}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Payment Method</label>
                        <p>{viewSupplier.paymentMethod}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Transport Mode</label>
                        <p>{viewSupplier.transportMode}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Date Created</label>
                        <p>{viewSupplier.dateCreated}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Contact Person Name</label>
                        <p>{viewSupplier.contactPersonName}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Disbursement Criteria</label>
                        <p>{viewSupplier.disbursementCriteria}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Payment Cycle</label>
                        <p>{viewSupplier.paymentCycle}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Disbursement Phone Number</label>
                        <p>{viewSupplier.disbursementPhoneNumber}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="deleteModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body pt-3 ps-18 pe-18">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="modal-title fs-6">Delete Supplier</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <p className="pb-3 mb-0">
                  Are you sure you want to delete{" "}
                  <strong>{`${supplierToDelete?.firstName} ${supplierToDelete?.lastName}`}</strong> supplier permanently?
                  This action cannot be undone.
                </p>
              </div>
              <div className="d-flex justify-content-end gap-2 px-12 pb-3">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDeleteConfirm}>
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

export default SuppliersLayer;