import React from 'react';

const AddUsersLayer = () => {
  return (
    <div className="card h-100 p-0 radius-12">
        <div className="card-body">
           
                <form>
                  {/* Names */}
                  <div className="row gx-3">
                    <div className="col-md-6 mb-20">
                        <label htmlFor="name" className="form-label fw-semibold text-primary-light text-sm mb-8">
                            First Name <span className="text-danger-600">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control radius-8"
                            id="name"
                            placeholder="Enter First Name"
                        />
                    </div>
                    <div className="col-md-6 mb-20">
                        <label htmlFor="email" className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Last Name <span className="text-danger-600">*</span>
                        </label>
                        <input
                        type="text"
                        className="form-control radius-8"
                        id="name"
                        placeholder="Enter Last Name"
                        />
                    </div>
                    </div>

                  {/* Phone & Department */}
                <div className="row gx-3">
                    <div className="col-md-6 mb-20">
                        <label htmlFor="number" className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Phone
                        </label>
                        <input
                            type="tel"
                            className="form-control radius-8"
                            id="number"
                            placeholder="Enter phone number"
                        />
                    </div>
                    <div className="col-md-6 mb-20">
                        <label htmlFor="depart" className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Email 
                        <span className="text-danger-600">*</span>
                        </label>
                        <input
                        type="email"
                        className="form-control radius-8"
                        id="email"
                        placeholder="Enter Email Address"
                        />
                    </div>
                </div>

                  {/* Role Dropdown */}
                <div className="col-md-6 relative w-full">
                    <label htmlFor="role" className="form-label fw-semibold text-primary-light text-sm mb-2">
                        Role <span className="text-danger-600">*</span>
                    </label>
                    <select
    //w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light bg-white
                    className="form-control w-full radius-6 form-select pr-20 bg-white appearance-none " 
                    id="role">
                        <option value="" disabled selected>
                            Select Role
                            </option>
                        <option value="sales">Sales Person</option>
                        <option value="manager">Manager</option>
                        <option value="customer">Customer</option>
                        <option value="distributor">Distributor</option>
                        </select>
                        <div className="absolute right-4 top-1/2 pointer-events-none">

                        </div>
                </div>

                  {/* Permissions Table */}
                {/* <div className="col-md-12 "> */}
                    {/* <div className="card"> */}
                        {/* <div className="card-body p-2"> */}
                            <div className="table-responsive px-0 py-4 fw-medium text-sm">
                                <table className="table table-borderless mb-2 mt-12">
                                    <thead>
                                        <tr>
                                            <th>Modules</th>
                                            <th>Permissions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                
                                        <tr>
                                            <td>
                                                User Management                                                
                                            </td>
                                            <td>
                                                    <div className="d-flex align-items-center">
                                                    <div className="d-flex flex-row flex-grow-1 gap-2">
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
                                                    Financial Management
                                                </td>
                                                <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="d-flex flex-row flex-grow-1 gap-2">
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
                                                Order Management
                                                </td>
                                                <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="d-flex flex-row flex-grow-1 gap-2">
                                                    <div className="form-check form-check-md d-flex align-items-center gap-2 gap-2">
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
                                                    {/* JUST INCASE "fs-14 fw-normal text-light-9" */}
                                                        Stock Management
                                                </td>
                                                <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="d-flex flex-row flex-grow-1 gap-2">
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
                        {/* </div> */}
                    {/* </div>*/}
                

                  <div className="d-flex align-items-end justify-content-end gap-3">

                    <button
                      type="submit"
                      className="btn btn-primary border border-primary-600 text-md px-56 py-2 radius-5"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
  );
};

export default AddUsersLayer;