import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Spinner } from "../hook/spinner-utils";

const DEPOT_API_URL = "https://api.bizchain.co.ke/v1/depots";
const REGIONS_API_URL = "https://api.bizchain.co.ke/v1/regions";
const SUBREGIONS_API_URL = "https://api.bizchain.co.ke/v1/sub-regions";

const EditDepotLayer = ({ onDepotUpdated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const depotId = location.state?.depotId; 

  const [formData, setFormData] = useState({
    name: '',
    regionId: '',
    subRegionId: '',
  });
  const [regions, setRegions] = useState([]);
  const [subRegions, setSubRegions] = useState([]);
  const [filteredSubRegions, setFilteredSubRegions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = sessionStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const depotResponse = await axios.get(`${DEPOT_API_URL}/${depotId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const [regionsResponse, subRegionsResponse] = await Promise.all([
          axios.get(REGIONS_API_URL, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(SUBREGIONS_API_URL, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (depotResponse.data.status?.code === 0) {
          const depotData = depotResponse.data.data;
          setFormData({
            name: depotData.name || '',
            regionId: depotData.region?.id?.toString() || '',
            subRegionId: depotData.subRegion?.id?.toString() || '',
          });
        }

        if (regionsResponse.data.status?.code === 0) {
          setRegions(regionsResponse.data.data || []);
        }
        if (subRegionsResponse.data.status?.code === 0) {
          setSubRegions(subRegionsResponse.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrors({ fetch: 'Failed to load depot data or regions/subregions' });
      } finally {
        setIsLoading(false);
      }
    };

    if (depotId) {
      fetchData();
    } else {
      setErrors({ fetch: 'No depot ID provided' });
    }
  }, [depotId]);

  useEffect(() => {
    if (formData.regionId) {
      const filtered = subRegions.filter(
        subRegion => subRegion.region?.id === parseInt(formData.regionId)
      );
      setFilteredSubRegions(filtered);
      if (!filtered.some(sub => sub.id === parseInt(formData.subRegionId))) {
        setFormData(prev => ({ ...prev, subRegionId: '' }));
      }
    } else {
      setFilteredSubRegions([]);
      setFormData(prev => ({ ...prev, subRegionId: '' }));
    }
  }, [formData.regionId, subRegions, formData.subRegionId]);

  const validateField = (field, value) => {
    if (!value) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
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
        subRegionId: parseInt(formData.subRegionId),
      };

      console.log('Updating payload:', payload);

      const response = await axios.put(`${DEPOT_API_URL}/${depotId}`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status?.code === 0 && onDepotUpdated && response.data.data) {
        const updatedDepot = {
          id: depotId,
          name: formData.name,
          subRegion: { id: parseInt(formData.subRegionId) },
          region: { id: parseInt(formData.regionId) },
        };
        onDepotUpdated(updatedDepot);
      }

      navigate('/depot');

    } catch (error) {
      console.error('Error updating depot:', error.response?.data || error.message);
      setErrors({
        submit: error.response?.data?.message || 
                error.message || 
                'Failed to update depot. Please check your connection and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-body">
        {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
        {errors.fetch && <div className="alert alert-warning">{errors.fetch}</div>}

        {isLoading ? (
          <Spinner />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="row gx-3">
              {/* Name Field */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control radius-8 ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="Enter Depot Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              {/* Region Dropdown */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  Region <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select radius-8 ${errors.regionId ? 'is-invalid' : ''}`}
                  value={formData.regionId}
                  onChange={(e) => handleInputChange('regionId', e.target.value)}
                >
                  <option value="">Select Region</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
                {errors.regionId && <div className="invalid-feedback">{errors.regionId}</div>}
              </div>

              {/* Subregion Dropdown */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  Subregion <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select radius-8 ${errors.subRegionId ? 'is-invalid' : ''}`}
                  value={formData.subRegionId}
                  onChange={(e) => handleInputChange('subRegionId', e.target.value)}
                  disabled={!formData.regionId}
                >
                  <option value="">Select Subregion</option>
                  {filteredSubRegions.map((subRegion) => (
                    <option key={subRegion.id} value={subRegion.id}>
                      {subRegion.name}
                    </option>
                  ))}
                </select>
                {errors.subRegionId && <div className="invalid-feedback">{errors.subRegionId}</div>}
              </div>
            </div>

            <div className="text-muted small mt-4 mb-3">
              Fields marked with <span className="text-danger">*</span> are required.
            </div>

            <div className="mt-4 d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary px-12"
                onClick={() => navigate('/depot')}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary px-12"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditDepotLayer;