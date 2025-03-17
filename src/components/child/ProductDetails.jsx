import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://api.bizchain.co.ke/v1/products";

const ProductDetails = () => {
  const location = useLocation();
  const productId = location.state?.productId;
  const navigate = useNavigate();
  const [productToView, setProductToView] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) {
      navigate("/products");
      return;
    }

    const fetchProductData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }
        const response = await axios.get(`${API_URL}/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const productData = response.data.data || response.data;
        setProductToView(productData);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Failed to fetch product details. Please try again.");
      }
    };

    fetchProductData();
  }, [productId, navigate]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(amount);

  return (
    <div className="page-wrapper">
      <div className="card shadow-sm mt-3" style={{ width: "100%" }}>
        <div className="card-body">
          <h6 className="mb-4">Product Details</h6>
          {error && <div className="alert alert-danger">{error}</div>}
          {productToView ? (
            <div>
              <div className="row">
                <div className="col-md-4">
                  <img
                    src={productToView.photo || "https://cdn.mafrservices.com/sys-master-root/h1f/h18/27062188474398/43281_main.jpg?im=Resize=480"}
                    alt={productToView.name || "Product"}
                    className="img-fluid rounded mb-3"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                </div>
                <div className="col-md-8">
                  <p className="mb-3">
                    <strong>Name:</strong> {productToView.name || "N/A"}
                  </p>
                  <p className="mb-3">
                    <strong>SKU:</strong> {productToView.sku || "N/A"}
                  </p>
                  <p className="mb-3">
                    <strong>Category:</strong> {productToView.category?.name || "N/A"}
                  </p>
                  <p className="mb-3">
                    <strong>Sub-Category:</strong> {productToView.subCategory?.name || "N/A"}
                  </p>
                  <p className="mb-3">
                    <strong>Brand:</strong> {productToView.brand?.name || "N/A"}
                  </p>
                  <p className="mb-3">
                    <strong>Discount Price:</strong> {formatCurrency(productToView.discountPrice || 0)}
                  </p>
                  <p className="mb-3">
                    <strong>Wholesale Price:</strong> {formatCurrency(productToView.wholesalePrice || 0)}
                  </p>
                  <p className="mb-3">
                    <strong>Distributor Price:</strong> {formatCurrency(productToView.distributorPrice || 0)}
                  </p>
                  <p className="mb-3">
                    <strong>Retail Price:</strong> {formatCurrency(productToView.retailPrice || 0)}
                  </p>
                  <p className="mb-3">
                    <strong>Description:</strong> {productToView.description || "No description available"}
                  </p>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <Link to="/products" className="btn btn-primary">
                  Back
                </Link>
              </div>
            </div>
          ) : (
            <p>Loading product details...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;