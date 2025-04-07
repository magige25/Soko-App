import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import { formatDate } from "../../hook/format-utils";

const STOCK_REQUEST_API_URL = "https://api.bizchain.co.ke/v1/stock-requests";
const UPDATE_QUANTITY_API_URL = "https://api.bizchain.co.ke/v1/stock-requests/product";

const EditStockRequest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [stockRequest, setStockRequest] = useState(null);
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);

  const requestId = location.state?.requestId;

  useEffect(() => {
    if (!requestId) {
      setError("No stock request ID provided.");
      setIsLoading(false);
      toast.error("No stock request ID provided. Please select a stock request.");
      navigate("/stock-request");
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
          setProductList(response.data.data.productModelList || []);
        } else {
          throw new Error("Stock request not found.");
        }
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
        setError(`Error: ${err.message || "Failed to load data."}`);
        toast.error(`Error: ${err.message || "Failed to load data."}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockRequestData();
  }, [requestId, navigate]);

  const handleEditClick = (product) => {
    setEditProduct({ ...product, quantityRequested: product.quantityRequested || 0 });
  };

  const handleQuantityUpdate = async () => {
    if (!editProduct || !editProduct.quantityRequested) {
      toast.error("Please specify a valid quantity.");
      return;
    }
  
    const token = sessionStorage.getItem("token");
    try {
      const payload = {
        depotStockRequestId: requestId,
        depotStockRequestProductPayloadList: [
          {
            productId: editProduct.product.id,
            quantity: parseInt(editProduct.quantityRequested),
          },
        ],
      };
  
      const response = await axios.put(
        `${UPDATE_QUANTITY_API_URL}/${editProduct.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Use the response if needed (example)
      if (response.data.status?.code === 0) {
        setProductList(
          productList.map((p) =>
            p.id === editProduct.id ? { ...p, quantityRequested: editProduct.quantityRequested } : p
          )
        );
        setEditProduct(null);
        toast.success("Quantity updated successfully!");
      } else {
        throw new Error(response.data.status?.message || "Update failed on server");
      }
    } catch (err) {
      console.error("Update error details:", err.response?.data);
      const errorMessage = err.response?.data?.message || "Failed to update quantity.";
      const validationErrors = err.response?.data?.errors
        ? err.response.data.errors.map((e) => `${e.field || "Unknown field"}: ${e.message}`).join(", ")
        : "";
      toast.error(`Error: ${errorMessage}${validationErrors ? " - " + validationErrors : ""}`);
    }
  }; 

  const handleDeleteClick = (productId) => {
    setDeleteProductId(productId);
  };

  const handleDeleteConfirm = async () => {
    const token = sessionStorage.getItem("token");
    try {
      await axios.delete(`${UPDATE_QUANTITY_API_URL}/${deleteProductId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductList(productList.filter((p) => p.id !== deleteProductId));
      setDeleteProductId(null);
      toast.success("Product removed successfully!");
    } catch (err) {
      toast.error(`Error: ${err.response?.data?.message || "Failed to remove product."}`);
    }
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
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
        <h6 className="mb-0 fs-5">Edit Stock Request: {stockRequest?.orderCode || "N/A"}</h6>
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-primary radius-8 d-flex align-items-center gap-1"
            onClick={() => navigate("/stock-request/edit/add-product", { state: { depotStockRequestId: requestId } })}
          >
            <Icon icon="mdi:plus" className="text-xl" /> Add Product
          </button>
        </div>
      </div>
      <div className="card-body p-24">
        <div className="mb-5">
          {/* <h6 className="fw-semibold fs-5 text-primary-light mb-4 mt-3">Products</h6> */}
          {productList.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-borderless sm-table mb-0">
                <thead>
                  <tr>
                    <th className="text-start py-3 px-4">Product Name</th>
                    <th className="text-start py-3 px-4">SKU Code</th>
                    <th className="text-start py-3 px-4">Quantity Requested</th>
                    <th className="text-start py-3 px-4">Date Created</th>
                    <th className="text-start py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((product) => (
                    <tr key={product.id}>
                      <td className="text-start small-text py-3 px-4">{product.product?.name || "N/A"}</td>
                      <td className="text-start small-text py-3 px-4">{product.skuCode || "N/A"}</td>
                      <td className="text-start small-text py-3 px-4">{product.quantityRequested || 0}</td>
                      <td className="text-start small-text py-3 px-4">{formatDate(product.dateCreated)}</td>
                      <td className="text-start small-text py-3 px-4">
                        <div className="action-dropdown">
                          <div className="dropdown">
                            <button
                              className="btn btn-outline-secondary btn-sm dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                            >
                              Actions
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <button
                                  className="dropdown-item text-warning"
                                  data-bs-toggle="modal"
                                  data-bs-target="#editModal"
                                  onClick={() => handleEditClick(product)}
                                >
                                  Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  data-bs-toggle="modal"
                                  data-bs-target="#deleteModal"
                                  onClick={() => handleDeleteClick(product.id)}
                                >
                                  Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No products requested found.</p>
          )}
        </div>
      </div>

      {/* Edit Quantity Modal */}
      <div className="modal fade" id="editModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body pt-3 ps-18 pe-18">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="modal-title fs-6">Edit Quantity</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              {editProduct && (
                <div className="mb-3">
                  <label htmlFor="quantityRequested" className="form-label">
                    Quantity Requested for {editProduct.product?.name || "Product"}
                  </label>
                  <input
                    type="number"
                    id="quantityRequested"
                    className="form-control"
                    value={editProduct.quantityRequested}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, quantityRequested: parseInt(e.target.value) || 0 })
                    }
                    min="1"
                  />
                </div>
              )}
            </div>
            <div className="d-flex justify-content-end gap-2 px-12 pb-3">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleQuantityUpdate}
              >
                Update
              </button>
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
                <h6 className="modal-title fs-6">Delete Product</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <p className="pb-3 mb-0">
                Are you sure you want to remove this product from the stock request? This action cannot be undone.
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
  );
};

export default EditStockRequest;