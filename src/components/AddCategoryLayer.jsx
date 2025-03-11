import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://api.bizchain.co.ke/v1/categories";

const AddCategoryLayer = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([{ name: "" }]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = (index, value) => {
    const fieldErrors = {};
    if (!value.trim()) {
      fieldErrors[`category${index}`] = "Category Name is required";
    }
    return fieldErrors;
  };

  const handleAddCategoryField = () => {
    setCategories([...categories, { name: "" }]);
  };

  const handleRemoveCategoryField = (index) => {
    if (categories.length === 1) return;
    const updatedCategories = [...categories];
    updatedCategories.splice(index, 1);
    setCategories(updatedCategories);

    // Remove error for the removed field
    setErrors((prev) => {
      const { [`category${index}`]: _, ...remainingErrors } = prev;
      return remainingErrors;
    });
  };

  const handleCategoryChange = (index, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index].name = value;
    setCategories(updatedCategories);

    // Validate the field on change
    const fieldErrors = validateField(index, value);
    setErrors((prev) => {
      if (Object.keys(fieldErrors).length === 0) {
        const { [`category${index}`]: _, ...remainingErrors } = prev;
        return remainingErrors;
      }
      return {
        ...prev,
        ...fieldErrors,
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    categories.forEach((category, index) => {
      if (!category.name.trim()) {
        newErrors[`category${index}`] = "Category Name is required";
      }
    });
    return newErrors;
  };

  const handleSaveCategories = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error("Please fix all errors before submitting");
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token || token.trim() === "") {
      toast.error("No authentication token found. Please log in.");
      setIsLoading(false);
      return;
    }

    try {
      const validCategories = categories.filter((category) => category.name.trim() !== "");
      if (validCategories.length === 0) {
        toast.error("At least one category name is required.");
        setIsLoading(false);
        return;
      }

      const payload = {
        categoryRequestList: validCategories,
      };

      const response = await axios.post(API_URL, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status.code === 0) {
        toast.success("Categories saved successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setCategories([{ name: "" }]);
        navigate('/category');
      } else {
        toast.error(`Failed to save categories: ${response.data.status.message}`);
      }
    } catch (error) {
      console.error("Error saving categories:", error.response?.data || error.message);
      toast.error(`Error saving categories: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="card-body">
        <form onSubmit={handleSaveCategories}>
          {categories.map((category, index) => (
            <div key={index} className="row gx-3 mb-3">
              <div className="col-3">
                <div className="d-flex align-items-center gap-2">
                  <label className="form-label fw-semibold text-primary-light text-sm mb-0">
                    Category Name <span className="text-danger">*</span>
                  </label>
                  {index > 0 && (
                    <button 
                    type="button"
                    className="btn-close btn-sm"
                    onClick={() => handleRemoveCategoryField(index)}
                  ></button>                  
                  )}
                </div>
                <input
                  type="text"
                  className="form-control radius-8 category-input" 
                  placeholder="Enter Category Name"
                  value={category.name}
                  onChange={(e) => handleCategoryChange(index, e.target.value)}
                />
                {errors[`category${index}`] && (
                  <div className="invalid-feedback d-block">{errors[`category${index}`]}</div>
                )}
              </div>
            </div>
          ))}

          <div className="text-muted small mt-4 mb-3">
            Fields marked with <span className="text-danger">*</span> are required.
          </div>

          <div className="mt-4 d-flex justify-content-between gap-2">
            <button
              type="button"
              className="btn btn-primary px-12 d-flex align-items-center gap-2"
              onClick={handleAddCategoryField}
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add Another Category
            </button>
            <button
              type="submit"
              className="btn btn-primary px-12"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryLayer;