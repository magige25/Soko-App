import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        autoClose: 2000,
      });
      return;
    }

    if (passwordError || confirmPasswordError) {
      console.log("Validation failed:", { passwordError, confirmPasswordError });
      toast.error("Please fix the errors before submitting", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    if (!navigator.onLine) {
      toast.error("No network connection. Please check your internet.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    console.log("Attempting password reset with:", formData);
    setLoading(true);

    try {
      console.log("Sending Request with Payload:", { password: formData.password });
      const response = await axios.post(
        "https://api.bizchain.co.ke/v1/auth/reset-password/17e6cb85-7fd6-4185-867b-adbd757284e0",
        {
          password: formData.password,
        },
        {
          headers: {
            "APP-KEY": "BCM8WTL9MQU4MJLE",
          },
          timeout: 10000, // 10-second timeout
        }
      );

      console.log("Full API Response:", response);
      console.log("Response Data:", response.data);

      if (response.status === 200 && response.data.status?.code === 0) {
        toast.success("Password reset successful!", {
          position: "top-right",
          autoClose: 2000,
        });
        setTimeout(() => navigate("/sign-in"), 2000);
      } else {
        toast.error(
          response.data?.status?.message || "Failed to reset password. Invalid reset token or server error.",
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
      }
    } catch (error) {
      console.error("Reset Password Error:", error.message, error.response?.data);
      
      if (!navigator.onLine) {
        toast.error("Network disconnected. Please check your connection.", {
          position: "top-right",
          autoClose: 2000,
        });
      } else if (error.code === "ECONNABORTED") {
        toast.error("Request timed out. Please check your network.", {
          position: "top-right",
          autoClose: 2000,
        });
      } else if (error.response) {
        if (error.response.status === 400) {
          toast.error("Invalid password format. Please try again.", {
            position: "top-right",
            autoClose: 2000,
          });
        } else if (error.response.status === 404) {
          toast.error("Reset token not found. Please request a new link.", {
            position: "top-right",
            autoClose: 2000,
          });
        } else if (error.response.status === 403) {
          toast.error("Access forbidden. Contact support.", {
            position: "top-right",
            autoClose: 2000,
          });
        } else if (error.response.status >= 500) {
          toast.error("Server error. Please try again later.", {
            position: "top-right",
            autoClose: 2000,
          });
        } else {
          toast.error(
            error.response?.data?.status?.message || "Failed to reset password. Please try again.",
            {
              position: "top-right",
              autoClose: 2000,
            }
          );
        }
      } else if (error.request) {
        toast.error("Network error. Unable to reach server.", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        toast.error("An unexpected error occurred.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth bg-base d-flex flex-wrap">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="auth-left d-lg-block d-none">
        <div className="d-flex align-items-center flex-column h-100 justify-content-center">
          <img
            src="assets/images/auth/reset-forgot-img.png"
            alt="Reset Password"
          />
        </div>
      </div>
      <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
        <div className="max-w-464-px mx-auto w-100">
          <div className="text-center">
            <Link to="/sign-in" className="mb-40 max-w-290-px">
              <img
                src="assets/images/logo.png"
                alt="Logo"
                style={{ width: "100%", maxWidth: "350px", margin: "0 auto" }}
              />
            </Link>
            <h6 className="mb-12">Set New Password</h6>
            <p
              className="mb-32 text-secondary-light"
              style={{ fontSize: "13px", maxWidth: "350px",margin: "0 auto", fontWeight: 600 }}
            >
              Enter and confirm your new password.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            {["password", "confirmPassword"].map((field) => (
              <div className="mb-20" key={field} style={{ position: "relative" }}>
                <div style={{ maxWidth: "350px", margin: "0 auto" }}>
                  <label 
                    className="mb-8 d-block" 
                    style={{ 
                      fontSize: "13px",
                      textAlign: "left",
                    }}
                  >
                    {field === "password" ? "Enter New Password" : "Confirm New Password"}
                  </label>
                  <div style={{ position: "relative", height: "40px" }}>
                    <input
                      type={passwordVisibility[field] ? "text" : "password"}
                      className="form-control bg-neutral-50 radius-4"
                      value={formData[field]}
                      onChange={handlePasswordChange}
                      name={field}
                      required
                      style={{
                        paddingLeft: "20px",
                        paddingRight: "52px",
                        height: "100%",
                        boxSizing: "border-box",
                        width: "100%",
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
                  {(field === "password" && passwordError) || (field === "confirmPassword" && confirmPasswordError) ? (
                    <p 
                      style={{ 
                        color: "red", 
                        fontSize: "12px", 
                        marginTop: "2px", 
                        textAlign: "left",
                      }}
                    >
                      {field === "password" ? passwordError : confirmPasswordError}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
            <button
              type="submit"
              className="btn btn-primary auth-btn text-sm btn-sm radius-4 mt-32"
              disabled={
                loading ||
                !formData.password ||
                !formData.confirmPassword ||
                passwordError ||
                confirmPasswordError
              }
              style={{ 
                height: "40px",
                maxWidth: "350px", 
                margin: "32px auto 0", 
                display: "block",
                width: "100%",
                lineHeight: "1",
              }}
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