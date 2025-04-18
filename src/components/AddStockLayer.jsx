import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DatePicker } from "antd"; 
import dayjs from "dayjs"; 

const API_URL = "https://api.bizchain.co.ke/v1/drawing/product-in-progress"; 
const SUBMIT_API_URL = "https://api.bizchain.co.ke/v1/stock";

const AddStockLayer = () => {
  const [drawCode, setDrawCode] = useState("");
  const [products, setProducts] = useState([]);
  const [milkDrawId, setMilkDrawId] = useState("");
  const [actualQuantities, setActualQuantities] = useState({});
  const [expiryDates, setExpiryDates] = useState({});
  const [productionDate, setProductionDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawCodeValid, setIsDrawCodeValid] = useState(false);
  const navigate = useNavigate();

  const formatDateToServer = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const isFutureDate = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(dateString);
    return inputDate > today;
  };

  const handleDrawCodeSearch = async (e) => {
    e.preventDefault();
    if (!drawCode.trim()) {
      toast.error("Please enter a draw code.");
      return;
    }

    setIsLoading(true);
    const token = sessionStorage.getItem("token");

    if (!token || token.trim() === "") {
      toast.error("No authentication token found. Please log in.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/${drawCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = response.data;
      console.log("API Response for draw code search:", result);

      if (result.status.code === 0) {
        if (result.data.productDrawRecords && result.data.productDrawRecords.length > 0) {
          const mappedProducts = result.data.productDrawRecords.map((item) => ({
            id: item.product.id,
            productName: item.product.name || "No Product",
            expectedQuantity: item.qty || 0,
          }));
          setMilkDrawId(result.data.milkDrawId);
          setProducts(mappedProducts);
          setIsDrawCodeValid(true);
          toast.success(`Products fetched successfully! Found ${result.data.productDrawRecords.length} product(s).`);
        } else {
          toast.warn("No products found for this draw code.");
          setProducts([]);
          setMilkDrawId("");
          setIsDrawCodeValid(false);
        }
      } else {
        toast.error(`Failed to fetch products: ${result.status.message}`);
        setProducts([]);
        setMilkDrawId("");
        setIsDrawCodeValid(false);
      }
    } catch (err) {
      console.error("Error fetching draw code data:", {
        url: `${API_URL}/${drawCode}`,
        error: err.response?.data || err.message,
        status: err.response?.status,
      });
      if (err.response) {
        if (err.response.status === 404) {
          toast.error("Draw code not found. Please check the draw code and try again.");
        } else if (err.response.status === 401) {
          toast.error("Unauthorized. Please log in again.");
        } else if (err.response.status === 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error("Error fetching draw code data: " + (err.response?.data?.message || err.message));
        }
      } else {
        toast.error("Network error. Please check your internet connection.");
      }
      setProducts([]);
      setMilkDrawId("");
      setIsDrawCodeValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActualQuantityChange = (productId, value) => {
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue) || parsedValue < 0) {
      toast.error("Actual quantity must be a positive number.");
      return;
    }
    setActualQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleExpiryDateChange = (productId, date, dateString) => {
    if (!isFutureDate(dateString)) {
      toast.error("Expiry date must be a future date.");
      return;
    }
    setExpiryDates((prev) => ({
      ...prev,
      [productId]: dateString,
    }));
  };

  const handleProductionDateChange = (date, dateString) => {
    if (dateString && new Date(dateString) > new Date()) {
      toast.error("Production date cannot be in the future.");
      return;
    }
    setProductionDate(dateString);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!milkDrawId) {
      toast.error("No milk draw ID available. Please fetch products first.");
      setIsLoading(false);
      return;
    }

    if (!productionDate) {
      toast.error("Please select a production date.");
      setIsLoading(false);
      return;
    }

    for (const product of products) {
      const actualQty = actualQuantities[product.id];
      const expiry = expiryDates[product.id];

      if (!actualQty || parseInt(actualQty, 10) <= 0) {
        toast.error(`Please enter a valid actual quantity for ${product.productName}.`);
        setIsLoading(false);
        return;
      }

      if (!expiry) {
        toast.error(`Please select an expiry date for ${product.productName}.`);
        setIsLoading(false);
        return;
      }

      if (!isFutureDate(expiry)) {
        toast.error(`Expiry date for ${product.productName} must be in the future.`);
        setIsLoading(false);
        return;
      }
    }

    const token = sessionStorage.getItem("token");
    if (!token || token.trim() === "") {
      toast.error("No authentication token found. Please log in.");
      setIsLoading(false);
      return;
    }

    const payload = {
      milkDrawRecordId: milkDrawId,
      productionDate: formatDateToServer(productionDate),
      productStockingRequests: products.map((product) => ({
        productId: product.id,
        quantity: parseInt(actualQuantities[product.id] || 0, 10),
        expiryDate: formatDateToServer(expiryDates[product.id]),
      })),
    };

    try {
      console.log("Submitting payload with multiple products:", payload);
      await axios.post(SUBMIT_API_URL, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Successfully added ${products.length} product(s) to stock!`, {
        autoClose: 1000,
        onClose: () => navigate("/stock"),
      });
    } catch (err) {
      console.error("Error submitting stock:", {
        url: SUBMIT_API_URL,
        payload,
        error: err.response?.data || err.message,
        status: err.response?.status,
      });
      if (err.response) {
        if (err.response.status === 401) {
          toast.error("Unauthorized. Please log in again.");
        } else if (err.response.status === 400) {
          toast.error("Invalid data submitted. Please check your inputs.");
        } else if (err.response.status === 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error("Error submitting stock: " + (err.response?.data?.message || err.message));
        }
      } else {
        toast.error("Network error. Please check your internet connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <ToastContainer />
      <div className="card w-100 p-0 radius-12" style={{ maxWidth: "800px", margin: "20px auto 0 auto" }}>
        {/* Conditionally render the header with the message */}
        {!isDrawCodeValid && (
          <div
            className="card-header border-bottom bg-base py-4 px-24"
            style={{ height: "150px", display: "flex", flexDirection: "column", justifyContent: "center" }}
          >
            <p className="text-warning-400 mt-8" style={{ fontSize: "16px" }}>
              Enter a valid draw code in the search bar below to fetch associated products. Once retrieved, 
              fill in the actual quantities, expiry dates, and production date, then <b>submit</b> to add to stock.
            </p>
          </div>
        )}
        <div className="card-body-table p-24">
          <form onSubmit={isDrawCodeValid ? handleSubmit : handleDrawCodeSearch}>
            {/* Draw Code Search - Always Visible */}
            <div className="d-flex justify-content-center mb-24">
              <div className="input-group" style={{ maxWidth: "400px" }}>
                <input
                  type="text"
                  className="form-control bg-base h-40-px radius-start-8 border-end-0"
                  placeholder="Enter Draw Code"
                  value={drawCode}
                  onChange={(e) => setDrawCode(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="btn btn-primary h-40-px radius-end-8 border-start-0"
                  onClick={handleDrawCodeSearch}
                  disabled={isLoading || !drawCode.trim()}
                >
                  <Icon icon="ion:search-outline" className="icon" />
                </button>
              </div>
            </div>

            {isDrawCodeValid && (
              <>
                {/* Products Table */}
                <div className="mb-24">
                  <table className="table table-borderless sm-table mb-0">
                    <thead>
                      <tr>
                        <th scope="col" className="text-start py-12 px-16">Product Name</th>
                        <th scope="col" className="text-start py-12 px-16">Expected Quantity</th>
                        <th scope="col" className="text-start py-12 px-16">Actual Quantity</th>
                        <th scope="col" className="text-start py-12 px-16">Expiry Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="text-start small-text py-12 px-16">{product.productName}</td>
                          <td className="text-start small-text py-12 px-16">{product.expectedQuantity}</td>
                          <td className="text-start small-text py-12 px-16">
                            <input
                              type="number"
                              className="form-control bg-base h-40-px radius-8"
                              value={actualQuantities[product.id] || ""}
                              onChange={(e) => handleActualQuantityChange(product.id, e.target.value)}
                              disabled={isLoading}
                              min="0"
                              required
                            />
                          </td>
                          <td className="text-start small-text py-12 px-16">
                            <DatePicker
                              value={expiryDates[product.id] ? dayjs(expiryDates[product.id]) : null}
                              format="YYYY-MM-DD"
                              onChange={(date, dateString) => handleExpiryDateChange(product.id, date, dateString)}
                              className="bg-base h-40-px radius-8"
                              disabled={isLoading}
                              style={{ width: "100%" }}
                              required
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Production Date */}
                <div className="col-3 mb-24">
                  <label className="form-label fw-semibold mb-8">Production Date</label>
                  <DatePicker
                    value={productionDate ? dayjs(productionDate) : null}
                    format="YYYY-MM-DD"
                    onChange={(date, dateString) => handleProductionDateChange(date, dateString)}
                    className="bg-base h-40-px radius-8"
                    disabled={isLoading}
                    style={{ width: "100%" }}
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-between">
                  <Link
                    to="/stock"
                    className="btn btn-outline-secondary text-sm btn-sm px-24 py-12 radius-8"
                  >
                    Back to Stock
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary text-sm btn-sm px-24 py-12 radius-8"
                    disabled={isLoading || !productionDate}
                  >
                    {isLoading ? (
                      <span className="spinner-border spinner-border-sm me-8" role="status" aria-hidden="true"></span>
                    ) : null}
                    Submit Stock
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStockLayer;