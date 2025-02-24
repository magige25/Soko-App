import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

const ProductsLayer = () => {
  const [products, setProducts] = useState([
    {
      sku: "SKU13254",
      pdName: "Milk",
      country: "USA", // Added dummy country property
      uom: "Kgs",
      pricePerPiece: "291",
      pricePerUoM: 454,
      buyingPrice: "21",
      sellingPrice: "75",
    },
  ]);
  const [newProduct, setNewProduct] = useState({
    sku: "",
    pdName: "",
    country: "", // Added field for country
    uom: "",
    pricePerPiece: "",
    pricePerUoM: "",
    buyingPrice: "",
    sellingPrice: "",
  });
  const [editProduct, setEditProduct] = useState({
    sku: "",
    pdName: "",
    country: "",
    uom: "",
    pricePerPiece: "",
    pricePerUoM: "",
    buyingPrice: "",
    sellingPrice: "",
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productsToDelete, setProductsToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Refs for modals
  const addModalRef = useRef(null);
  const editModalRef = useRef(null);

  // Handlers for Add Product
  const handleAddProduct = (e) => {
    e.preventDefault();
    // Basic validation: all fields required
    if (
      !newProduct.sku ||
      !newProduct.pdName ||
      !newProduct.country ||
      !newProduct.uom ||
      !newProduct.pricePerPiece ||
      !newProduct.pricePerUoM ||
      !newProduct.buyingPrice ||
      !newProduct.sellingPrice
    ) {
      alert("Please fill in all fields before saving.");
      return;
    }

    // Create new product and update list
    setProducts([...products, newProduct]);
    // Reset the form
    resetAddForm();
  };

  const resetAddForm = () => {
    setNewProduct({
      sku: "",
      pdName: "",
      country: "",
      uom: "",
      pricePerPiece: "",
      pricePerUoM: "",
      buyingPrice: "",
      sellingPrice: "",
    });
  };

  // Click outside handler for Add Product Modal
  useEffect(() => {
    const handleClickOutsideAdd = (event) => {
      if (addModalRef.current && !addModalRef.current.contains(event.target)) {
        resetAddForm();
      }
    };

    const addModalElement = document.getElementById("addProductModal");
    if (addModalElement && addModalElement.classList.contains("show")) {
      document.addEventListener("mousedown", handleClickOutsideAdd);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideAdd);
    };
  }, [newProduct]);

  // Handlers for Edit Product (existing functionality)
  const handleEditClick = (product) => {
    setEditProduct(product);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedProducts = products.map((p) =>
      p.pdName === editProduct.pdName ? { ...p, ...editProduct } : p
    );
    setProducts(updatedProducts);
  };

  // Handlers for Delete Product (existing functionality)
  const handleDeleteClick = (product) => {
    setProductsToDelete(product);
  };

  const handleDeleteConfirm = () => {
    const updatedProducts = products.filter(
      (p) => p.pdName !== productsToDelete.pdName
    );
    setProducts(updatedProducts);
    setProductsToDelete(null);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="page-wrapper">
      <div className="row">
        {/* Add New Product Button */}
        <div className="d-flex align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="ms-auto">
            <button
              type="button"
              className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
              data-bs-toggle="modal"
              data-bs-target="#addProductModal"
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add Product
            </button>
          </div>
        </div>

        {/* Products Table */}
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
                  width: "32px",
                }}
              >
                <input type="text" name="search" placeholder="Search" />
                <Icon icon="ion:search-outline" className="icon" style={{ width: "16px", height: "16px" }} />
              </form>
            </div>
            <div className="table-responsive" style={{ overflow: "visible" }}>
              <table className="table table-borderless text-start small-text" style={{ width: "100%" }}>
                <thead className="table-light text-start small-text">
                  <tr>
                    <th className="text-start">#</th>
                    <th className="text-start">Country</th> {/* New Country Column */}
                    <th className="text-start">SKU</th>
                    <th className="text-start">PD Name</th>
                    <th className="text-start">UoM</th>
                    <th className="text-start">PricePerPiece</th>
                    <th className="text-start">PricePerUoM</th>
                    <th className="text-start">B.Price</th>
                    <th className="text-start">S.Price</th>
                    <th className="text-start">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((product, index) => (
                    <tr key={index}>
                      <th scope="row" className="text-start small-text">
                        {indexOfFirstItem + index + 1}
                      </th>
                      <td className="text-start small-text">{product.country}</td> {/* Render Country */}
                      <td className="text-start small-text">{product.sku}</td>
                      <td className="text-start small-text">{product.pdName}</td>
                      <td className="text-start small-text">{product.uom}</td>
                      <td className="text-start small-text">{product.pricePerPiece}</td>
                      <td className="text-start small-text">{product.pricePerUoM}</td>
                      <td className="text-start small-text">{product.buyingPrice}</td>
                      <td className="text-start small-text">{product.sellingPrice}</td>
                      <td className="text-start small-text">
                        <div className="dropdown">
                          <button
                            className="btn btn-light dropdown-toggle btn-sm"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            Actions
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <Link
                                className="dropdown-item"
                                to={`/products/${product.pdName}`}
                                data-bs-toggle="modal"
                                data-bs-target="#viewModal"
                                state={{ product }}
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
                                onClick={() => handleEditClick(product)}
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(product)}
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
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, products.length)} of{" "}
                  {products.length} entries
                </span>
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

        {/* Add Product Modal */}
        <div className="modal fade" id="addProductModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content" ref={addModalRef}>
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Add Product
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                <form onSubmit={handleAddProduct}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        SKU <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter SKU"
                        value={newProduct.sku}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, sku: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        PD Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Product Name"
                        value={newProduct.pdName}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, pdName: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Country <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Country"
                        value={newProduct.country}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, country: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        UoM <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter UoM"
                        value={newProduct.uom}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, uom: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        PricePerPiece <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter PricePerPiece"
                        value={newProduct.pricePerPiece}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            pricePerPiece: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        PricePerUoM <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter PricePerUoM"
                        value={newProduct.pricePerUoM}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            pricePerUoM: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Buying Price <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Buying Price"
                        value={newProduct.buyingPrice}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            buyingPrice: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Selling Price <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Selling Price"
                        value={newProduct.sellingPrice}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            sellingPrice: e.target.value,
                          })
                        }
                        required
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
                    <div className="mb-3">
                      <strong>SKU:</strong> {selectedProduct.sku}
                    </div>
                    <div className="mb-3">
                      <strong>PD Name:</strong> {selectedProduct.pdName}
                    </div>
                    <div className="mb-3">
                      <strong>Country:</strong> {selectedProduct.country}
                    </div>
                    <div className="mb-3">
                      <strong>UoM:</strong> {selectedProduct.uom}
                    </div>
                    <div className="mb-3">
                      <strong>PricePerPiece:</strong> ${selectedProduct.pricePerPiece}
                    </div>
                    <div className="mb-3">
                      <strong>PricePerUoM:</strong> ${selectedProduct.pricePerUoM}
                    </div>
                    <div className="mb-3">
                      <strong>Buying Price:</strong> ${selectedProduct.buyingPrice}
                    </div>
                    <div className="mb-3">
                      <strong>Selling Price:</strong> ${selectedProduct.sellingPrice}
                    </div>
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
                <form onSubmit={handleEditSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        SKU <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter SKU"
                        value={editProduct.sku}
                        onChange={(e) =>
                          setEditProduct({ ...editProduct, sku: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        PD Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Product Name"
                        value={editProduct.pdName}
                        onChange={(e) =>
                          setEditProduct({ ...editProduct, pdName: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Country <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Country"
                        value={editProduct.country}
                        onChange={(e) =>
                          setEditProduct({ ...editProduct, country: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        UoM <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter UoM"
                        value={editProduct.uom}
                        onChange={(e) =>
                          setEditProduct({ ...editProduct, uom: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        PricePerPiece <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter PricePerPiece"
                        value={editProduct.pricePerPiece}
                        onChange={(e) =>
                          setEditProduct({
                            ...editProduct,
                            pricePerPiece: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        PricePerUoM <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter PricePerUoM"
                        value={editProduct.pricePerUoM}
                        onChange={(e) =>
                          setEditProduct({
                            ...editProduct,
                            pricePerUoM: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Buying Price <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Buying Price"
                        value={editProduct.buyingPrice}
                        onChange={(e) =>
                          setEditProduct({
                            ...editProduct,
                            buyingPrice: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Selling Price <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Selling Price"
                        value={editProduct.sellingPrice}
                        onChange={(e) =>
                          setEditProduct({
                            ...editProduct,
                            sellingPrice: parseInt(e.target.value) || 0,
                          })
                        }
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
        <div className="modal fade" id="deleteModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body pt-3 ps-18 pe-18">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="modal-title fs-6">Delete Product</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <p className="pb-3 mb-0">
                  Are you sure you want to delete the <strong>{productsToDelete?.pdName}</strong> Product permanently? This action cannot be undone.
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

export default ProductsLayer;
