import { Icon } from "@iconify/react/dist/iconify.js";
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
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

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

    if (name === "password") {
      if (!value) {
        setPasswordError("Password is required");
      } else if (value.length < 5) {
        setPasswordError("Password must be at least 5 characters");
      } else {
        setPasswordError("");
      }
    }

    if (name === "confirmPassword") {
      if (!value) {
        setConfirmPasswordError("Confirm password is required");
      } else if (value !== formData.password) {
        setConfirmPasswordError("Passwords do not match");
      } else {
        setConfirmPasswordError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      toast.error("Please fill in both password fields", {
        position: "top-right",
        duration: 2000,
      });
      return;
    }

    if (passwordError || confirmPasswordError) {
      console.log("Validation failed:", { passwordError, confirmPasswordError });
      toast.error("Please fix the errors before submitting", {
        position: "top-right",
        duration: 2000,
      });
      return;
    }

    console.log("Attempting password reset with:", formData);
    setLoading(true);

    try {
      console.log("Sending Request with Payload:", { password: formData.password });
      const response = await axios.post(
        "https://biz-system-production.up.railway.app/v1/auth/reset-password/17e6cb85-7fd6-4185-867b-adbd757284e0",
        {
          password: formData.password,
        },
        {
          headers: {
            "APP-KEY": "BCM8WTL9MQU4MJLE",
          },
        }
      );

      console.log("Full API Response:", response);
      console.log("Response Data:", response.data);

      if (response.status === 200 && response.data.status?.code === 0) {
        toast.success("Password reset successful!", {
          position: "top-right",
          duration: 1000,
          icon: "✅",
        });
        setTimeout(() => navigate("/sign-in"), 2000);
      } else {
        toast.error("Failed to reset password. Invalid reset token or server error.", {
          position: "top-right",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Reset Password Error:", error.message, error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to reset password. Please check your reset link.",
        {
          position: "top-right",
          duration: 2000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="auth bg-base d-flex flex-nowrap"
      style={{ height: "100vh", minWidth: "100vw", overflowX: "auto" }}
    >
      <Toaster />
      <div
        className="auth-right d-block"
        style={{ width: "70%", height: "100vh", flexShrink: 0 }}
      >
        <div className="d-flex align-items-center flex-column h-100 justify-content-center">
          <img
            src="assets/images/auth/auth-img.png"
            alt="Reset Password"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
      <div
        className="auth-form d-flex flex-column justify-content-center align-items-center"
        style={{ width: "30%", height: "100vh", padding: "0 20px", flexShrink: 0 }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <div className="text-center">
            <Link to="/" className="mb-40 max-w-290-px">
              <img
                src="assets/images/logo.png"
                alt="Logo"
                style={{ width: "100%", maxWidth: "200px" }}
              />
            </Link>
            <h5 className="mb-12">Reset Password</h5>
            <p
              className="mb-32 text-secondary-light"
              style={{ fontSize: "14px", fontWeight: 600 }}
            >
              Enter your new password
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            {["password", "confirmPassword"].map((field) => (
              <div className="position-relative mb-20" key={field}>
                <div
                  className="icon-field mb-16"
                  style={{
                    position: "relative",
                    height: "56px",
                  }}
                >
                  <span
                    className="icon"
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 1,
                      width: "24px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Icon icon="solar:lock-password-outline" width="20" />
                  </span>
                  <input
                    type={passwordVisibility[field] ? "text" : "password"}
                    className="form-control h-56-px bg-neutral-50 radius-12"
                    placeholder={field === "password" ? "New Password" : "Confirm New Password"}
                    name={field}
                    value={formData[field]}
                    onChange={handlePasswordChange}
                    required
                    style={{
                      paddingLeft: "44px",
                      paddingRight: "44px",
                      height: "100%",
                      position: "relative",
                      zIndex: 0,
                      boxSizing: "border-box",
                    }}
                  />
                  <span
                    className={`cursor-pointer text-secondary-light ${
                      passwordVisibility[field] ? "ri-eye-off-line" : "ri-eye-line"
                    }`}
                    onClick={() => togglePasswordVisibility(field)}
                    aria-label={passwordVisibility[field] ? "Hide password" : "Show password"}
                    title={passwordVisibility[field] ? "Hide password" : "Show password"}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 1,
                      width: "24px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                  </span>
                </div>
                {field === "password" && passwordError && (
                  <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>{passwordError}</p>
                )}
                {field === "confirmPassword" && confirmPasswordError && (
                  <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>{confirmPasswordError}</p>
                )}
              </div>
            ))}
            <button
              type="submit"
              className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
              disabled={
                loading ||
                !formData.password ||
                !formData.confirmPassword ||
                passwordError ||
                confirmPasswordError
              }
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
