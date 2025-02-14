import { Icon } from '@iconify/react/dist/iconify.js';
import {React, useState} from 'react';
import { Link } from 'react-router-dom';



const RolesListLayer = () => {

    const [query, setQuery] = useState('');
        
    return (
        <div className='page-wrapper'>
            <div className="py-16 px-24 d-flex align-items-end flex-wrap gap-3 justify-content-end">
                <Link
                    to="/create-role"
                    className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                >
                    <Icon
                        icon="ic:baseline-plus"
                        className="icon text-xl line-height-1"
                    />
                        New Role 
                </Link>
            </div> 
        <div className ="card h-100% p-10 radius-12">
            <div> <form className="navbar-search d-flex align-items-center justify-content-start p-12">
                            <input
                              type='text'
                              name='search'
                              placeholder='Search'
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                            />
                            <Icon 
                              icon='ion:search-outline' 
                              className='icon ms-2' 
                              style={{ width: '16px', height:'16px', cursor: 'pointer' }} 
                            />
                            </form>
                          </div>
            <div className="card-body">
            </div>
             
            {/* <div className="card-body p-24"> */}
                <div className="table-responsive scroll-sm">
                    <table className="table borderless-table sm-table mb-0">
                        <thead>
                            <tr>
                                {/* <th scope="col">
                                <div className="form-check style-check d-flex align-items-center">
                                            <input className="form-check-input" type="checkbox"/>
                                            <label className="form-check-label">SL</label>
                                        </div>
                                </th> */}
                                <th scope="col">Name</th>
                                <th scope="col">No. of Users</th>
                                <th scope="col">Date Created</th>
                                <th scope="col">Entity Type</th>
                                <th scope="col">Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {/* <th scope="row">
                                <div className="form-check style-check d-flex align-items-center">
                                        <input className="form-check-input" type="checkbox"/>
                                        <label className="form-check-label">1</label>
                                </div>
                                </th> */}
                                <td>Sales Person</td>
                                <td>7</td>
                                <td>24 Jan 2025</td>
                                <td>Admin</td>
                                <td>
                                <div className="dropdown">
                                    <button
                                        className="btn btn-primary-600 bg-primary-50 border-primary-50 text-primary-600 hover-text-primary not-active px-18 py-11 dropdown-toggle"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        {" "}
                                        Action{" "}
                                    </button>
                                    <ul className="dropdown-menu">
                                    <li>
                                        <Link
                                            className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                            to="#"
                                        >
                                            View
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                            to="#"
                                        >
                                            Edit
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                            to="#"
                                        >
                                            Delete
                                        </Link>
                                    </li>
                                    </ul>
                                </div>
                                </td>
                            </tr>
                            <tr>
                                {/* <th scope="row">
                                <div className="form-check style-check d-flex align-items-center">
                                        <input className="form-check-input" type="checkbox"/>
                                        <label className="form-check-label">2</label>
                                </div>
                                </th> */}
                                <td>Manager</td>
                                <td>22</td>
                                <td>14 Feb 2025</td>
                                <td>User</td>
                                <td>
                                <div className="dropdown">
                                    <button
                                        className="btn btn-primary-600 bg-primary-50 border-primary-50 text-primary-600 hover-text-primary not-active px-18 py-11 dropdown-toggle"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        {" "}
                                        Action{" "}
                                    </button>
                                    <ul className="dropdown-menu">
                                    <li>
                                        <Link
                                            className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                            to="#"
                                        >
                                            View
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                            to="#"
                                        >
                                            Edit
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                            to="#"
                                        >
                                            Delete
                                        </Link>
                                    </li>
                                    </ul>
                                </div>
                                </td>
                            </tr>
                            <tr>
                                {/* <th scope="row">
                                <div className="form-check style-check d-flex align-items-center">
                                        <input className="form-check-input" type="checkbox"/>
                                        <label className="form-check-label">3</label>
                                </div>
                                </th> */}
                                <td>Distributor</td>
                                <td>27</td>
                                <td>4 Jan 2025</td>
                                <td>User</td>
                                <td>
                                <div className="dropdown">
                                    <button
                                        className="btn btn-primary-600 bg-primary-50 border-primary-50 text-primary-600 hover-text-primary not-active px-18 py-11 dropdown-toggle"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Action{" "}
                                    </button>
                                    <ul className="dropdown-menu">
                                    <li>
                                        <Link
                                            className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                            to="#"
                                        >
                                            View
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                            to="#"
                                        >
                                            Edit
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                                            to="#"
                                        >
                                            Delete
                                        </Link>
                                    </li>
                                    </ul>
                                </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            {/* </div>       */}
        </div>
        </div>
        
    );
};

export default RolesListLayer;