import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "../hook/spinner-utils";

const SignInLayer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    authMethod: "EMAILPASSWORD",
    password: "",
  });

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setFormData({ ...formData, email });

    if (!email) {
      setEmailError("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData({ ...formData, password });

    if (!password) {
      setPasswordError("Password is required");
    } else if (password.length < 5) {
      setPasswordError("Password must be at least 5 characters");
    } else {
      setPasswordError("");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (emailError || passwordError) {
      console.log("Validation failed:", { emailError, passwordError });
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

    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.bizchain.co.ke/v1/auth",
        formData,
        {
          headers: {
            "APP-KEY": "BCM8WTL9MQU4MJLE",
          },
          timeout: 10000,
        }
      );

      console.log("Response Data:", response.data);

      if (response.status === 200 && response.data.status?.code === 0) {
        toast.success("Sign In Successful", {
          position: "top-right",
          autoClose: 1000,
        });

        sessionStorage.setItem("userToken", response.data.token);
        const userId = response.data.data?.id || response.data.data?.userId || response.data.account?.id;

        setTimeout(() => {
          console.log("Navigating to OTP page with:", {
            email: formData.email,
            password: formData.password,
            userId,
          });
          navigate("/otp", {
            state: { email: formData.email, password: formData.password, userId },
          });
        }, 2000);
      } else {
        console.log("Sign-in failed - Invalid credentials or unexpected response");
        toast.error("Invalid sign-in credentials!", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Login Error:", error.message, error.response?.data);

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
        if (error.response.status === 401) {
          toast.error("Invalid email or password.", {
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
          toast.error("An error occurred. Please try again.", {
            position: "top-right",
            autoClose: 2000,
          });
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
          <img src="/assets/images/auth/auth-img.png" alt="Authentication" />
        </div>
      </div>
      <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
        <div className="max-w-464-px mx-auto w-100">
          <div className="text-center">
            <Link to="/" className="mb-40 max-w-290-px">
              <img 
                src="/assets/images/logo.png" 
                alt="Logo" 
                style={{ width: "100%", maxWidth: "350px", margin: "0 auto" }}
              />
            </Link>
            <h6 className="mb-12 gw-bold">Welcome Back!</h6>
            <p
              className="mb-32 text-secondary-light"
              style={{ fontSize: "13px", maxWidth: "350px", margin: "0 auto", fontWeight: 600 }}
            >
              Enter your credentials to get started.
            </p>
          </div>
          <form>
            <div className="mb-20">
              <div style={{ maxWidth: "350px", margin: "0 auto" }}>
                <label
                  className="mb-8 d-block"
                  style={{
                    fontSize: "13px",
                    textAlign: "left",
                  }}
                >
                  Enter your email address
                </label>
                <div style={{ position: "relative", height: "40px" }}>
                  <input
                    type="email"
                    className="form-control bg-neutral-50 radius-4"
                    value={formData.email}
                    onChange={handleEmailChange}
                    required
                    style={{
                      paddingLeft: "20px",
                      paddingRight: "20px",
                      height: "100%",
                      boxSizing: "border-box",
                      width: "100%",
                    }}
                  />
                </div>
                {emailError && (
                  <p
                    style={{
                      color: "red",
                      fontSize: "12px",
                      marginTop: "2px",
                      textAlign: "left",
                    }}
                  >
                    {emailError}
                  </p>
                )}
              </div>
            </div>
            <div className="mb-8" style={{ position: "relative" }}>
              <div style={{ maxWidth: "350px", margin: "0 auto" }}>
                <label
                  className="mb-8 d-block"
                  style={{
                    fontSize: "13px",
                    textAlign: "left",
                  }}
                >
                  Enter your password
                </label>
                <div style={{ position: "relative", height: "40px" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control bg-neutral-50 radius-4"
                    value={formData.password}
                    onChange={handlePasswordChange}
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
                      showPassword ? "ri-eye-off-line" : "ri-eye-line"
                    }`}
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
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
                  ></span>
                </div>
                {passwordError && (
                  <p
                    style={{
                      color: "red",
                      fontSize: "12px",
                      marginTop: "2px",
                      textAlign: "left",
                    }}
                  >
                    {passwordError}
                  </p>
                )}
              </div>
            </div>
            <div className="mb-32">
              <div
                style={{
                  maxWidth: "350px",
                  margin: "0 auto",
                  textAlign: "right",
                }}
              >
                <Link
                  to="/forgot-password"
                  className="forgot-password-link text-primary-800 fw-bold"
                  style={{ fontSize: "12px" }}
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary auth-btn text-sm btn-sm radius-4"
              onClick={handleClick}
              disabled={
                loading ||
                !formData.email ||
                !formData.password ||
                emailError ||
                passwordError
              }
              style={{
                height: "40px",
                maxWidth: "350px",
                margin: "0 auto",
                display: "block",
                width: "100%",
                lineHeight: "1",
              }}
            >
              {loading ? <div className=""><Spinner /></div> : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignInLayer;