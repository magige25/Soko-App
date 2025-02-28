import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = "https://api.bizchain.co.ke/v1/user";
const ROL_URL = "https://api.bizchain.co.ke/v1/roles";

const EditUsersLayer = () => {
  const location = useLocation();
  const userId = location.state?.userId
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    roleId: '',
    countryCode: '',
    userPermissions: [],
  });
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      navigate("/users")
    }
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/system/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = response.data.data;

        // Transform userModelModulePermissions to userPermissions format
        const userPermissions = (userData.userModelModulePermissions || []).map(module => ({
          moduleId: module.moduleId,
          permissionsCodes: module.permissions.map(perm => perm.code),
        }));

        setFormData({
          id: userData.id || '',
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phoneNumber: userData.phoneNo || '',
          roleId: userData.role?.id || '',
          countryCode: userData.countryCode || 'KE',
          userPermissions,
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('Failed to fetch user details.');
      }
    };

    const fetchRolesAndModules = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(ROL_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const rolesData = Array.isArray(response.data) ? response.data : response.data.data || [];
        const roleList = rolesData.map(role => ({
          roleId: role.roleId,
          roleName: role.roleName,
        }));
        setRoles(roleList);

        const allModules = [];
        const permissionsMap = {};
        rolesData.forEach((role) => {
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
      } catch (error) {
        console.error('Error fetching roles and modules:', error);
        setError('Failed to fetch roles and modules.');
        setRoles([]);
        setModules([]);
        setRolePermissions({});
      }
    };

    fetchUserData();
    fetchRolesAndModules();
  }, [userId, navigate]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'roleId') {
      // Reset permissions when role changes, similar to AddUsersLayer
      const initialPermissions = [];
      const rolePerms = rolePermissions[value] || {};
      Object.entries(rolePerms).forEach(([moduleId, perms]) => {
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
                ? { ...p, permissionsCodes: [...new Set([...p.permissionsCodes, code])] }
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
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        roleId: parseInt(formData.roleId),
        countryCode: formData.countryCode,
        userPermissions: formData.userPermissions,
      };

      await axios.put(`${API_URL}/register/update/${formData.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/users');
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.response?.data?.message || "Failed to update user.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPermissionOptionsForModule = (moduleId) => {
    return rolePermissions[formData.roleId]?.[moduleId] || [];
  };

  return (
    <div className="page-wrapper">
      <div className="card shadow-sm mt-3" style={{ width: "100%" }}>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {formData.id ? (
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6 mb-3">
                  <label className="form-label">First Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Last Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Phone Number <span className="text-danger">*</span></label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Enter Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email <span className="text-danger">*</span></label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Role <span className="text-danger">*</span></label>
                <select
                  className="form-control"
                  value={formData.roleId || ''}
                  onChange={(e) => handleInputChange('roleId', e.target.value)}
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.roleId} value={role.roleId}>{role.roleName}</option>
                  ))}
                </select>
              </div>
              {formData.roleId && (
                <div className="mb-3">
                  <label className="form-label">Permissions <span className="text-danger">*</span></label>
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead>
                        <tr>
                          <th>Module</th>
                          <th>Permissions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {modules.length > 0 ? (
                          modules.map((module) => {
                            const perms = getPermissionOptionsForModule(module.moduleId);
                            if (perms.length === 0) return null;
                            return (
                              <tr key={module.moduleId}>
                                <td>{module.name}</td>
                                <td>
                                  <div className="d-flex flex-wrap gap-3">
                                    {perms.map((perm) => {
                                      const isChecked = formData.userPermissions
                                        .find((p) => p.moduleId === module.moduleId)?.permissionsCodes.includes(perm.code) || false;
                                      return (
                                        <div key={perm.code} className="form-check" style={{ display: 'flex', alignItems: 'center' }}>
                                          <input
                                            type="checkbox"
                                            className="form-check-input me-2"
                                            checked={isChecked}
                                            onChange={(e) => handlePermissionChange(module.moduleId, perm.code, e.target.checked)}
                                          />
                                          <label className="form-check-label" style={{ marginBottom: 0 }}>{perm.name}</label>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="2">No modules available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
          ) : (
            <p>Loading user details...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditUsersLayer;