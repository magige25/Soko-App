import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/spinner.css";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const ResetPasswordLayer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Validate password length
    if (name === "password" && value.length < 5) {
      setPasswordError("Password must be at least 5 characters.");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      toast.error("Please fill in both fields.", { position: "top-right" });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.", { position: "top-right" });
      return;
    }

    setLoading(true);

    try {
      console.log("Sending Request with Payload:", { password: formData.password });
      const response = await axios.post(
        "http://192.168.100.45:8098/v1/auth/reset-password/89a0d2e9-8308-4f5f-a087-43bd5c440a9f", // Update the endpoint as needed
        {
          password: formData.password,
        },
        {
          headers: {
            "APP-KEY": "BCM8WTL9MQU4MJLE",
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data.status.code === 0 && response.status === 200) {
        toast.success("Password reset successful!", { position: "top-right" });
        setTimeout(() => navigate("/sign-in"), 1000);
      } else {
        toast.error("Failed to reset password. Please try again.", { position: "top-right" });
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to reset password. Please check your details.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth bg-base d-flex" style={{ height: "100vh" }}>
      <Toaster position="top-right" />
      <div className="auth-right d-lg-block d-none" style={{ width: "70%", height: "100vh" }}>
        <div className="d-flex align-items-center flex-column h-100 justify-content-center">
          <img
            src="assets/images/auth/auth-img.png"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
      <div
        className="auth-form d-flex flex-column justify-content-center align-items-center"
        style={{ width: "30%", height: "100vh", padding: "0 20px" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <div className="text-center">
            <Link to="/" className="mb-40 max-w-290-px">
              <img
                src="assets/images/logo.png"
                alt=""
                style={{ width: "100%", maxWidth: "200px" }}
              />
            </Link>
            <h5 className="mb-12">Reset Password</h5>
            <p className="mb-32 text-secondary-light" style={{ fontSize: "14px", fontWeight: 600 }}>
              Enter your new password
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            {["password", "confirmPassword"].map((field, index) => (
              <div className="position-relative mb-20" key={field}>
                <div className="icon-field">
                  <span className="icon top-50 translate-middle-y">
                    <Icon icon="solar:lock-password-outline" />
                  </span>
                  <input
                    type={passwordVisibility[field] ? "text" : "password"}
                    className="form-control h-56-px bg-neutral-50 radius-12"
                    placeholder={field === "password" ? "New Password" : "Confirm New Password"}
                    name={field}
                    value={formData[field]}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <span
                  className="toggle-password cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light"
                  style={{ fontSize: "20px" }}
                  onClick={() => togglePasswordVisibility(field)}
                >
                  <Icon icon={passwordVisibility[field] ? "mdi:eye-off" : "mdi:eye"} />
                </span>
                {field === "password" && passwordError && (
                  <div className="text-danger" style={{ fontSize: "12px", marginTop: "5px" }}>
                    {passwordError}
                  </div>
                )}
              </div>
            ))}
            <button
              type="submit"
              className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
              disabled={loading || !formData.password || !formData.confirmPassword || passwordError}
              style={{ padding: "10px 20px", fontSize: "16px" }}
            >
              {loading ? <div className="spinner"></div> : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordLayer;