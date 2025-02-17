import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const RoutesLayer = () => {
  const [routes, setRoutes] = React.useState([
    { name: "Kegonga", subRegion: "Kuria East", region: "Nyanza", customers: 150, salesAgents: 38 },
    { name: "Bofa", subRegion: "Kilifi", region: "Mombasa", customers: 135, salesAgents: 27 },
    { name: "Lenana", subRegion: "Vihiga", region: "Western", customers: 118, salesAgents: 19 },
    { name: "Uhuru Highway", subRegion: "CBD", region: "Nairobi", customers: 256, salesAgents: 44 },
    // { name: "Route 5", subRegion: "Sub 5", region: "Region 5", customers: 100, salesAgents: 10 },
    // { name: "Route 6", subRegion: "Sub 6", region: "Region 6", customers: 110, salesAgents: 11 },
    // { name: "Route 7", subRegion: "Sub 7", region: "Region 7", customers: 120, salesAgents: 12 },
    // { name: "Route 8", subRegion: "Sub 8", region: "Region 8", customers: 130, salesAgents: 13 },
    // { name: "Route 9", subRegion: "Sub 9", region: "Region 9", customers: 140, salesAgents: 14 },
    // { name: "Route 10", subRegion: "Sub 10", region: "Region 10", customers: 150, salesAgents: 15 },
    // { name: "Route 11", subRegion: "Sub 11", region: "Region 11", customers: 160, salesAgents: 16 },
  ]);

  const [editRoute, setEditRoute] = React.useState({ name: '', subRegion: '', region: '', customers: 0, salesAgents: 0 });
  const [routeToDelete, setRouteToDelete] = React.useState(null);
  const [newRoute, setNewRoute] = useState({ name: '', subRegion: '' });
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Set items per page to 10

  // Handle edit click
  const handleEditClick = (route) => {
    setEditRoute(route);
  };

  // Handle edit submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedRoutes = routes.map((r) =>
      r.name === editRoute.name ? { ...r, ...editRoute } : r
    );
    setRoutes(updatedRoutes);
  };

  // Handle delete click
  const handleDeleteClick = (route) => {
    setRouteToDelete(route);
  };

  // Handle delete confirm
  const handleDeleteConfirm = () => {
    const updatedRoutes = routes.filter((r) => r.name !== routeToDelete.name);
    setRoutes(updatedRoutes);
    setRouteToDelete(null);
  };

  // Handle add route
  const handleAddRoute = (e) => {
    e.preventDefault();
    if (!newRoute.name || !newRoute.subRegion) {
      alert("Please fill in all fields before saving.");
      return;
    }
    const newRouteData = {
      name: newRoute.name,
      subRegion: newRoute.subRegion,
      customers: 0,
      salesAgents: 0,
    };
    setRoutes([...routes, newRouteData]);
    setNewRoute({ name: '', subRegion: '' }); // Reset form state
    e.target.reset(); // Reset the form
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = routes.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(routes.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Stats data
  const stats = [
    { title: "Total Employees", count: 1007, icon: "mdi:account-group", color: "bg-dark" },
    { title: "Active", count: 1007, icon: "mdi:account-check", color: "bg-success" },
    { title: "Inactive", count: 1007, icon: "mdi:account-off", color: "bg-danger" },
    { title: "New Joiners", count: 67, icon: "mdi:account-plus", color: "bg-info" },
  ];

  return (
    <div className="page-wrapper">
      <div className="row">
        <div className="d-flex align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="ms-auto">
            <button
              type="button"
              className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add Route
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-2">
          {stats.map((item, index) => (
            <div className="col-lg-3 col-md-6 col-sm-12 d-flex" key={index}>
              <div className="card flex-fill full-width-card">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className={`avatar avatar-lg ${item.color} rounded-circle d-flex align-items-center justify-content-center`}>
                      <Icon icon={item.icon} width="24" height="24" className="text-white" />
                    </div>
                    <div className="ms-2">
                      <p className="fs-8 fw-medium mb-1 text-truncate">{item.title}</p>
                      <h6 className="mb-0 fs-8 fw-bold">{item.count}</h6>
                    </div>
                  </div>
                  <div className="stat-change">
                    <span className="badge bg-light text-dark px-1 py-1 d-flex align-items-center gap-1">
                      <Icon icon="mdi:trending-up" className="text-xs text-success" />
                      <small className="fs-8">+19.01%</small>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="card shadow-sm mt-3 full-width-card" style={{ width: '100%' }}>
          <div className="card-body">
            <div>
              <form className="navbar-search" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', width: "32px" }}>
                <input type='text' name='search' placeholder='Search' />
                <Icon icon='ion:search-outline' className='icon' style={{ width: '16px', height: '16px' }} />
              </form>
            </div>
            <div className="table-responsive" style={{ overflow: 'visible' }}>
              <table className="table table-borderless text-start small-text" style={{ width: '100%' }}>
                <thead className="table-light text-start small-text">
                  <tr>
                    <th className="text-start">#</th>
                    <th className="text-start">Name</th>
                    <th className="text-start">Sub Regions</th>
                    <th className="text-start">Regions</th>
                    <th className="text-start">Customers</th>
                    <th className="text-start">Sales Agents</th>
                    <th className="text-start">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((route, index) => (
                    <tr key={index}>
                      <th scope="row" className="text-start small-text">{indexOfFirstItem + index + 1}</th>
                      <td className="text-start small-text">{route.name} Route</td>
                      <td className="text-start small-text">{route.subRegion}</td>
                      <td className="text-start small-text">{route.region}</td>
                      <td className="text-start small-text">{route.customers}</td>
                      <td className="text-start small-text">{route.salesAgents}</td>
                      <td className="text-start small-text">
                        <div className="dropdown">
                          <button className="btn btn-light dropdown-toggle btn-sm" type="button" data-bs-toggle="dropdown">
                            Actions
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <Link
                                className="dropdown-item"
                                to={`/routes/${route.name}`}
                                state={{ route }}
                              >
                                View
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item"
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#editModal"
                                onClick={() => handleEditClick(route)}
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteClick(route)}
                                data-bs-toggle="modal"
                                data-bs-target="#deleteModal"
                              >
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-start mt-3">
              <div className="text-muted">
                <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, routes.length)} of {routes.length} entries</span>
              </div>
              <nav aria-label="Page navigation">
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <Icon icon="ep:d-arrow-left" />
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button
                        className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px"
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <Icon icon="ep:d-arrow-right" />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        {/* Add Route Modal */}
        <div className="modal fade" id="exampleModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Add Route
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                <form onSubmit={handleAddRoute}>
                  <div className="mb-3">
                    <label className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control w-100"
                      name="name"
                      placeholder="Enter Route Name"
                      value={newRoute.name}
                      onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <div className="position-relative">
                      <label className="form-label">
                        Sub Region <span className="text-danger">*</span>
                      </label>
                      <div
                        className="form-control d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowDropdown(!showDropdown)}
                      >
                        <span>{newRoute.subRegion || "Select Sub Region"}</span>
                        <i className="dropdown-toggle ms-2"></i>
                      </div>
                      {showDropdown && (
                        <ul className="dropdown-menu w-100 show" style={{ position: "absolute", top: "100%", left: 0, zIndex: 1000 }}>
                          {["Westlands", "Kilifi", "Vihiga", "Kuria East"].map((subRegion, index) => (
                            <li key={index}>
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => {
                                  setNewRoute({ ...newRoute, subRegion });
                                  setShowDropdown(false);
                                }}
                              >
                                {subRegion}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Route Modal */}
        <div className="modal fade" id="editModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h6 className="modal-title d-flex justify-content-between align-items-center w-100 fs-6">
                  Edit Route
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </h6>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label className="form-label">
                      Route Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Route Name"
                      value={editRoute.name}
                      onChange={(e) => setEditRoute({ ...editRoute, name: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Sub Region <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Sub Region Name"
                      value={editRoute.subRegion}
                      onChange={(e) => setEditRoute({ ...editRoute, subRegion: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Region <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Region Name"
                      value={editRoute.region}
                      onChange={(e) => setEditRoute({ ...editRoute, region: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Customer <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter Number of Customers"
                      value={editRoute.customers}
                      onChange={(e) => setEditRoute({ ...editRoute, customers: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Sales Agent <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter Number of Sales Agents"
                      value={editRoute.salesAgents}
                      onChange={(e) => setEditRoute({ ...editRoute, salesAgents: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="text-muted small mt-3">
                    Fields marked with <span className="text-danger">*</span> are required.
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <div className="modal fade" id="deleteModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body pt-3 ps-18 pe-18">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="modal-title fs-6">Delete Route</h6>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <p className="pb-3 mb-0">
                  Are you sure you want to delete the <strong>{routeToDelete?.name}</strong> route permanently? This action cannot be undone.
                </p>
              </div>
              <div className="d-flex justify-content-end gap-2 px-12 pb-3">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDeleteConfirm}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutesLayer;