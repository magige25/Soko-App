import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/spinner.css";
import toast, { Toaster } from "react-hot-toast";

const SignInLayer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Function to handle email input changes
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear error if '@' is present in the email
    if (value.includes('@')) {
      setEmailError("");
    } else {
      setEmailError("Please enter a valid email");
    }
  };

  // Function to handle password input changes
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(""); // Clear error when user starts typing
  };

  // New function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    
    // Validate email format before proceeding
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email");
      return;
    }
    
    if (!email||!password) {
      setEmailError("Email is required");
      setPasswordError("Password is required");
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Success", {
        position: "top-right",
        duration: 1000,
        icon: "✅",
      });
      setTimeout(() => navigate("/otp"), 1000); 
    } catch (error) {
      toast.error("Failed. Input correct details.", {
        position: "top-right",
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth bg-base d-flex" style={{ height: "100vh" }}>
      <Toaster />
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
          <div className="text center">
            <Link to="/" className="mb-40 max-w-290-px">
              <img
                src="assets/images/logo.png"
                alt=""
                style={{ width: "100%", maxWidth: "200px" }}
              />
            </Link>
            <h5 className="mb-12">Sign In</h5>
            <p className="mb-32 text-secondary-light" style={{ fontSize: "14px", fontWeight: 600 }}>
              Welcome! Please enter your details
            </p>
          </div>
          <form>
            <div className="icon-field mb-16">
              <span className="icon top-50 translate-middle-y">
                <Icon icon="mage:email" />
              </span>
              <input
                type="email"
                className="form-control h-56-px bg-neutral-50 radius-12"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                required
              />
              {emailError && <p style={{ color: "red", fontSize: "12px" }}>{emailError}</p>}
            </div>
            <div className="position-relative mb-20">
              <div className="icon-field">
                <span className="icon top-50 translate-middle-y">
                  <Icon icon="solar:lock-password-outline" />
                </span>
                <input
                  type={showPassword ? "text" : "password"} // Conditional rendering based on state
                  className="form-control h-56-px bg-neutral-50 radius-12"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              {passwordError && <p style={{ color: "red", fontSize: "12px" }}>{passwordError}</p>}
              <span
                className={`toggle-password cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light ${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}`}
                onClick={togglePasswordVisibility} // Added click handler
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              />
            </div>
            <div className=''>
              <div className='d-flex justify-content-between gap-2'>
                <div className='form-check style-check d-flex align-items-center'>
                </div>
                <Link to='/forgot-password' className='text-primary-600 fw-medium'>
                  Forgot Password?
                </Link>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
              onClick={handleClick}
              disabled={loading}
              style={{ padding: "10px 20px", fontSize: "16px" }}
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