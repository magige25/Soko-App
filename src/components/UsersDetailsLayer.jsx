import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = "https://api.bizchain.co.ke/v1/user";
const ROL_URL = "https://api.bizchain.co.ke/v1/roles";

const UsersDetailsLayer = () => {
  const { userId } = useParams();
  const [userToView, setUserToView] = useState(null);
  const [rolePermissions, setRolePermissions] = useState({});
  const [modules, setModules] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/system/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = response.data.data;
        setUserToView(userData);
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
        setModules([]);
        setRolePermissions({});
      }
    };

    fetchUserData();
    fetchRolesAndModules();
  }, [userId]); // Only userId is a dependency

  const getPermissionOptionsForModule = (moduleId) => {
    return rolePermissions[userToView?.role?.id]?.[moduleId] || [];
  };

  return (
    <div className="page-wrapper">
      <div className="card shadow-sm mt-3" style={{ width: "100%" }}>
        <div className="card-body">
          <h6 className="mb-4">User Details</h6>
          {error && <div className="alert alert-danger">{error}</div>}
          {userToView ? (
            <div>
              <p className="mb-2"><strong>ID:</strong> {userToView.id}</p>
              <p className="mb-2"><strong>First Name:</strong> {userToView.firstName || 'N/A'}</p>
              <p className="mb-2"><strong>Last Name:</strong> {userToView.lastName || 'N/A'}</p>
              <p className="mb-2"><strong>Email:</strong> {userToView.email || 'N/A'}</p>
              <p className="mb-2"><strong>Phone Number:</strong> {userToView.phoneNo || 'N/A'}</p>
              <p className="mb-2"><strong>Role:</strong> {userToView.role?.name || 'N/A'}</p>
              <p className="mb-2"><strong>Status:</strong> {userToView.status || 'N/A'}</p>
              <p className="mb-2"><strong>Country Code:</strong> {userToView.countryCode || 'N/A'}</p>

              <div className="mt-4">
                <h6 className="mb-3">Module Permissions</h6>
                {userToView.userModelModulePermissions && userToView.userModelModulePermissions.length > 0 ? (
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Module</th>
                        <th>Permissions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userToView.userModelModulePermissions.map((module) => {
                        const rolePerms = getPermissionOptionsForModule(module.moduleId);
                        const activePerms = module.permissions.map(p => p.code);
                        const permissionsList = rolePerms.map(perm => ({
                          name: perm.name,
                          active: activePerms.includes(perm.code),
                        }));

                        return (
                          <tr key={module.moduleId}>
                            <td>{module.moduleName || modules.find(m => m.moduleId === module.moduleId)?.name || 'Unknown Module'}</td>
                            <td>
                              {permissionsList.length > 0 ? (
                                permissionsList.map((perm, index) => (
                                  <span key={index} className={perm.active ? 'text-success' : 'text-muted'}>
                                    {perm.name}{perm.active ? '' : ' (Inactive)'}{index < permissionsList.length - 1 ? ', ' : ''}
                                  </span>
                                ))
                              ) : (
                                'No permissions assigned'
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p>No module permissions assigned to this user.</p>
                )}
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <Link to="/users" className="btn btn-primary">Back</Link>
              </div>
            </div>
          ) : (
            <p>Loading user details...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersDetailsLayer;