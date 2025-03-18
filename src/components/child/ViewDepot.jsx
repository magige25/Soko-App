import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { formatDate } from "../../hook/format-utils";

const API_URL = "https://api.bizchain.co.ke/v1/depots";
const REGION_API = "https://api.bizchain.co.ke/v1/regions";
const SUB_REGION_API = "https://api.bizchain.co.ke/v1/sub-regions";

const ViewDepotPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [depot, setDepot] = useState(null);
  const [regions, setRegions] = useState([]);
  const [subRegions, setSubRegions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [depotRes, regionsRes, subRegionsRes] = await Promise.all([
          axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(REGION_API, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(SUB_REGION_API, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setDepot(depotRes.data.data || {});
        setRegions(regionsRes.data.data || []);
        setSubRegions(
          (subRegionsRes.data.data || []).map((sr) => ({
            ...sr,
            regionId: sr.region.id,
          }))
        );
      } catch (error) {
        console.error("Error loading depot details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!depot) {
    return <div className="container mt-5">Depot not found.</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Depot Details</h2>
      <div className="card">
        <div className="card-body">
          <p><strong>Name:</strong> {depot.name}</p>
          <p><strong>Region:</strong> {regions.find((r) => r.id === depot.regionId)?.name || "N/A"}</p>
          <p><strong>Sub-Region:</strong> {subRegions.find((sr) => sr.id === depot.subRegionId)?.name || "N/A"}</p>
          <p><strong>Date Created:</strong> {formatDate(depot.dateCreated)}</p>
        </div>
      </div>
      <div className="mt-3">
        <button className="btn btn-secondary" onClick={() => navigate("/depots")}>
          Back to Depots
        </button>
      </div>
    </div>
  );
};

export default ViewDepotPage;