import React, { useState } from 'react';
import axios from 'axios';

const API_URL = "http://192.168.100.45:8092/v1/user/register/update/2";

const AddUsersLayer = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    roleId: '',
    userPermissions: {
      'User Management': { View: false, Write: false, Create: false, Delete: false },
      'Financial Management': { View: false, Write: false, Create: false, Delete: false },
      'Order Management': { View: false, Write: false, Create: false, Delete: false },
      'Stock Management': { View: false, Write: false, Create: false, Delete: false },
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.roleId.trim()) {
      alert("Please fill in all required fields before saving.");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(API_URL, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      console.log("API response (Add User):", response.data);

      // Assuming you want to update a list of users
      // setUsers((prevUsers) => [...prevUsers, { ...response.data.data }]);

      setFormData({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        roleId: '',
        userPermissions: {
          'User Management': { View: false, Write: false, Create: false, Delete: false },
          'Financial Management': { View: false, Write: false, Create: false, Delete: false },
          'Order Management': { View: false, Write: false, Create: false, Delete: false },
          'Stock Management': { View: false, Write: false, Create: false, Delete: false },
        },
      });

    } catch (error) {
      console.log("Error adding user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {/* First Name and Last Name */}
          <div className="row gx-3">
            {['First Name', 'Last Name'].map((label, index) => (
              <div className="col-md-6 mb-3" key={index}>
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  {label} <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control radius-8"
                  placeholder={`Enter ${label}`}
                  value={formData[label.toLowerCase().replace(' ', '')]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [label.toLowerCase().replace(' ', '')]: e.target.value,
                    })
                  }
                  required
                />
              </div>
            ))}
          </div>

          {/* Phone and Email */}
          <div className="row gx-3">
            {[
              { label: 'Phone', 
                type: 'tel', 
                id: 'phone', 
                placeholder: 'Enter phone number' 
            },

              { label: 'Email', 
                type: 'email', id: 'email', 
                placeholder: 'Enter Email Address', 
                required: true 
            },
            ].map(({ label, type, id, placeholder, required }, index) => (
              <div className="col-md-6 mb-3" key={index}>
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  {label} {required && <span className="text-danger">*</span>}
                </label>
                <input
                  type={type}
                  className="form-control radius-8"
                  id={id}
                  placeholder={placeholder}
                  value={formData[id]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [id]: e.target.value,
                    })
                  }
                  required={required}
                />
              </div>
            ))}
          </div>

          {/* Role Dropdown */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-primary-light text-sm mb-2">
              Role <span className="text-danger">*</span>
            </label>
            <select
             className="form-control rounded-lg form-select pr-2 bg-white" style={{ width: "200px"}}
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  roleId: e.target.value,
                })
              }
              required
            >
              <option value="" disabled selected>
                Select Role
              </option>
              {['Sales Person', 'Manager', 'Customer', 'Distributor'].map((role) => (
                <option key={role} value={role.toLowerCase()}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Permissions Table */}
          <div className="mb-3">
            <div className="table-responsive px-0 py-4 fw-medium text-sm">
              <table className="table table-borderless mb-2 mt-12">
                <thead>
                  <tr>
                    <th>Modules</th>
                    <th>Permissions</th>
                  </tr>
                </thead>
                <tbody>
                  {['User Management', 'Financial Management', 'Order Management', 'Stock Management'].map((module) => (
                    <tr key={module}>
                      <td>{module}</td>
                      <td>
                        <div className="d-flex flex-row flex-grow-1 gap-2">
                          {['View', 'Write', 'Create', 'Delete'].map((perm) => (
                            <div className="form-check form-check-md d-flex align-items-center gap-2" key={perm}>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={formData.permissions?.[module]?.[perm]}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    permissions: {
                                      ...formData.permissions,
                                      [module]: {
                                        ...formData.permissions?.[module],
                                        [perm]: e.target.checked,
                                      },
                                    },
                                  })
                                }
                              />
                              <label className="form-check-label">{perm}</label>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-muted small mt-3">
            Fields marked with <span className="text-danger">*</span> are required.
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUsersLayer;