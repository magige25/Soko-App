import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Spinner } from "../hook/spinner-utils";
import { formatCurrency } from "../hook/format-utils";

const API_URL = "https://api.bizchain.co.ke/v1/products";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

const ProductsLayer = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const debouncedQuery = useDebounce(query, 300);

  const fetchProducts = useCallback(
    async (page = 1, searchQuery = "") => {
      setIsLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: page - 1,
            size: itemsPerPage,
            searchValue: searchQuery,
          },
        });

        const data = Array.isArray(response.data.data) ? response.data.data : [];
        const total = response.data.totalElements || data.length;
        setProducts(data);
        setTotalItems(total);
      } catch (error) {
        console.error("Error fetching products:", error);
        const message = error.message || "Failed to fetch products. Please try again.";
        setError(message);
        toast.error(message);
        setProducts([]);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage]
  );

  useEffect(() => {
    fetchProducts(currentPage, debouncedQuery);
  }, [currentPage, debouncedQuery, fetchProducts]);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      await axios.delete(`${API_URL}/${productToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductToDelete(null);
      fetchProducts(currentPage, debouncedQuery);
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      const message = error.response?.data?.message || "Failed to delete product.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleAddProductClick = () => {
    navigate("/products/add-product");
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          success: { style: { background: "#d4edda", color: "#155724" } },
          error: { style: { background: "#f8d7da", color: "#721c24" } },
        }}
      />
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <form className="navbar-search">
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              name="search"
              placeholder="Search by product name"
              value={query}
              onChange={handleSearchInputChange}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
        </div>
        <button
          type="button"
          className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
          onClick={handleAddProductClick}
        >
          <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
          Add Product
        </button>
      </div>

      <div className="card-body p-24">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="table-responsive scroll-sm">
          <table className="table table-borderless sm-table mb-0">
            <thead>
              <tr>
                <th scope="col" className="text-center py-3 px-6">#</th>
                <th scope="col" className="text-start py-3 px-4">Image</th>
                <th scope="col" className="text-start py-3 px-4">Name</th>
                <th scope="col" className="text-start py-3 px-4">SKU</th>                
                <th scope="col" className="text-start py-3 px-4">Category</th>
                <th scope="col" className="text-start py-3 px-4">Sub-Category</th>
                <th scope="col" className="text-start py-3 px-4">Brand</th>
                <th scope="col" className="text-start py-3 px-4">Wholesale Price</th>
                <th scope="col" className="text-start py-3 px-4">Distributor Price</th>
                <th scope="col" className="text-start py-3 px-4">Retail Price</th>
                <th scope="col" className="text-start py-3 px-4">Customer Price</th>
                <th scope="col" className="text-start py-3 px-4">Supermarket Price</th>
                <th scope="col" className="text-start py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="14" className="text-center py-3">
                    <Spinner />
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={product.id}>
                    <td className="text-center small-text py-3 px-6">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="text-start small-text py-3 px-4 d-flex align-items-center">
                      <img
                        src={product.photo || "https://cdn.mafrservices.com/sys-master-root/h1f/h18/27062188474398/43281_main.jpg?im=Resize=480"}
                        alt={`${product.name}`}
                        className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden"
                      />
                    </td>                    
                    <td className="text-start small-text py-3 px-4">{product.name}</td>                    
                    <td className="text-start small-text py-3 px-4">{product.sku}</td>                    
                    <td className="text-start small-text py-3 px-4">{product.category.name}</td>
                    <td className="text-start small-text py-3 px-4">{product.subCategory.name}</td>
                    <td className="text-start small-text py-3 px-4">{product.brand.name}</td>
                    <td className="text-start small-text py-3 px-4">{formatCurrency(product.wholesalePrice || 0)}</td>
                    <td className="text-start small-text py-3 px-4">{formatCurrency(product.distributorPrice || 0)}</td>
                    <td className="text-start small-text py-3 px-4">{formatCurrency(product.retailPrice || 0)}</td>
                    <td className="text-start small-text py-3 px-4">{formatCurrency(product.customerPrice || 0)}</td>
                    <td className="text-start small-text py-3 px-4">{formatCurrency(product.supermarketPrice || 0)}</td>
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
                                className="dropdown-item"
                                onClick={() => navigate("/products/product-details", 
                                { state: { productId: product.id } })}
                              >
                                View
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => navigate("/products/edit-product", 
                                { state: { product } })}
                              >
                                Edit
                              </button>
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
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="14" className="text-center py-3">
                    No products found
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
                  >
                    <Icon icon="ri-arrow-drop-right-line" style={{ fontSize: "12px" }} />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      <div className="modal fade" id="deleteModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body pt-3 ps-18 pe-18">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="modal-title fs-6">Delete Product</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <p className="pb-3 mb-0">
                Are you sure you want to delete the product{" "}
                <strong>{productToDelete?.name}</strong> permanently? This action cannot be undone.
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
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsLayer;