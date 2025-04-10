import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from "../hook/spinner-utils";

const API_URL = "https://api.bizchain.co.ke/v1/storage-facilities";

const EditStorageFacilityLayer = () => {
  const location = useLocation();
  const facilityId = location.state?.facilityId; 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    location: '',
    capacity: '',
    stockVolume: '',
    overflow: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!facilityId) {
      navigate("/storage-facility");
    }

    const fetchFacilityData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`${API_URL}/${facilityId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Fetched Facility Data:', response.data);
        const facilityData = response.data.data;

        setFormData({
          id: facilityData.id ? String(facilityData.id) : '',
          name: facilityData.name || '',
          location: facilityData.location || '',
          capacity: facilityData.capacity || '',
          stockVolume: facilityData.stockVolume || '',
          overflow: facilityData.overflow || '',
        });
      } catch (error) {
        console.error('Error fetching facility details:', error);
        setError('Failed to fetch facility details.');
      }
    };

    fetchFacilityData();
  }, [facilityId, navigate]);

  const validateField = (field, value) => {
    const stringValue = String(value || '').trim();
    if (!stringValue) {
      switch (field) {
        case 'name':
          return 'Facility Name is required';
        case 'capacity':
          return 'Capacity is required';
        default:
          return '';
      }
    }
    if (field === 'capacity' && (isNaN(stringValue) || parseFloat(stringValue) <= 0)) {
      return 'Capacity must be a positive number';
    }
    if (field === 'stockVolume' && stringValue && (isNaN(stringValue) || parseFloat(stringValue) < 0)) {
      return 'Current Volume must be a non-negative number';
    }
    if (field === 'overflow' && stringValue && (isNaN(stringValue) || parseFloat(stringValue) < 0)) {
      return 'Overflow must be a non-negative number';
    }
    if (field === 'stockVolume' && stringValue && parseFloat(stringValue) > parseFloat(formData.capacity)) {
      return 'Current Volume cannot exceed Capacity';
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
      if (field !== 'id' && field !== 'location') {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const token = sessionStorage.getItem('token');

      const payload = {
        name: formData.name,
        location: formData.location || null,
        capacity: parseFloat(formData.capacity),
        stockVolume: formData.stockVolume ? parseFloat(formData.stockVolume) : null,
        overflow: formData.overflow ? parseFloat(formData.overflow) : 0.0,
      };

      await axios.put(`${API_URL}/${formData.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate('/storage-facility');
    } catch (error) {
      console.error('Error updating facility:', error);
      setError(error.response?.data?.status?.message || "Failed to update facility.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="card shadow-sm mt-3" style={{ width: "100%" }}>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {formData.id ? (
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Facility Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Enter Facility Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Location
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                    placeholder="Enter Location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                  {errors.location && (
                    <div className="invalid-feedback">{errors.location}</div>
                  )}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Capacity (L) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.capacity ? 'is-invalid' : ''}`}
                    placeholder="Enter Capacity in Liters"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    step="0.01"
                    min="0"
                    required
                  />
                  {errors.capacity && (
                    <div className="invalid-feedback">{errors.capacity}</div>
                  )}
                </div>
              </div>
              <div className="text-muted mt-3">
                Fields marked with <span className="text-danger">*</span> are required.
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditStorageFacilityLayer;