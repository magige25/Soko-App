import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://api.bizchain.co.ke/v1/user/register";
const ROLES_URL = "https://api.bizchain.co.ke/v1/roles";
const COUNTRIES_URL = "https://api.bizchain.co.ke/v1/countries";

const AddUsersLayer = ({ onUserAdded }) => {
  const navigate = useNavigate();
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
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setErrors({ submit: "No authentication token found. Please log in." });
        return;
      }

      try {
        const rolesResponse = await axios.get(ROLES_URL, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const rolesData = rolesResponse.data.data || [];
        const rolesArray = Array.isArray(rolesData) ? rolesData : [rolesData];
        setRoles(rolesArray);

        const allModules = [];
        const permissionsMap = {};
        rolesArray.forEach((role) => {
          permissionsMap[role.roleId] = {};
          role.roleModulePermissions.forEach((module) => {
            if (!allModules.some((m) => m.moduleId === module.moduleId)) {
              allModules.push({
                moduleId: module.moduleId,
                name: module.name,
              });
            }
            permissionsMap[role.roleId][module.moduleId] = module.rolePermissions.map((p) => ({
              code: p.code,
              name: p.name || p.code,
              assigned: p.assigned,
            }));
          });
        });
        setModules(allModules);
        setRolePermissions(permissionsMap);

        const countriesResponse = await axios.get(COUNTRIES_URL, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const countryCode = countriesResponse.data.data?.[0]?.code || 'KE';
        setFormData((prev) => ({ ...prev, countryCode }));

      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
        setErrors({ submit: "Failed to load initial data. Using defaults." });
        setRoles([{ roleId: 1, roleName: 'Super Admin' }]);
        setModules([
          { moduleId: 1, name: 'User Management' },
          { moduleId: 2, name: 'Region Management' },
        ]);
        setRolePermissions({
          1: {
            1: [
              { code: 'CRT', name: 'Create', assigned: false },
              { code: 'DLT', name: 'Delete', assigned: false },
              { code: 'RD', name: 'Read', assigned: true },
            ],
            2: [],
          },
        });
        setFormData((prev) => ({ ...prev, countryCode: 'KE' }));
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.roleId && rolePermissions[formData.roleId]) {
      const initialPermissions = [];
      Object.entries(rolePermissions[formData.roleId]).forEach(([moduleId, perms]) => {
        const assignedCodes = perms
          .filter((p) => p.assigned)
          .map((p) => p.code);
        if (assignedCodes.length > 0) {
          initialPermissions.push({
            moduleId: parseInt(moduleId),
            permissionsCodes: assignedCodes,
          });
        }
      });
      setFormData((prev) => ({ ...prev, userPermissions: initialPermissions }));
    }
  }, [formData.roleId, rolePermissions]);

  const validateField = (field, value) => {
    if (!value.trim() && field !== 'userPermissions') {
      switch (field) {
        case 'firstName':
          return 'First Name is required';
        case 'lastName':
          return 'Last Name is required';
        case 'phoneNumber':
          return 'Phone Number is required';
        case 'email':
          return 'Email is required';
        case 'roleId':
          return 'Role is required';
        default:
          return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    }
    if (field === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
      return 'Please enter a valid email address';
    }
    if (field === 'phoneNumber' && value && !/^\+?\d{9,}$/.test(value)) {
      return 'Please enter a valid phone number';
    }
    return '';
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handlePermissionChange = (moduleId, code, checked) => {
    const validPermissions = rolePermissions[formData.roleId]?.[moduleId] || [];
    if (!validPermissions.some((p) => p.code === code)) {
      console.warn(`Permission ${code} not available for module ${moduleId}`);
      return;
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (field !== 'userPermissions') {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      const token = sessionStorage.getItem("token");
      const response = await axios.post(API_URL, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

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

      navigate('/users');
    } catch (error) {
      console.error("Error adding user:", error.response?.data || error.message);
      setErrors({ submit: error.response?.data?.message || "Failed to add user. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const getPermissionOptionsForModule = (moduleId) => {
    return rolePermissions[formData.roleId]?.[moduleId] || [];
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-body">
        {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row gx-3">
            {['firstName', 'lastName'].map((field) => (
              <div className="col-md-6 mb-3" key={field}>
                <label className="form-label fw-semibold text-primary-light mb-2">
                  {field === 'firstName' ? 'First' : 'Last'} Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control radius-8 ${errors[field] ? 'is-invalid' : ''}`}
                  placeholder={`Enter ${field === 'firstName' ? 'First' : 'Last'} Name`}
                  value={formData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                />
                {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
              </div>
            ))}
          </div>

          <div className="row gx-3">
            {[
              { label: 'Phone', type: 'tel', id: 'phoneNumber', placeholder: 'Enter phone number' },
              { label: 'Email', type: 'email', id: 'email', placeholder: 'Enter Email Address', required: true },
            ].map(({ label, type, id, placeholder }) => (
              <div className="col-md-6 mb-3" key={id}>
                <label className="form-label fw-semibold text-primary-light mb-2">
                  {label} <span className="text-danger">*</span>
                </label>
                <input
                  type={type}
                  className={`form-control radius-8 ${errors[id] ? 'is-invalid' : ''}`}
                  id={id}
                  placeholder={placeholder}
                  value={formData[id]}
                  onChange={(e) => handleInputChange(id, e.target.value)}
                />
                {errors[id] && <div className="invalid-feedback">{errors[id]}</div>}
              </div>
            ))}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold text-primary-light mb-2">
              Role <span className="text-danger">*</span>
            </label>
            <select
              className={`form-control rounded-lg form-select pr-4 bg-white ${errors.roleId ? 'is-invalid' : ''}`}
              value={formData.roleId}
              onChange={(e) => handleInputChange('roleId', e.target.value)}
            >
              <option value="" disabled>Select Role</option>
              {roles.map((role) => (
                <option key={role.roleId} value={role.roleId}>
                  {role.roleName}
                </option>
              ))}
            </select>
            {errors.roleId && <div className="invalid-feedback">{errors.roleId}</div>}
          </div>

          {formData.roleId && (
            <div className="mb-3">
              <div className="table-responsive px-0 py-4 fw-medium">
                <table className="table table-borderless mb-2 mt-12">
                  <thead>
                    <tr>
                      <th>Modules</th>
                      <th>Permissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map((module) => {
                      const perms = getPermissionOptionsForModule(module.moduleId);
                      if (perms.length === 0) return null;
                      return (
                        <tr key={module.moduleId}>
                          <td>{module.name}</td>
                          <td>
                            <div className="d-flex flex-row flex-grow-1 gap-2">
                              {perms.map((perm) => (
                                <div className="form-check form-check-md d-flex align-items-center gap-2" key={perm.code}>
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={
                                      formData.userPermissions
                                        .find((p) => p.moduleId === module.moduleId)?.permissionsCodes.includes(perm.code) || false
                                    }
                                    onChange={(e) => handlePermissionChange(module.moduleId, perm.code, e.target.checked)}
                                  />
                                  <label className="form-check-label">{perm.name}</label>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="text-muted mt-3">
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