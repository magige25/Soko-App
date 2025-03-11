import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    
    console.log("Attempting sign-in with:", formData);

    if (emailError || passwordError) {
      console.log("Validation failed:", { emailError, passwordError });
      toast.error("Please fix the errors before submitting", {
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
        }
      );

      console.log("Full API Response:", response);
      console.log("Response Data:", response.data);

      if (response.status === 200 && response.data.status?.code === 0) {
        console.log("Sign-in successful! OTP should be here if returned by API:", response.data);
        toast.success("Sign In Successful", {
          position: "top-right",
          autoClose: 1000,
        });

        sessionStorage.setItem("userToken", response.data.token);
        
        setTimeout(() => {
          console.log("Navigating to OTP page with:", {
            email: formData.email,
            password: formData.password,
          });
          navigate("/otp", { 
            state: { email: formData.email, password: formData.password }
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
      toast.error("Failed. Input correct details.", {
        position: "top-right",
        autoClose: 2000,
      });
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
            src="/assets/images/auth/auth-img.png"
            alt="Authentication"
          />
        </div>
      </div>
      <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
        <div className="max-w-464-px mx-auto w-100">
          <div className="text-center">
            <Link to="/" className="mb-40 max-w-290-px">
              <img
                src="/assets/images/logo.png"
                alt="Logo"
              />
            </Link>
            <h5 className="mb-12">Sign In</h5>
            <p
              className="mb-32 text-secondary-light"
              style={{ fontSize: "14px", fontWeight: 600 }}
            >
              Welcome! Please enter your details
            </p>
          </div>
          <form>
            <div className="mb-20">
              <div style={{ maxWidth: "350px", margin: "0 auto" }}>
                <label 
                  className="mb-8 d-block" 
                  style={{ 
                    fontSize: "14px",
                    textAlign: "left",
                  }}
                >
                  Email
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
            <div className="mb-20" style={{ position: "relative" }}>
              <div style={{ maxWidth: "350px", margin: "0 auto" }}>
                <label 
                  className="mb-8 d-block" 
                  style={{ 
                    fontSize: "14px",
                    textAlign: "left",
                  }}
                >
                  Password
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
                  >
                  </span>
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
            <div className="">
              <div className="d-flex justify-content-between gap-2">
                <div className="form-check style-check d-flex align-items-center"></div>
                <Link to="/forgot-password" className="text-primary-600 fw-medium" style={{ fontSize: "12px", paddingRight: "32px"}}>
                  Forgot Password?
                </Link>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary text-sm btn-sm radius-4 mt-32"
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
                margin: "32px auto 0", 
                display: "block",
                width: "100%",
                lineHeight: "1",
              }}
            >
              {loading ? <div className="spinner"></div> : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignInLayer;