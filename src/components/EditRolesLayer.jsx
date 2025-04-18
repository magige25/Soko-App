import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const ROLES_API_URL = "https://api.bizchain.co.ke/v1/roles";
const MODULES_API_URL = "https://api.bizchain.co.ke/v1/module-permission";
const ENTITY_TYPES_API_URL = "https://api.bizchain.co.ke/v1/entity-types";

const EditRolesLayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = location.state || {};

  const [formData, setFormData] = useState({
    roleId: role?.roleId || "",
    name: role?.roleName || "",
    entityType: role?.entityType?.code || "",
    modulePermissions: {},
  });
  const [entityTypes, setEntityTypes] = useState([]);
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      try {
        const entityTypesRes = await axios.get(ENTITY_TYPES_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEntityTypes(entityTypesRes.data.data || []);
      } catch (err) {
        console.error("Error fetching entity types:", err);
        toast.error("Failed to load entity types. Please try again.");
      }
    };
    fetchData();

    // Pre-populate module permissions from the passed role
    if (role?.roleModulePermissions) {
      const modulePermissions = {};
      role.roleModulePermissions.forEach((mod) => {
        const assigned = mod.rolePermissions.filter((perm) => perm.assigned).map((perm) => perm.code);
        modulePermissions[mod.moduleId] = assigned;
      });
      setFormData((prev) => ({ ...prev, modulePermissions }));
    }
  }, [role, navigate]);

  useEffect(() => {
    const fetchModules = async () => {
      if (!formData.entityType) {
        setModules([]);
        return;
      }
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${MODULES_API_URL}?entityType=${formData.entityType}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const processedModules = response.data.data.map((module) => ({
          ...module,
          rolePermissions: module.rolePermissions || [],
        }));
        setModules(processedModules);
      } catch (error) {
        console.error("Error fetching modules:", error);
        toast.error("Failed to load modules. Please try again.");
        setModules([]);
      }
    };
    fetchModules();
  }, [formData.entityType]);

  const validateField = (field, value) => {
    if (typeof value === "string" && !value.trim()) {
      return `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")} is required`;
    }
    return "";
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    const error = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleCheckboxChange = (moduleId, permissionCode, checked) => {
    const updatedModules = { ...formData.modulePermissions };
    if (!updatedModules[moduleId]) updatedModules[moduleId] = [];
    if (checked) {
      if (!updatedModules[moduleId].includes(permissionCode)) {
        updatedModules[moduleId].push(permissionCode);
      }
    } else {
      updatedModules[moduleId] = updatedModules[moduleId].filter((p) => p !== permissionCode);
    }
    setFormData((prev) => ({ ...prev, modulePermissions: updatedModules }));
  };

  const buildModulePermissionsPayload = () => {
    return Object.entries(formData.modulePermissions)
      .filter(([_, perms]) => perms && perms.length > 0)
      .map(([moduleId, perms]) => ({
        moduleId: Number(moduleId),
        permissions: perms,
      }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    ["name", "entityType"].forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Object.values(newErrors).forEach((error) => {
        if (error) toast.error(error);
      });
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const payload = {
        name: formData.name,
        entityType: formData.entityType,
        modulePermissions: buildModulePermissionsPayload(),
      };

      const response = await axios.put(`${ROLES_API_URL}/${formData.roleId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status?.code === 0 || response.data.data) {
        toast.success("Role updated successfully!");
        setTimeout(() => navigate("/roles"), 1500);
      } else {
        throw new Error("Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error(error.response?.data?.message || "Failed to update role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!role) {
    return (
      <div className="card h-100 p-0 radius-12">
        <div className="card-body-table p-24">
          <p>No role selected for editing. Please go back to the roles list.</p>
          <button className="btn btn-primary" onClick={() => navigate("/roles")}>
            Back to Roles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-100 p-0 radius-12">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          success: { style: { background: "#d4edda", color: "#155724" } },
          error: { style: { background: "#f8d7da", color: "#721c24" } },
        }}
      />
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row gx-3">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                Role Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control radius-4 ${errors.name ? "is-invalid" : ""}`}
                placeholder="Enter Role Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                Entity Type <span className="text-danger">*</span>
              </label>
              <select
                className={`form-control radius-4 form-select ${errors.entityType ? "is-invalid" : ""}`}
                value={formData.entityType}
                onChange={(e) => handleInputChange("entityType", e.target.value)}
              >
                <option value="">Select Entity Type</option>
                {entityTypes.map((et) => (
                  <option key={et.code} value={et.code}>
                    {et.name}
                  </option>
                ))}
              </select>
              {errors.entityType && <div className="invalid-feedback">{errors.entityType}</div>}
            </div>
          </div>

          {formData.entityType && (
            <div className="mb-3">
              <h6 className="fs-6">Modules and Permissions</h6>
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th style={{ width: "40%" }}>Module</th>
                    <th>Permissions</th>
                  </tr>
                </thead>
                <tbody>
                  {modules
                    .filter((module) => module.permissions && module.permissions.length > 0)
                    .map((module) => (
                      <tr key={module.moduleId}>
                        <td>{module.name}</td>
                        <td>
                          {module.permissions.map((perm) => (
                            <div className="form-check style-check form-check-inline" key={perm.code}>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id={`edit-${module.moduleId}-${perm.code}`}
                                checked={
                                  formData.modulePermissions[module.moduleId]?.includes(perm.code) || false
                                }
                                onChange={(e) =>
                                  handleCheckboxChange(module.moduleId, perm.code, e.target.checked)
                                }
                              />
                              <label
                                htmlFor={`edit-${module.moduleId}-${perm.code}`}
                                className="form-check-label"
                                style={{ marginLeft: "0.25rem" }}
                              >
                                {perm.name}
                              </label>
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="text-muted small mt-4 mb-3">
            Fields marked with <span className="text-danger">*</span> are required.
          </div>

          <div className="mt-4 d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-secondary px-12"
              onClick={() => navigate("/roles")}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary px-12" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRolesLayer;