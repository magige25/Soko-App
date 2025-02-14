//import { Icon } from '@iconify/react/dist/iconify.js';
import React from 'react';
//import { Link } from 'react-router-dom';



const CreateRoleLayer = () => {

    return (
        <div className ="card h-100% p-10 radius-12">
            {/* <div className="card-body"> */}
                {/* <h6 className="text-md text-primary-light mb-6">
                    Create Role
                </h6> */}
                    <form>
                        <div className ="row gx-3">
                            <div className= "col-md-6 mb-20">
                                <label htmlFor="text" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control radius-8"
                                    id="text"
                                    placeholder="Enter Role"
                                />
                            </div>
                            <div className="col-md-6 mb-20">
                                <label htmlFor="entity" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                    Entity Type
                                </label>
                                <div className="relative w-full">
                                <select className="form-control radius-8 form-select padding-right-15px appearance-none" id="role">
                                    <option value="" disabled>Entity Type</option>
                                    <option>Admin</option>
                                    <option>User</option>
                                </select>
                                <span className="position-absolute end-3 top-50 translate-middle-y me-3">

                                </span>
                                </div>
                            </div>
                                <div className="table-responsive px-8 py-4 fw-medium text-sm">
                                    <h6 className="text-md text-primary-light mb-6">
                                    Modules and Permissions
                                    </h6>
                                    <table className="table table-borderless mb-0 mt-2">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col"> Modules</th>
                                                <th scope="col">Permissions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div className="form-check style-check d-flex align-items-start">
                                                        <input className="form-check-input" type="checkbox"/>
                                                        <label className="form-check-label">1</label>
                                                    </div>
                                                </td>
                                        
                                                <td>Stock Management</td>
                                                <td>
                                                    <div className="d-flex align-items-start">
                                                    <div className="d-flex flex-row flex-grow-1 gap-3">
                                                    <div className="form-check form-check-md d-flex align-items-center gap-2">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                        />
                                                        <label className="form-check-label">View</label>
                                                    </div>
                                                    <div className="form-check form-check-md d-flex align-items-center gap-2">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                        />
                                                        <label className="form-check-label">Write</label>
                                                    </div>
                                                    <div className="form-check form-check-md d-flex align-items-center gap-2">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                        />
                                                        <label className="form-check-label">Create</label>
                                                    </div>
                                                    <div className="form-check form-check-md d-flex align-items-center gap-2">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                        />
                                                    <label className="form-check-label">Delete</label>
                                                    </div>
                                                    </div>
                                                    </div>                                    
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="form-check style-check d-flex align-items-start">
                                                        <input className="form-check-input" type="checkbox"/>
                                                        <label className="form-check-label">2</label>
                                                    </div>
                                                </td>
                                                <td className=""> User Management</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                    <div className="d-flex flex-row flex-grow-1 gap-3">
                                                    <div className="form-check form-check-md d-flex align-items-center gap-2">
                                                        <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                    />
                                                        <label className="form-check-label">View</label>
                                                    </div>
                                                    <div className="form-check form-check-md d-flex align-items-center gap-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                    />
                                                    <label className="form-check-label">Write</label>
                                                    </div>
                                                    <div className="form-check form-check-md d-flex align-items-center gap-2">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                        />
                                                    <label className="form-check-label">Create</label>
                                                    </div>
                                                    <div className="form-check form-check-md d-flex align-items-center gap-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                    />
                                                    <label className="form-check-label">Delete</label>
                                                    </div>
                                                    </div>
                                                    </div> 
                                                </td>
                                            </tr>
                                            <tr>
                                        
                                        <td>
                                            <div className="form-check style-check d-flex align-items-start">
                                                <input className="form-check-input" type="checkbox"/>
                                                <label className="form-check-label">3</label>
                                            </div>
                                        </td>
                                        
                                        <td>Order Management</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                            <div className="d-flex flex-row flex-grow-1 gap-3">
                                            <div className="form-check form-check-md d-flex align-items-center gap-2">
                                                <input
                                                className="form-check-input"
                                                type="checkbox"
                                                />
                                                <label className="form-check-label">View</label>
                                            </div>
                                            <div className="form-check form-check-md d-flex align-items-center gap-2">
                                                <input
                                                className="form-check-input"
                                                type="checkbox"
                                                />
                                                <label className="form-check-label">Write</label>
                                            </div>
                                            <div className="form-check form-check-md d-flex align-items-center gap-2">
                                                <input
                                                className="form-check-input"
                                                type="checkbox"
                                                />
                                                <label className="form-check-label">Create</label>
                                            </div>
                                            <div className="form-check form-check-md d-flex align-items-center gap-2">
                                                <input
                                                className="form-check-input"
                                                type="checkbox"
                                                />
                                                <label className="form-check-label">Delete</label>
                                            </div>
                                            </div>
                                            </div> 
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    
                </div>
                <div className="d-flex align-items-center justify-content-end gap-4">

                    <button
                      type="submit"
                      className="btn btn-primary border border-primary-600 text-md px-56 py-1 radius-4"
                    >
                      Save
                    </button>
                </div>
            </form>
        {/* </div>             */}
        </div>
        
    );
};

export default CreateRoleLayer;