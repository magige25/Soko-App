import { Icon } from '@iconify/react/dist/iconify.js';
import {React, useState}from 'react';
import { Link } from 'react-router-dom';


const usersData = [
    { id: 1, name: "Kathryn Murphy", email: "osgoodwy@gmail.com", phone: "070100387", role: "Manager", status: "Active" },
    { id: 2, name: "John Doe", email: "john@example.com", phone: "0712345678", role: "Admin", status: "Inactive" },
    { id: 3, name: "Alice Johnson", email: "alice@gmail.com", phone: "0723456789", role: "User", status: "Active" },
    { id: 4, name: "Bob Brown", email: "bob@example.com", phone: "0734567890", role: "Editor", status: "Pending" }
  ];

const UsersListLayer = () => {
    const [query, setQuery] = useState('');
    const [users] = useState(usersData);

    const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase()) ||
    user.email.toLowerCase().includes(query.toLowerCase()) ||
    user.phone.includes(query) ||
    user.role.toLowerCase().includes(query.toLowerCase())
);

    const handleSearch =() => {
        if (query.trim() !== '') {
            console.log('Searching for:', query);
            // Perform search logic (e.g., filter items, send query to backend, etc.)
        }
    };
    
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
              <div> 
                <form 
                className="navbar-search d-flex align-items-center justify-content-start p-12"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                }}
                >
                <input
                  type='text'
                  name='search'
                  placeholder='Search'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  OnKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Icon 
                  icon='ion:search-outline' 
                  className='icon ms-2' 
                  style={{ width: '16px', height:'16px', cursor: 'pointer' }}
                  onClick={handleSearch} 
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
                                <th scope="col" className="text-center">Status</th>
                                <th scope="col" className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {filteredUsers.leghth > 0 ? (
                                filteredUsers.map((user, index) => (
                                    <tr key={user.id}>
                                        <td>{index + 1}</td>
                                    </tr>
                                ))
                            )} */}
                            <tr>
                                <td>
                                    <div className="d-flex align-items-center gap-10">1</div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <Link className="hover-text-primary" to="#">
                                    Kathryn Murphy {user.name}
                                    </Link>
                                    </div>
                                </td>
                                <td>
                                    <span className="text-md mb-0 fw-normal text-secondary-light">
                                        osgoodwy@gmail.com {user.mail}
                                    </span>
                                </td>
                                <td>070100387 {user.phone} </td>
                                <td>{user.role}</td>
                                <td className="text-center">
                                    <span className="bg-success-focus text-success-600 border-success-main px-24 py-4 radius-8 fw-medium text-sm">
                                        Active {user.status}
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
                                
                                <td>
                                    <div className="d-flex align-items-center">
                                    <Link className="hover-text-primary" to="#">
                                    Albert Flores
                                    </Link>
                                    </div>
                                </td>
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