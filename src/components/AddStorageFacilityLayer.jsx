import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://api.bizchain.co.ke/v1/storage-facilities";

const AddFacilityLayer = ({ onFacilityAdded }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = (field, value) => {
    if (!value.trim()) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (field === 'capacity' && value) {
      if (isNaN(value) || parseFloat(value) <= 0) {
        return 'Capacity must be a positive number';
      }
    }
    return '';
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const payload = {
        name: formData.name,
        location: formData.location,
        capacity: parseFloat(formData.capacity),
      };

      console.log('Submitting payload:', payload);

      const response = await axios.post(API_URL, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status?.code === 0 && onFacilityAdded && response.data.data) {
        const newFacility = {
          id: response.data.data.id,
          name: formData.name,
          location: formData.location,
          capacity: parseFloat(formData.capacity),
        };
        onFacilityAdded(newFacility);
      }

      navigate('/storage-facility');

    } catch (error) {
      console.error('Error adding facility:', error.response?.data || error.message);
      setErrors({
        submit: error.response?.data?.message || 
                error.message || 
                'Failed to add facility. Please check your connection and try again.',
      });
      navigate('/storage-facility');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-body">
        {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row gx-3">
            {/* First Column */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control radius-8 ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Enter Facility Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            {/* Second Column */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                Location <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control radius-8 ${errors.location ? 'is-invalid' : ''}`}
                placeholder="Enter Location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
              {errors.location && <div className="invalid-feedback">{errors.location}</div>}
            </div>

            {/* Third Column */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                Capacity (Litres) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className={`form-control radius-8 ${errors.capacity ? 'is-invalid' : ''}`}
                placeholder="Enter Capacity in Litres"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                min="1"
              />
              {errors.capacity && <div className="invalid-feedback">{errors.capacity}</div>}
            </div>
          </div>

          <div className="text-muted small mt-4 mb-3">
            Fields marked with <span className="text-danger">*</span> are required.
          </div>

          <div className="mt-4 d-flex justify-content-end gap-2">
            <button
              type="submit"
              className="btn btn-primary px-12"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFacilityLayer;