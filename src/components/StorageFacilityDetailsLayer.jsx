import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from "../hook/spinner-utils";
import { formatDate } from '../hook/format-utils';

const API_URL = "https://api.bizchain.co.ke/v1/storage-facilities";

const StorageFacilityDetailsLayer = () => {
  const location = useLocation();
  const facilityId = location.state?.facilityId;
  const navigate = useNavigate();
  const [facilityToView, setFacilityToView] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!facilityId) {
      navigate("/storage-facility"); 
      return;
    }

    const fetchFacilityData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`${API_URL}/${facilityId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const facilityData = response.data.data;
        setFacilityToView(facilityData);
      } catch (error) {
        console.error('Error fetching facility details:', error);
        setError('Failed to fetch facility details.');
      }
    };

    fetchFacilityData();
  }, [facilityId, navigate]);

  return (
    <div className="page-wrapper">
      <div className="card shadow-sm mt-3" style={{ width: "100%" }}>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {facilityToView ? (
            <div className="text-primary-light">
              <p className="mb-3">
                <strong>Name:</strong> {facilityToView.name || 'N/A'}
              </p>
              <p className="mb-3">
                <strong>Location:</strong> {facilityToView.location || 'N/A'}
              </p>
              <p className="mb-3">
                <strong>Capacity (L):</strong> {facilityToView.capacity ? facilityToView.capacity.toLocaleString() : 'N/A'}
              </p>
              <p className="mb-3">
                <strong>Current Volume (L):</strong> {facilityToView.stockVolume ? facilityToView.stockVolume.toLocaleString() : 'N/A'}
              </p>
              <p className="mb-3">
                <strong>Overflow (L):</strong> {facilityToView.overflow !== undefined && facilityToView.overflow !== null ? facilityToView.overflow.toLocaleString() : 'N/A'}
              </p>
              <p className="mb-3">
                <strong>Last Refilled:</strong> {formatDate(facilityToView.dateLastRefilled) || 'N/A'}
              </p>
              <p className="mb-3">
                <strong>Last Drawn:</strong> {formatDate(facilityToView.dateLastDrawn) || 'N/A'}
              </p>
              <p className="mb-3">
                <strong>Date Created:</strong> {formatDate(facilityToView.dateCreated) || 'N/A'}
              </p>
              <p className="mb-3">
                <strong>Created By:</strong> {facilityToView.createdBy?.name || 'N/A'}
              </p>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <Link to="/storage-facility" className="btn btn-primary">
                  Back
                </Link>
              </div>
            </div>
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </div>
  );
};

export default StorageFacilityDetailsLayer;