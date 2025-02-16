import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UsersListLayer = () => {
  const [usersList] = useState([
    { id: 1, name: 'Kathryn Murphy', email: 'osgoodwy@gmail.com', phone: '070100387', role: 'Manager', status: 'Active' },
    { id: 2, name: 'Annette Black', email: 'redaniel@gmail.com', phone: '0722874194', role: 'Customer', status: 'Inactive' },
    { id: 3, name: 'Ronald Richards', email: 'seannand@mail.ru', phone: '0785986523', role: 'Sales Person', status: 'Active' },
    { id: 4, name: 'Eleanor Pena', email: 'miyokoto@mail.ru', phone: '0740113481', role: 'Manager', status: 'Active' },
    { id: 5, name: 'Leslie Alexander', email: 'icadahli@gmail.com', phone: '0701038181', role: 'Sales Person', status: 'Inactive' },
    { id: 6, name: 'Albert Flores', email: 'warn@mail.ru', phone: '0700033484', role: 'Sales Person', status: 'Active' },
  ]);

  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = usersList.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(usersList.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="page-wrapper">
      <div className="row">
        <div className="d-flex align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="ms-auto">
            <Link
              to="/add-users"
              className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
            >
              <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
              Add New User
            </Link>
          </div>
        </div>

        <div className="card shadow-sm mt-3 full-width-card" style={{ width: '100%' }}>
          <div className="card-body">
            <div>
              <form className="navbar-search" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', width: "32px" }}>
                <input
                  type='text'
                  name='search'
                  placeholder='Search'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Icon icon='ion:search-outline' className='icon' style={{ width: '16px', height: '16px' }} />
              </form>
            </div>
            <div className="table-responsive" style={{ overflow: 'visible' }}>
              <table className="table table-borderless text-start small-text" style={{ width: '100%' }}>
                <thead className="table-light text-start small-text">
                  <tr>
                    <th className="text-start">#</th>
                    <th className="text-start">Name</th>
                    <th className="text-start">Email</th>
                    <th className="text-start">Phone No.</th>
                    <th className="text-start">Role</th>
                    <th className="text-start">Status</th>
                    <th className="text-start">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((user, index) => (
                    <tr key={index}>
                      <th scope="row" className="text-start small-text">{index + 1}</th>
                      <td className="text-start small-text">{user.name}</td>
                      <td className="text-start small-text">{user.email}</td>
                      <td className="text-start small-text">{user.phone}</td>
                      <td className="text-start small-text">{user.role}</td>
                      <td className="text-start small-text">
                        <span className={`bg-${user.status === 'Active' ? 'success-focus' : 'neutral-200'} text-${user.status === 'Active' ? 'success-600' : 'neutral-600'} px-24 py-4 radius-8 fw-medium text-sm`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="text-start small-text">
                        <div className="dropdown">
                          <button className="btn btn-light dropdown-toggle btn-sm" type="button" data-bs-toggle="dropdown">
                            Actions
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <Link
                                className="dropdown-item"
                                to={`/users/${user.id}`}
                              >
                                View
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item"
                                to="#"
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => console.log("Delete user:", user.id)}
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
                <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, usersList.length)} of {usersList.length} entries</span>
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
      </div>
    </div>
  );
};

export default UsersListLayer;