import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "https://biz-system-production.up.railway.app/v1/user/register";
const ROLES_URL = "https://biz-system-production.up.railway.app/v1/roles";
const COUNTRIES_URL = "https://biz-system-production.up.railway.app/v1/countries";

const AddUsersLayer = ({ onUserAdded }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    roleId: '',
    countryCode: '',
    userPermissions: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [permissionOptions, setPermissionOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        // Fetch roles and modules
        const rolesResponse = await axios.get(ROLES_URL, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const rolesData = rolesResponse.data.data || [];
        setRoles(Array.isArray(rolesData) ? rolesData : [rolesData]); // Handle single object or array

        // Extract unique modules and permissions from all roles
        const allModules = [];
        const allPermissions = new Set();
        (Array.isArray(rolesData) ? rolesData : [rolesData]).forEach((role) => {
          role.roleModulePermissions.forEach((module) => {
            if (!allModules.some((m) => m.moduleId === module.moduleId)) {
              allModules.push({
                moduleId: module.moduleId,
                name: module.name,
              });
            }
            module.rolePermissions.forEach((perm) => allPermissions.add(perm.code));
          });
        });
        setModules(allModules);
        setPermissionOptions([...allPermissions]);

        // Fetch country code (assuming first country for simplicity)
        const countriesResponse = await axios.get(COUNTRIES_URL, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const countryCode = countriesResponse.data.data?.[0]?.code || 'KE'; // Adjust based on actual response
        setFormData((prev) => ({ ...prev, countryCode }));

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load initial data. Using defaults.");
        setRoles([{ roleId: 1, roleName: 'Super Admin' }]);
        setModules([
          { moduleId: 1, name: 'User Management' },
          { moduleId: 2, name: 'Region Management' },
        ]);
        setPermissionOptions(['CRT', 'DLT', 'RD']);
        setFormData((prev) => ({ ...prev, countryCode: 'KE' }));
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || 
        !formData.phoneNumber.trim() || !formData.roleId || !formData.countryCode) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      console.log("Submitting payload:", formData); // Debug payload
      const response = await axios.post(API_URL, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("API response (Add User):", response.data);

      if (onUserAdded && response.data.data) {
        const newUser = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          role: roles.find((r) => r.roleId === formData.roleId)?.roleName || 'Unknown',
        };
        onUserAdded(newUser);
      }

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        roleId: '',
        countryCode: formData.countryCode,
        userPermissions: [],
      });
      alert("User added successfully!");

    } catch (error) {
      console.error("Error adding user:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to add user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePermissionChange = (moduleId, code, checked) => {
    setFormData((prev) => {
      const existingModule = prev.userPermissions.find((p) => p.moduleId === moduleId);
      if (checked) {
        if (existingModule) {
          return {
            ...prev,
            userPermissions: prev.userPermissions.map((p) =>
              p.moduleId === moduleId
                ? { ...p, permissionsCodes: [...p.permissionsCodes, code] }
                : p
            ),
          };
        } else {
          return {
            ...prev,
            userPermissions: [...prev.userPermissions, { moduleId, permissionsCodes: [code] }],
          };
        }
      } else {
        return {
          ...prev,
          userPermissions: prev.userPermissions
            .map((p) =>
              p.moduleId === moduleId
                ? { ...p, permissionsCodes: p.permissionsCodes.filter((c) => c !== code) }
                : p
            )
            .filter((p) => p.permissionsCodes.length > 0),
        };
      }
    });
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          {/* First Name and Last Name */}
          <div className="row gx-3">
            {['firstName', 'lastName'].map((field) => (
              <div className="col-md-6 mb-3" key={field}>
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  {field === 'firstName' ? 'First' : 'Last'} Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control radius-8"
                  placeholder={`Enter ${field === 'firstName' ? 'First' : 'Last'} Name`}
                  value={formData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>

          {/* Phone and Email */}
          <div className="row gx-3">
            {[
              { label: 'Phone', type: 'tel', id: 'phoneNumber', placeholder: 'Enter phone number' },
              { label: 'Email', type: 'email', id: 'email', placeholder: 'Enter Email Address', required: true },
            ].map(({ label, type, id, placeholder, required }) => (
              <div className="col-md-6 mb-3" key={id}>
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  {label} {required && <span className="text-danger">*</span>}
                </label>
                <input
                  type={type}
                  className="form-control radius-8"
                  id={id}
                  placeholder={placeholder}
                  value={formData[id]}
                  onChange={(e) => handleInputChange(id, e.target.value)}
                  required={required}
                />
              </div>
            ))}
          </div>

          {/* Role */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-primary-light text-sm mb-2">
              Role <span className="text-danger">*</span>
            </label>
            <select
              className="form-control rounded-lg form-select pr-2 bg-white"
              value={formData.roleId}
              onChange={(e) => handleInputChange('roleId', e.target.value)}
              required
            >
              <option value="" disabled>Select Role</option>
              {roles.map((role) => (
                <option key={role.roleId} value={role.roleId}>
                  {role.roleName}
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
                  {modules.map((module) => (
                    <tr key={module.moduleId}>
                      <td>{module.name}</td>
                      <td>
                        <div className="d-flex flex-row flex-grow-1 gap-2">
                          {permissionOptions.map((code) => (
                            <div className="form-check form-check-md d-flex align-items-center gap-2" key={code}>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={
                                  formData.userPermissions
                                    .find((p) => p.moduleId === module.moduleId)?.permissionsCodes.includes(code) || false
                                }
                                onChange={(e) => handlePermissionChange(module.moduleId, code, e.target.checked)}
                              />
                              <label className="form-check-label">{code}</label>
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
            <br />
            Country Code: {formData.countryCode} (Assigned automatically)
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