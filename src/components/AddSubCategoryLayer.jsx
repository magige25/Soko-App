import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SUBCATEGORY_API_URL = "https://api.bizchain.co.ke/v1/sub-categories";
const CATEGORY_API_URL = "https://api.bizchain.co.ke/v1/categories";

const AddSubCategoryLayer = () => {
  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState([{ categoryId: "", name: "" }]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchCategories = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No authentication token found. Please log in.");
      return;
    }
    try {
      const params = { page: 0, size: 100 };
      const response = await axios.get(CATEGORY_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      if (response.data.status.code === 0) {
        setCategories(response.data.data);
      } else {
        toast.error(`Failed to fetch categories: ${response.data.status.message}`);
      }
    } catch (error) {
      console.error("Error fetching categories:", error.response?.data || error.message);
      toast.error(`Error fetching categories: ${error.response?.data?.message || error.message}`);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const validateField = (index, field, value) => {
    const fieldErrors = {};
    if (!value.trim()) {
      fieldErrors[`${field}${index}`] = `${
        field === "name" ? "Subcategory Name" : "Category"
      } is required`;
    }
    return fieldErrors;
  };

  const handleAddSubCategoryField = () => {
    setSubCategories([...subCategories, { categoryId: "", name: "" }]);
  };

  const handleRemoveSubCategoryField = (index) => {
    if (subCategories.length === 1) return;
    const updatedSubCategories = [...subCategories];
    updatedSubCategories.splice(index, 1);
    setSubCategories(updatedSubCategories);

    setErrors((prev) => {
      const { [`name${index}`]: _, [`categoryId${index}`]: __, ...remainingErrors } = prev;
      return remainingErrors;
    });
  };

  const handleSubCategoryChange = (index, field, value) => {
    const updatedSubCategories = [...subCategories];
    updatedSubCategories[index][field] = value;
    setSubCategories(updatedSubCategories);

    const fieldErrors = validateField(index, field, value);
    setErrors((prev) => {
      if (Object.keys(fieldErrors).length === 0) {
        const { [`${field}${index}`]: _, ...remainingErrors } = prev;
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
    subCategories.forEach((subCategory, index) => {
      if (!subCategory.categoryId) {
        newErrors[`categoryId${index}`] = "Category is required";
      }
      if (!subCategory.name.trim()) {
        newErrors[`name${index}`] = "Subcategory Name is required";
      }
    });
    return newErrors;
  };

  const handleSaveSubCategories = async (e) => {
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
      const validSubCategories = subCategories.filter(
        (subCategory) => subCategory.name.trim() !== "" && subCategory.categoryId !== ""
      );
      if (validSubCategories.length === 0) {
        toast.error("At least one subcategory with a name and category is required.");
        setIsLoading(false);
        return;
      }

      const payload = {
        subCategoryRequests: validSubCategories.map((subCategory) => ({
          name: subCategory.name,
          categoryId: parseInt(subCategory.categoryId),
        })),
      };

      const response = await axios.post(SUBCATEGORY_API_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status.code === 0) {
        toast.success("Subcategories saved successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setSubCategories([{ categoryId: "", name: "" }]);
        navigate("/sub-category");
      } else {
        toast.error(`Failed to save subcategories: ${response.data.status.message}`);
      }
    } catch (error) {
      console.error("Error saving subcategories:", error.response?.data || error.message);
      toast.error(`Error saving subcategories: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="card-body">
        <form onSubmit={handleSaveSubCategories}>
          {subCategories.map((subCategory, index) => (
            <div key={index} className="row gx-3 mb-3">
              <div className="col-3">
                <div className="d-flex align-items-center gap-2">
                  <label className="form-label fw-semibold text-primary-light text-sm mb-0">
                    Category <span className="text-danger">*</span>
                  </label>
                  {index > 0 && (
                    <button
                      type="button"
                      className="btn-close btn-sm"
                      onClick={() => handleRemoveSubCategoryField(index)}
                    ></button>
                  )}
                </div>
                <select
                  className={`form-control radius-8 ${errors[`categoryId${index}`] ? "is-invalid" : ""}`}
                  value={subCategory.categoryId}
                  onChange={(e) => handleSubCategoryChange(index, "categoryId", e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors[`categoryId${index}`] && (
                  <div className="invalid-feedback d-block">{errors[`categoryId${index}`]}</div>
                )}
              </div>

              {/* Show Subcategory Name only if a category is selected */}
              {subCategory.categoryId && (
                <div className="col-3">
                  <div className="d-flex align-items-center gap-2">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-0">
                      Subcategory Name <span className="text-danger">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    className={`form-control radius-8 ${errors[`name${index}`] ? "is-invalid" : ""}`}
                    placeholder="Enter Subcategory Name"
                    value={subCategory.name}
                    onChange={(e) => handleSubCategoryChange(index, "name", e.target.value)}
                  />
                  {errors[`name${index}`] && (
                    <div className="invalid-feedback d-block">{errors[`name${index}`]}</div>
                  )}
                </div>
              )}
            </div>
          ))}

          <div className="text-muted small mt-4 mb-3">
            Fields marked with <span className="text-danger">*</span> are required.
          </div>

          <div className="mt-4 d-flex justify-content-between gap-2">
            <button
              type="button"
              className="btn btn-primary px-12 d-flex align-items-center gap-2"
              onClick={handleAddSubCategoryField}
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add Another Subcategory
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

export default AddSubCategoryLayer;