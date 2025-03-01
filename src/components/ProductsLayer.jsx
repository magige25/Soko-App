import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

const ProductsLayer = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({sku: "",pdName: "",uom: "",pricePerPiece: "",pricePerUoM: "",buyingPrice: "",sellingPrice: ""});
  const [editProduct, setEditProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productsToDelete, setProductsToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addModalRef = useRef(null);
  const editModalRef = useRef(null);

  // Fetch products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://api.example.com/products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError("Failed to fetch products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.pdName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Handlers
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (Object.values(newProduct).some((val) => !val)) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://api.example.com/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      const addedProduct = await response.json();
      setProducts([...products, addedProduct]);
      resetAddForm();
      document.getElementById("addProductModal").classList.remove("show");
    } catch (err) {
      setError("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  const resetAddForm = () => {setNewProduct({sku: "",pdName: "",uom: "",pricePerPiece: "",pricePerUoM: "",buyingPrice: "",sellingPrice: "",})};

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`https://api.example.com/products/${editProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editProduct),
      });
      const updatedProduct = await response.json();
      setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
      setEditProduct(null);
      document.getElementById("editModal").classList.remove("show");
    } catch (err) {
      setError("Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await fetch(`https://api.example.com/products/${productsToDelete.id}`, {
        method: "DELETE",
      });
      setProducts(products.filter((p) => p.id !== productsToDelete.id));
      setProductsToDelete(null);
    } catch (err) {
      setError("Failed to delete product.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Input change handler for numeric fields
  const handleNumericInput = (e, setter, field) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setter((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="page-wrapper">
      <div className="row">
        <div className="d-flex align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="ms-auto">
            <button
              type="button"
              className="btn btn-primary btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
              data-bs-toggle="modal"
              data-bs-target="#addProductModal"
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add Product
            </button>
          </div>
        </div>

        <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
          <div className="card-body">
            <form className="navbar-search" style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <input
                type="text"
                placeholder="Search by product name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ width: "200px" }}
              />
              <Icon icon="ion:search-outline" className="icon" style={{ width: "16px", height: "16px" }} />
            </form>

            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && (
              <>
                <div className="table-responsive">
                  <table className="table table-borderless text-start small-text">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>SKU</th>
                        <th>PD Name</th>
                        <th>UoM</th>
                        <th>PricePerPiece</th>
                        <th>PricePerUoM</th>
                        <th>B.Price</th>
                        <th>S.Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((product, index) => (
                        <tr key={product.id || index}>
                          <th>{indexOfFirstItem + index + 1}</th>
                          <td>{product.sku}</td>
                          <td>{product.pdName}</td>
                          <td>{product.uom}</td>
                          <td>{product.pricePerPiece}</td>
                          <td>{product.pricePerUoM}</td>
                          <td>{product.buyingPrice}</td>
                          <td>{product.sellingPrice}</td>
                          <td>
                            <div className="dropdown">
                              <button className="btn btn-light dropdown-toggle btn-sm" data-bs-toggle="dropdown">
                                Actions
                              </button>
                              <ul className="dropdown-menu">
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#viewModal"
                                    onClick={() => setSelectedProduct(product)}
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
                                    onClick={() => setEditProduct(product)}
                                  >
                                    Edit
                                  </Link>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item text-danger"
                                    data-bs-toggle="modal"
                                    data-bs-target="#deleteModal"
                                    onClick={() => setProductsToDelete(product)}
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
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of{" "}
                    {filteredProducts.length} entries
                  </div>
                  <nav>
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
              </>
            )}
          </div>
        </div>

        {/* Add Product Modal */}
        <div className="modal fade" id="addProductModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content" ref={addModalRef}>
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Add Product
                  <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={resetAddForm}></button>
                </h6>
                <form onSubmit={handleAddProduct}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">SKU <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">PD Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        value={newProduct.pdName}
                        onChange={(e) => setNewProduct({ ...newProduct, pdName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">UoM <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        value={newProduct.uom}
                        onChange={(e) => setNewProduct({ ...newProduct, uom: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">PricePerPiece <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        value={newProduct.pricePerPiece}
                        onChange={(e) => handleNumericInput(e, setNewProduct, "pricePerPiece")}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">PricePerUoM <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        value={newProduct.pricePerUoM}
                        onChange={(e) => handleNumericInput(e, setNewProduct, "pricePerUoM")}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Buying Price <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        value={newProduct.buyingPrice}
                        onChange={(e) => handleNumericInput(e, setNewProduct, "buyingPrice")}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Selling Price <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        value={newProduct.sellingPrice}
                        onChange={(e) => handleNumericInput(e, setNewProduct, "sellingPrice")}
                        required
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* View Product Modal */}
        <div className="modal fade" id="viewModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Product Details
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                {selectedProduct && (
                  <>
                    <div className="mb-3"><strong>SKU:</strong> {selectedProduct.sku}</div>
                    <div className="mb-3"><strong>PD Name:</strong> {selectedProduct.pdName}</div>
                    <div className="mb-3"><strong>UoM:</strong> {selectedProduct.uom}</div>
                    <div className="mb-3"><strong>PricePerPiece:</strong> ${selectedProduct.pricePerPiece}</div>
                    <div className="mb-3"><strong>PricePerUoM:</strong> ${selectedProduct.pricePerUoM}</div>
                    <div className="mb-3"><strong>Buying Price:</strong> ${selectedProduct.buyingPrice}</div>
                    <div className="mb-3"><strong>Selling Price:</strong> ${selectedProduct.sellingPrice}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Product Modal */}
        <div className="modal fade" id="editModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content" ref={editModalRef}>
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Edit Product
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                {editProduct && (
                  <form onSubmit={handleEditSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">SKU <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          value={editProduct.sku}
                          onChange={(e) => setEditProduct({ ...editProduct, sku: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">PD Name <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          value={editProduct.pdName}
                          onChange={(e) => setEditProduct({ ...editProduct, pdName: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">UoM <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          value={editProduct.uom}
                          onChange={(e) => setEditProduct({ ...editProduct, uom: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">PricePerPiece <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          value={editProduct.pricePerPiece}
                          onChange={(e) => handleNumericInput(e, setEditProduct, "pricePerPiece")}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">PricePerUoM <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          value={editProduct.pricePerUoM}
                          onChange={(e) => handleNumericInput(e, setEditProduct, "pricePerUoM")}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Buying Price <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          value={editProduct.buyingPrice}
                          onChange={(e) => handleNumericInput(e, setEditProduct, "buyingPrice")}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Selling Price <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          value={editProduct.sellingPrice}
                          onChange={(e) => handleNumericInput(e, setEditProduct, "sellingPrice")}
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </form>
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
                  <h6 className="modal-title fs-6">Delete Product</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <p className="pb-3 mb-0">
                  Are you sure you want to delete <strong>{productsToDelete?.pdName}</strong>? This action cannot be undone.
                </p>
              </div>
              <div className="d-flex justify-content-end gap-2 px-12 pb-3">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm} disabled={loading}>
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsLayer;