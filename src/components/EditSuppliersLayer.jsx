import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = "https://api.bizchain.co.ke/v1/suppliers";
const DISBURSEMENT_CRITERIA_API = "https://api.bizchain.co.ke/v1/disbursement-criteria";
const DISBURSEMENT_METHODS_API = "https://api.bizchain.co.ke/v1/disbursement-methods";
const TRANSPORT_MODE_API = "https://api.bizchain.co.ke/v1/transport-mode";
const SUPPLIER_RESIDENCE_API = "https://api.bizchain.co.ke/v1/supplier-residence";
const PAYMENT_CYCLE_API = "https://api.bizchain.co.ke/v1/payment-cycle";

const EditSuppliersLayer = () => {
  const location = useLocation();
  const supplierId = location.state?.supplierId;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    productionQuantity: "",
    numberCattle: "",
    pendingBills: "",
    unpaidBills: "",
    residence: "",
    paymentMethod: "",
    transportMode: "",
    disbursementCriteria: "",
    disbursementPhoneNumber: "",
    disbursementLitresTarget: "",
    expansionSpace: true,
    expansionCapacity: "",
    contactPersonName: "",
    contactPersonPhoneNumber: "",
    paymentCycle: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [disbursementCriteria, setDisbursementCriteria] = useState([]);
  const [disbursementMethods, setDisbursementMethods] = useState([]);
  const [transportModes, setTransportModes] = useState([]);
  const [residences, setResidences] = useState([]);
  const [paymentCycles, setPaymentCycles] = useState([]);

  useEffect(() => {
    if (!supplierId) {
      toast.error("No supplier ID provided. Redirecting...");
      setTimeout(() => navigate("/suppliers"), 1500);
      return;
    }

    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      try {
        const [supplierRes, criteriaRes, methodsRes, modesRes, residencesRes, paymentCyclesRes] = await Promise.all([
          axios.get(`${API_URL}/${supplierId}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(DISBURSEMENT_CRITERIA_API, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(DISBURSEMENT_METHODS_API, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(TRANSPORT_MODE_API, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(SUPPLIER_RESIDENCE_API, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(PAYMENT_CYCLE_API, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (supplierRes.data.status.code === 0) {
          const supplier = supplierRes.data.data;
          setFormData({
            id: supplier.id,
            firstName: supplier.firstName,
            lastName: supplier.lastName,
            phoneNumber: supplier.phoneNumber,
            productionQuantity: supplier.productionQuantity,
            numberCattle: supplier.numberCattle,
            pendingBills: supplier.pendingBills,
            unpaidBills: supplier.unpaidBills,
            residence: supplier.supplierResidence.name,
            paymentMethod: supplier.disbursementMethod.name,
            transportMode: supplier.transportMode.name,
            disbursementCriteria: supplier.disbursementCriteria?.name || "",
            disbursementPhoneNumber: supplier.disbursementPhoneNumber || "",
            disbursementLitresTarget: supplier.disbursementLitresTarget || "",
            expansionSpace: supplier.expansionSpace,
            expansionCapacity: supplier.expansionCapacity,
            contactPersonName: supplier.contactPersonName || "",
            contactPersonPhoneNumber: supplier.contactPersonPhoneNumber || "",
            paymentCycle: supplier.paymentCycle?.code || "", 
          });
        }
        if (criteriaRes.data.status.code === 0) setDisbursementCriteria(criteriaRes.data.data);
        if (methodsRes.data.status.code === 0) setDisbursementMethods(methodsRes.data.data);
        if (modesRes.data.status.code === 0) setTransportModes(modesRes.data.data);
        if (residencesRes.data.status.code === 0) setResidences(residencesRes.data.data);
        if (paymentCyclesRes.data.status.code === 0) setPaymentCycles(paymentCyclesRes.data.data);
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
        toast.error("Failed to load supplier data. Please try again.");
      }
    };
    fetchData();
  }, [supplierId, navigate]);

  const validateField = (field, value) => {
    const errors = {};

    if (field === "pendingBills" || field === "unpaidBills") return errors;

    if (typeof value === "string" && !value.trim()) {
      if (field === "expansionCapacity" && !formData.expansionSpace) return errors;
      if (field === "disbursementPhoneNumber" && disbursementMethods.find(m => m.name === formData.paymentMethod)?.code !== "MPS") return errors;
      if (field === "disbursementLitresTarget" && disbursementCriteria.find(c => c.name === formData.disbursementCriteria)?.name !== "Litres") return errors;
      if (field === "paymentCycle" && disbursementCriteria.find(c => c.name === formData.disbursementCriteria)?.name !== "Time") return errors;

      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")} is required`;
      return errors;
    }

    if ((field === "phoneNumber" || field === "contactPersonPhoneNumber" || field === "disbursementPhoneNumber") && value) {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length < 9) {
        errors[field] = "Please enter a valid phone number (at least 9 digits)";
      }
      if (value.startsWith("+254") && digitsOnly.length !== 12) {
        errors[field] = "Phone number with +254 must be 12 digits long (e.g., +254796543648)";
      }
      if (value.startsWith("0") && digitsOnly.length !== 10) {
        errors[field] = "Phone number starting with 0 must be 10 digits long (e.g., 0796543648)";
      }
    }

    if ((field === "productionQuantity" || field === "numberCattle" || field === "disbursementLitresTarget" || field === "expansionCapacity") && value) {
      if (isNaN(value)) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")} must be a number`;
      } else if (parseFloat(value) < 0) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")} cannot be negative`;
      }
    }

    return errors;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const fieldErrors = validateField(field, value);
    setErrors((prev) => {
      if (Object.keys(fieldErrors).length === 0) {
        const { [field]: _, ...remainingErrors } = prev;
        return remainingErrors;
      }
      return {
        ...prev,
        ...fieldErrors,
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "firstName", "lastName", "phoneNumber", "productionQuantity",
      "numberCattle", "residence", "paymentMethod", "transportMode",
      "disbursementCriteria", "contactPersonName", "contactPersonPhoneNumber"
    ];

    requiredFields.forEach(field => {
      Object.assign(newErrors, validateField(field, formData[field]));
    });

    if (formData.expansionSpace && formData.expansionCapacity) {
      Object.assign(newErrors, validateField("expansionCapacity", formData.expansionCapacity));
    }

    if (disbursementCriteria.find(c => c.name === formData.disbursementCriteria)?.name === "Litres") {
      Object.assign(newErrors, validateField("disbursementLitresTarget", formData.disbursementLitresTarget));
    }

    if (disbursementCriteria.find(c => c.name === formData.disbursementCriteria)?.name === "Time") {
      Object.assign(newErrors, validateField("paymentCycle", formData.paymentCycle));
    }

    if (disbursementMethods.find(m => m.name === formData.paymentMethod)?.code === "MPS") {
      Object.assign(newErrors, validateField("disbursementPhoneNumber", formData.disbursementPhoneNumber));
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error("Please fix all errors before submitting");
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      let phoneNumber = formData.phoneNumber;
      if (phoneNumber.startsWith("+254")) phoneNumber = phoneNumber.replace("+254", "0");
      else if (!phoneNumber.startsWith("0")) phoneNumber = `0${phoneNumber}`;

      let contactPhoneNumber = formData.contactPersonPhoneNumber;
      if (contactPhoneNumber.startsWith("+254")) contactPhoneNumber = contactPhoneNumber.replace("+254", "0");
      else if (!contactPhoneNumber.startsWith("0")) contactPhoneNumber = `0${contactPhoneNumber}`;

      let disbursementPhoneNumber = formData.disbursementPhoneNumber;
      if (disbursementPhoneNumber && disbursementPhoneNumber.startsWith("+254"))
        disbursementPhoneNumber = disbursementPhoneNumber.replace("+254", "0");
      else if (disbursementPhoneNumber && !disbursementPhoneNumber.startsWith("0"))
        disbursementPhoneNumber = `0${disbursementPhoneNumber}`;

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: phoneNumber,
        productionQuantity: parseFloat(formData.productionQuantity) || 0,
        numberCattle: parseInt(formData.numberCattle, 10) || 0,
        supplierResidence: residences.find(r => r.name === formData.residence)?.id || 1,
        disbursementMethod: disbursementMethods.find(m => m.name === formData.paymentMethod)?.code || "CSH",
        transportMode: transportModes.find(m => m.name === formData.transportMode)?.code || "WKG",
        expansionSpace: formData.expansionSpace,
        expansionCapacity: parseInt(formData.expansionCapacity, 10) || 0,
        contactPersonName: formData.contactPersonName,
        contactPersonPhoneNumber: contactPhoneNumber,
        disbursementCriteria: disbursementCriteria.find(c => c.name === formData.disbursementCriteria)?.code || "TM",
        ...(disbursementCriteria.find(c => c.name === formData.disbursementCriteria)?.name === "Litres" && {
          disbursementLitresTarget: parseFloat(formData.disbursementLitresTarget) || 0,
        }),
        paymentCycle: formData.paymentCycle,
        ...(disbursementMethods.find(m => m.name === formData.paymentMethod)?.code === "MPS" && {
          disbursementPhoneNumber: disbursementPhoneNumber,
        }),
      };

      const response = await axios.put(`${API_URL}/${formData.id}`, payload, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data.status?.code === 0) {
        toast.success("Supplier updated successfully!");
        setTimeout(() => navigate("/suppliers"), 1500);
      } else {
        throw new Error("Unexpected server response");
      }
    } catch (error) {
      console.error("Error updating supplier:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || error.message || "Failed to update supplier");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row gx-3">
            {/* First Column */}
            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                First Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control radius-8 ${errors.firstName ? "is-invalid" : ""}`}
                placeholder="Enter First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
              {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                Phone Number <span className="text-danger">*</span>
              </label>
              <input
                type="tel"
                className={`form-control radius-8 ${errors.phoneNumber ? "is-invalid" : ""}`}
                placeholder="Enter Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              />
              {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                Production Quantity (Litres) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className={`form-control radius-8 ${errors.productionQuantity ? "is-invalid" : ""}`}
                placeholder="Enter Production Quantity"
                value={formData.productionQuantity}
                onChange={(e) => handleInputChange("productionQuantity", e.target.value)}
              />
              {errors.productionQuantity && <div className="invalid-feedback">{errors.productionQuantity}</div>}
            </div>

            {/* Second Column */}
            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                Last Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control radius-8 ${errors.lastName ? "is-invalid" : ""}`}
                placeholder="Enter Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
              {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                Number of Cattle <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className={`form-control radius-8 ${errors.numberCattle ? "is-invalid" : ""}`}
                placeholder="Enter Number of Cattle"
                value={formData.numberCattle}
                onChange={(e) => handleInputChange("numberCattle", e.target.value)}
              />
              {errors.numberCattle && <div className="invalid-feedback">{errors.numberCattle}</div>}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                Residence <span className="text-danger">*</span>
              </label>
              <select
                className={`form-control radius-8 form-select ${errors.residence ? "is-invalid" : ""}`}
                value={formData.residence}
                onChange={(e) => handleInputChange("residence", e.target.value)}
              >
                <option value="">Select Residence</option>
                {residences.map((residence) => (
                  <option key={residence.id} value={residence.name}>
                    {residence.name}
                  </option>
                ))}
              </select>
              {errors.residence && <div className="invalid-feedback">{errors.residence}</div>}
            </div>

            {/* Third Column */}
            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                Payment Method <span className="text-danger">*</span>
              </label>
              <select
                className={`form-control radius-8 form-select ${errors.paymentMethod ? "is-invalid" : ""}`}
                value={formData.paymentMethod}
                onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
              >
                <option value="">Select Payment Method</option>
                {disbursementMethods.map((method) => (
                  <option key={method.code} value={method.name}>
                    {method.name}
                  </option>
                ))}
              </select>
              {errors.paymentMethod && <div className="invalid-feedback">{errors.paymentMethod}</div>}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                Transport Mode <span className="text-danger">*</span>
              </label>
              <select
                className={`form-control radius-8 form-select ${errors.transportMode ? "is-invalid" : ""}`}
                value={formData.transportMode}
                onChange={(e) => handleInputChange("transportMode", e.target.value)}
              >
                <option value="">Select Transport Mode</option>
                {transportModes.map((mode) => (
                  <option key={mode.code} value={mode.name}>
                    {mode.name}
                  </option>
                ))}
              </select>
              {errors.transportMode && <div className="invalid-feedback">{errors.transportMode}</div>}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                Disbursement Criteria <span className="text-danger">*</span>
              </label>
              <select
                className={`form-control radius-8 form-select ${errors.disbursementCriteria ? "is-invalid" : ""}`}
                value={formData.disbursementCriteria}
                onChange={(e) => handleInputChange("disbursementCriteria", e.target.value)}
              >
                <option value="">Select Disbursement Criteria</option>
                {disbursementCriteria.map((criteria) => (
                  <option key={criteria.code} value={criteria.name}>
                    {criteria.name}
                  </option>
                ))}
              </select>
              {errors.disbursementCriteria && <div className="invalid-feedback">{errors.disbursementCriteria}</div>}
            </div>

            {/* Additional Fields */}
            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                Contact Person Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control radius-8 ${errors.contactPersonName ? "is-invalid" : ""}`}
                placeholder="Enter Contact Person Name"
                value={formData.contactPersonName}
                onChange={(e) => handleInputChange("contactPersonName", e.target.value)}
              />
              {errors.contactPersonName && <div className="invalid-feedback">{errors.contactPersonName}</div>}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                Contact Person Phone <span className="text-danger">*</span>
              </label>
              <input
                type="tel"
                className={`form-control radius-8 ${errors.contactPersonPhoneNumber ? "is-invalid" : ""}`}
                placeholder="Enter Contact Phone"
                value={formData.contactPersonPhoneNumber}
                onChange={(e) => handleInputChange("contactPersonPhoneNumber", e.target.value)}
              />
              {errors.contactPersonPhoneNumber && <div className="invalid-feedback">{errors.contactPersonPhoneNumber}</div>}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                Has Expansion Space
              </label>
              <div 
                className="form-control radius-4 d-flex align-items-center"
                style={{ border: 'none', background: 'transparent', height: '38px', padding: '0' }}
              >
                <input
                  type="checkbox"
                  className="form-check-input style-check border me-2" style={{ width: "24px", height: "24px" }}
                  id="expansionSpace"
                  checked={formData.expansionSpace}
                  onChange={(e) => handleInputChange("expansionSpace", e.target.checked)}
                />
                <label className="form-check-label text-primary-light" htmlFor="expansionSpace" style={{ cursor: 'pointer' }}></label>
              </div>
            </div>

            {/* Conditional Fields */}
            {disbursementCriteria.find(c => c.name === formData.disbursementCriteria)?.name === "Litres" && (
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  Disbursement Litres Target <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className={`form-control radius-8 ${errors.disbursementLitresTarget ? "is-invalid" : ""}`}
                  placeholder="Enter Litres Target"
                  value={formData.disbursementLitresTarget}
                  onChange={(e) => handleInputChange("disbursementLitresTarget", e.target.value)}
                />
                {errors.disbursementLitresTarget && <div className="invalid-feedback">{errors.disbursementLitresTarget}</div>}
              </div>
            )}

            {disbursementCriteria.find(c => c.name === formData.disbursementCriteria)?.name === "Time" && (
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  Payment Cycle <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-control radius-8 form-select ${errors.paymentCycle ? "is-invalid" : ""}`}
                  value={formData.paymentCycle}
                  onChange={(e) => handleInputChange("paymentCycle", e.target.value)}
                >
                  <option value="">Select Payment Cycle</option>
                  {paymentCycles.map((cycle) => (
                    <option key={cycle.code} value={cycle.code}>
                      {cycle.name}
                    </option>
                  ))}
                </select>
                {errors.paymentCycle && <div className="invalid-feedback">{errors.paymentCycle}</div>}
              </div>
            )}

            {disbursementMethods.find(m => m.name === formData.paymentMethod)?.code === "MPS" && (
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  Disbursement Phone <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  className={`form-control radius-8 ${errors.disbursementPhoneNumber ? "is-invalid" : ""}`}
                  placeholder="Enter Disbursement Phone"
                  value={formData.disbursementPhoneNumber}
                  onChange={(e) => handleInputChange("disbursementPhoneNumber", e.target.value)}
                />
                {errors.disbursementPhoneNumber && <div className="invalid-feedback">{errors.disbursementPhoneNumber}</div>}
              </div>
            )}

            {formData.expansionSpace && (
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                  Expansion Capacity
                </label>
                <input
                  type="number"
                  className={`form-control radius-8 ${errors.expansionCapacity ? "is-invalid" : ""}`}
                  placeholder="Enter Expansion Capacity"
                  value={formData.expansionCapacity}
                  onChange={(e) => handleInputChange("expansionCapacity", e.target.value)}
                />
                {errors.expansionCapacity && <div className="invalid-feedback">{errors.expansionCapacity}</div>}
              </div>
            )}

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                Pending Bills
              </label>
              <input
                type="number"
                className={`form-control radius-8 ${errors.pendingBills ? "is-invalid" : ""}`}
                placeholder="Enter Pending Bills"
                value={formData.pendingBills}
                onChange={(e) => handleInputChange("pendingBills", e.target.value)}
              />
              {errors.pendingBills && <div className="invalid-feedback">{errors.pendingBills}</div>}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                Unpaid Bills
              </label>
              <input
                type="number"
                className={`form-control radius-8 ${errors.unpaidBills ? "is-invalid" : ""}`}
                placeholder="Enter Unpaid Bills"
                value={formData.unpaidBills}
                onChange={(e) => handleInputChange("unpaidBills", e.target.value)}
              />
              {errors.unpaidBills && <div className="invalid-feedback">{errors.unpaidBills}</div>}
            </div>
          </div>

          <div className="text-muted small mt-4 mb-3">
            Fields marked with <span className="text-danger">*</span> are required.
          </div>

          <div className="mt-4 d-flex justify-content-end gap-2">
            <button 
              type="submit" 
              className="btn btn-primary px-12" 
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

export default EditSuppliersLayer;