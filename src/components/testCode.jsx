import React, { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://api.bizchain.co.ke/v1/supplier-deliveries";

const DeliveriesLayer = () => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [editDelivery, setEditDelivery] = useState({
    id: "",
    supplier: { name: "" },
    litres: "",
    pricePerLitre: "",    
  });
  const [newDelivery, setNewDelivery] = useState({
    supplier:  "",
    litres: "",
    pricePerLitre: "",    
  });
  const [searchItem, setSearchItem] = useState("");
  const [deliveryToDelete, setDeliveryToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const addModalRef = useRef(null);
  const editModalRef = useRef(null);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response Data:", response.data.data);
      setDeliveries(response.data.data);
    } catch (error) {
      console.error("Error fetching Deliveries:", error);
    }
  };

  const handleEditClick = (delivery) => {
    navigate("/deliveries/edit-delivery", {state: {delivery}});
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = {
        supplier: { name: editDelivery.supplier.name },
        litres: parseFloat(editDelivery.litres),
        pricePerLitre: parseFloat(editDelivery.pricePerLitre),        
      };
      const response = await axios.put(`${API_URL}/${editDelivery.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const updatedDeliveries = deliveries.map((d) =>
          d.id === editDelivery.id ? { ...d, ...editDelivery } : d
        );
        setDeliveries(updatedDeliveries);
        alert("Delivery updated successfully!");
      }
    } catch (error) {
      console.error("Error updating Delivery:", error);
      alert("Failed to update Delivery");
    }
  };

  const handleDeleteClick = (delivery) => {
    setDeliveryToDelete(delivery);
  };

  const handleDeleteConfirm = async () => {
    if (!deliveryToDelete) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_URL}/${deliveryToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const updatedDeliveries = deliveries.filter((d) => d.id !== deliveryToDelete.id);
        setDeliveries(updatedDeliveries);
        setDeliveryToDelete(null);
        alert("Delivery deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting Delivery:", error);
      alert("Failed to delete Delivery");
    }
  };

  const handleAddDelivery = async (e) => {
    e.preventDefault();
    if (!newDelivery.supplier.name || !newDelivery.litres || !newDelivery.pricePerLitre) {
      alert("Please fill in all required fields before saving.");
      return;
    }

    //const totalAmount = parseFloat(newDelivery.litres) * parseFloat(newDelivery.pricePerLitre);
    const newDeliveryData = {
      supplier: { name: newDelivery.supplier.name },
      litres: parseFloat(newDelivery.litres),
      pricePerLitre: parseFloat(newDelivery.pricePerLitre),      
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(API_URL, newDeliveryData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 201) {
        setDeliveries([...deliveries, response.data.data]);
        setNewDelivery({
          supplier: { name: "" },
          litres: "",
          pricePerLitre: "",        
        });
        alert("Delivery added successfully!");
      }
    } catch (error) {
      console.error("Error adding Delivery:", error);
      alert("Failed to add Delivery");
    }
  };

  const filteredDeliveries = deliveries.filter((delivery) => {
    const searchLower = searchItem.toLowerCase();
    return (
      delivery.supplier.name.toLowerCase().includes(searchLower) ||
      delivery.status.name.toLowerCase().includes(searchLower) ||
      delivery.createdBy.name.toLowerCase().includes(searchLower)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDeliveries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const resetAddForm = () => {
    setNewDelivery({
      supplier: { name: "" },
      litres: "",
      pricePerLitre: "",      
    });
  };

  const resetEditForm = () => {
    setEditDelivery({
      id: "",
      supplier: { name: "" },
      litres: "",
      pricePerLitre: "",      
    });
  };

  useEffect(() => {
    const handleClickOutsideAdd = (event) => {
      if (addModalRef.current && !addModalRef.current.contains(event.target)) {
        resetAddForm();
      }
    };

    const addModalElement = document.getElementById("addModal");
    if (addModalElement && addModalElement.classList.contains("show")) {
      document.addEventListener("mousedown", handleClickOutsideAdd);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideAdd);
    };
  }, [newDelivery]);

  useEffect(() => {
    const handleClickOutsideEdit = (event) => {
      if (editModalRef.current && !editModalRef.current.contains(event.target)) {
        resetEditForm();
      }
    };

    const editModalElement = document.getElementById("editModal");
    if (editModalElement && editModalElement.classList.contains("show")) {
      document.addEventListener("mousedown", handleClickOutsideEdit);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideEdit);
    };
  }, [editDelivery]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(amount);

  const handleAddDeliveryClick = () => {
    navigate("/deliveries/add-delivery");
  };
  

  return (
    <div className="page-wrapper">
      <div className="row">
        <div className="d-flex align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="ms-auto">
            <button
              type="button"
              className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
              onClick={handleAddDeliveryClick}              
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add Delivery
            </button>
          </div>
        </div>

        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">
            <div>
              <form
                className="navbar-search"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "20px",
                  width: "300px",
                }}
              >
                <input
                  type="text"
                  name="search"
                  placeholder="Search by supplier, status, or creator"
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                  className="form-control"
                />
                <Icon icon="ion:search-outline" className="icon" style={{ width: "16px", height: "16px" }} />
              </form>
            </div>
            <div className="table-responsive" style={{ overflow: "visible" }}>
              <table className="table table-borderless table-hover text-start small-text" style={{ width: "100%" }}>
                <thead className="table-light text-start small-text" style={{fontSize:"15px"}}>
                  <tr>
                    <th className="text-start" style={{width: "50px"}}>#</th>
                    <th className="text-start">Name of Supplier</th>
                    <th className="text-start">Volume (L)</th>
                    <th className="text-start">Price/Litre</th>
                    <th className="text-start">Total Amount</th>
                    <th className="text-start">Status</th>
                    <th className="text-start">Created By</th>
                    <th className="text-start">Date Created</th>
                    <th className="text-start">Actions</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: "14px" }}>
                  {currentItems.length > 0 ? (
                    currentItems.map((delivery, index) => (
                      <tr key={delivery.id}>
                        <th scope="row" className="text-start small-text">
                          {indexOfFirstItem + index + 1}
                        </th>
                        <td className="text-start small-text">{delivery.supplier.name}</td>
                        <td className="text-start small-text">{delivery.litres}</td>
                        <td className="text-start small-text">{formatCurrency(delivery.pricePerLitre.toFixed(2))}</td>
                        <td className="text-start small-text">{formatCurrency(delivery.totalAmount.toFixed(2))}</td>
                        <td className="text-start small-text">{delivery.status.name}</td>
                        <td className="text-start small-text">{delivery.createdBy.name}</td>
                        <td className="text-start small-text">{formatDate(delivery.dateCreated)}</td>
                        <td className="text-start small-text py-3 px-4">
                          <div className="dropdown">
                            <button className="btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="dropdown" style={{padding:"4px 8px"}}>
                              Actions
                            </button>
                            <ul className="dropdown-menu"> 
                              <li>
                                {/* btn-light dropdown-toggle */}
                                <button
                                  className="dropdown-item"
                                  onClick={() => handleEditClick(delivery)}
                                >
                                  Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => handleDeleteClick(delivery)}
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        No deliveries found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-start mt-3">
              <div className="text-muted">
                <span>
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredDeliveries.length)} of {filteredDeliveries.length} entries
                </span>
              </div>
              {totalPages > 1 && (
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
              )}
            </div>
          </div>
        </div>           

        {/* Edit Delivery Modal - Larger */}
        <div className="modal fade" id="editModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content" ref={editModalRef}>
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Edit Delivery
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                <form onSubmit={handleEditSubmit}>
                <div className ="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Supplier Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editDelivery.supplier.name}
                      onChange={(e) => setEditDelivery({ ...editDelivery, supplier: { ...editDelivery.supplier, name: e.target.value } })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Volume (L)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editDelivery.litres}
                      onChange={(e) => setEditDelivery({ ...editDelivery, litres: e.target.value })}
                    />
                  </div>
                  </div>
                  <div className ="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Price/Litre</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={editDelivery.pricePerLitre}
                      onChange={(e) => setEditDelivery({ ...editDelivery, pricePerLitre: e.target.value })}
                    />
                  </div>                  
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

        {/* Delete Confirmation Modal */}
        <div className="modal fade" id="deleteModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body pt-3 ps-18 pe-18">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="modal-title fs-6">Delete Delivery</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <p className="pb-3 mb-0">
                  Are you sure you want to delete the delivery from <strong>{deliveryToDelete?.supplier.name}</strong> permanently? This action cannot be undone.
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

export default DeliveriesLayer;