import { Icon } from '@iconify/react/dist/iconify.js';
import {React, useState}from 'react';
import { Link } from 'react-router-dom';

const UsersListLayer = () => {
    const [query, setQuery] = useState('');
    
    return (
        <div className="page-wrapper">
             <div className="mb-8 mt-0 py-6 px-14 d-flex align-items-center flex-wrap gap-3 justify-content-end">
                <Link
                    to="/add-users"
                    className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                >
                    <Icon
                        icon="ic:baseline-plus"
                        className="icon text-xl line-height-1"
                    />
                    Add New User
                </Link>
            </div>
        <div className="card h-100 p-0 radius-12">
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
           
            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table table-borderless sm-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone No.</th>
                                <th scope="col">Role</th>
                                <th scope="col" className="text-center">
                                    Status
                                </th>
                                <th scope="col" className="text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="d-flex align-items-center gap-10">1</div>
                                </td>
                                {/* <td>25 Jan 2024</td> */}
                                <td>
                                    <div className="d-flex align-items-center">
                                        <Link className="hover-text-primary" to="#">
                                    Kathryn Murphy
                                    </Link>
                                    </div>
                                </td>
                                <td>
                                    <span className="text-md mb-0 fw-normal text-secondary-light">
                                        osgoodwy@gmail.com
                                    </span>
                                </td>
                                <td>070100387</td>
                                <td>Manager</td>
                                <td className="text-center">
                                    <span className="bg-success-focus text-success-600 border-success-main px-24 py-4 radius-8 fw-medium text-sm">
                                        Active
                                    </span>
                                </td>
                                <td className="text-center">
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
                            <tr>
                                <td>
                                    <div className="d-flex align-items-center gap-10">
                                        2
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center">
                                    <Link className="hover-text-primary" to="#">
                                    Annette Black
                                    </Link>
                                    </div>
                                </td>
                                <td>
                                    <span className="text-md mb-0 fw-normal text-secondary-light">
                                        redaniel@gmail.com
                                    </span>
                                </td>
                                <td>0722874194</td>
                                <td> Customer</td>
                                <td className="text-center">
                                    <span className="bg-neutral-200 text-neutral-600 px-24 py-4 radius-8 fw-medium text-sm">
                                        Inactive
                                    </span>
                                </td>
                                <td className="text-center">
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
                            <tr>
                                <td>
                                    <div className="d-flex align-items-center gap-10">
                                        3
                                    </div>
                                </td>
                                {/* <td>10 Feb 2024</td> */}
                                <td>
                                    <div className="d-flex align-items-center">
                                    <Link className="hover-text-primary" to="#">
                                    Ronald Richards
                                    </Link>
                                    </div>
                                </td>
                                <td>
                                    <span className="text-md mb-0 fw-normal text-secondary-light">
                                        seannand@mail.ru
                                    </span>
                                </td>
                                <td>0785986523</td>
                                <td>Sales Person</td>
                                <td className="text-center">
                                    <span className="bg-success-focus text-success-600 border-success-main px-24 py-4 radius-8 fw-medium text-sm">
                                        Active
                                    </span>
                                </td>
                                <td className="text-center">
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
                            <tr>
                                <td>
                                    <div className="d-flex align-items-center gap-10">
                                        4
                                    </div>
                                </td>
                                {/* <td>10 Feb 2024</td> */}
                                <td>
                                    <div className="d-flex align-items-center">
                                    <Link className="hover-text-primary" to="#">
                                    Eleanor Pena
                                    </Link>
                                    </div>
                                </td>
                                <td>
                                    <span className="text-md mb-0 fw-normal text-secondary-light">
                                        miyokoto@mail.ru
                                    </span>
                                </td>
                                <td>0740113481</td>
                                <td>Manager</td>
                                <td className="text-center">
                                    <span className="bg-success-focus text-success-600 border-success-main px-24 py-4 radius-8 fw-medium text-sm">
                                        Active
                                    </span>
                                </td>
                                <td className="text-center">
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
                            <tr>
                                <td>
                                    <div className="d-flex align-items-center gap-10">
                                        5
                                    </div>
                                </td>
                                {/* <td>15 March 2024</td> */}
                                <td>
                                    <div className="d-flex align-items-center">
                                    <Link className="hover-text-primary" to="#">
                                    Leslie Alexander
                                    </Link>
                                    </div>
                                </td>
                                <td>
                                    <span className="text-md mb-0 fw-normal text-secondary-light">
                                        icadahli@gmail.com
                                    </span>
                                </td>
                                <td>0701038181</td>
                                <td>Sales Person</td>
                                <td className="text-center">
                                    <span className="bg-neutral-200 text-neutral-600 border-neutral-400 px-24 py-4 radius-8 fw-medium text-sm">
                                        Inactive
                                    </span>
                                </td>
                                <td className="text-center">
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
                            <tr>
                                <td>
                                    <div className="d-flex align-items-center gap-10">
                                        6
                                    </div>
                                </td>
                                {/* <td>15 March 2024</td> */}
                                <td>
                                    <div className="d-flex align-items-center">
                                    <Link className="hover-text-primary" to="#">
                                    Albert Flores
                                    </Link>
                                    </div>
                                </td>
                                {/* <td>
                                    <div className="d-flex align-items-center">
                                        <img
                                            src="assets/images/user-list/user-list6.png"
                                            alt="Wowdash"
                                            className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden"
                                        />
                                        <div className="flex-grow-1">
                                            <span className="text-md mb-0 fw-normal text-secondary-light">
                                                Albert Flores
                                            </span>
                                        </div>
                                    </div>
                                </td> */}
                                <td>
                                    <span className="text-md mb-0 fw-normal text-secondary-light">
                                        warn@mail.ru
                                    </span>
                                </td>
                                <td>0700033484</td>
                                <td>Sales Person</td>
                                <td className="text-center">
                                    <span className="bg-success-focus text-success-600 border-success-main px-24 py-4 radius-8 fw-medium text-sm">
                                        Active
                                    </span>
                                </td>
                                <td className="text-center">
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
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                    <span>Showing 1 to 10 of 12 entries</span>
                    <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                        <li className="page-item">
                            <Link
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px  text-md"
                                to="#"
                            >
                                <Icon icon="ep:d-arrow-left" className="" />
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md bg-primary-600 text-white"
                                to="#"
                            >
                                1
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px"
                                to="#"
                            >
                                2
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md"
                                to="#"
                            >
                                3
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md"
                                to="#"
                            >
                                4
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md"
                                to="#"
                            >
                                5
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px  text-md"
                                to="#"
                            >
                                {" "}
                                <Icon icon="ep:d-arrow-right" className="" />{" "}
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        </div>

    );
};

export default UsersListLayer;