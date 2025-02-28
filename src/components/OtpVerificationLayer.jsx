import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/spinner.css";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const OtpVerificationLayer = () => {
  const [formData, setFormData] = useState({
    email: "",
    authMethod: "EMAILPASSWORD",
    password: "",
    otp: ["", "", "", "", ""],
  });
  const [message, setMessage] = useState("We have sent an OTP to your email");
  const [timer, setTimer] = useState(180);
  const [resendDisabled, setResendDisabled] = useState(true);
  const inputRefs = useRef([]);
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email && location.state?.password) {
      setFormData((prevData) => ({
        ...prevData,
        email: location.state.email,
        password: location.state.password,
      }));
    } else {
      navigate("/sign-in");
    }

    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(intervalRef.current);
          setResendDisabled(false);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [location, navigate]);

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData((prevData) => ({
      ...prevData,
      otp: newOtp,
    }));

    if (value && index < formData.otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1].focus();
      const newOtp = [...formData.otp];
      newOtp[index - 1] = ""; // Optionally clear the previous field
      setFormData((prevData) => ({
        ...prevData,
        otp: newOtp,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const otpCode = formData.otp.join("");

    if (otpCode.length !== 5) {
      toast.error("Please enter a valid 5-digit OTP.", {
        position: "top-right",
        duration: 2000,
      });
      setLoading(false);
      return;
    }

    try {
      console.log("Submitting OTP with payload:", {
        email: formData.email,
        password: formData.password,
        authMethod: formData.authMethod,
        otp: otpCode,
      });
      const response = await axios.post(
        "https://api.bizchain.co.ke/v1/auth/validate-otp",
        {
          email: formData.email,
          password: formData.password,
          authMethod: formData.authMethod,
          otp: otpCode,
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
        toast.success("OTP Verified Successfully", {
          position: "top-right",
          duration: 2000,
          icon: "✅",
        });

        const token = response.data.data?.accessToken;
        if (token) {
          localStorage.setItem("token", token);
          console.log("Token set successfully:", localStorage.getItem("token"));
          navigate("/dashboard");
        } else {
          console.error("No access token found in response!");
          toast.error("Authentication failed: No token received.");
        }
      } else {
        toast.error("Invalid OTP. Please try again.", {
          position: "top-right",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("OTP Validation Error:", error.message, error.response?.data);
      toast.error("Failed to validate OTP. Please try again.", {
        position: "top-right",
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!formData.email?.trim()) {
      console.log("Error: Email is missing!");
      toast.error("Email is required to resend OTP.", {
        position: "top-right",
        duration: 2000,
      });
      return;
    }

    setLoading(true);

    try {
      console.log("Resending OTP with payload:", {
        email: formData.email,
        authMethod: formData.authMethod,
        password: formData.password,
      });
      const response = await axios.post(
        "https://api.bizchain.co.ke/v1/auth/otp",
        {
          email: formData.email,
          authMethod: formData.authMethod,
          password: formData.password,
        },
        { headers: { "APP-KEY": "BCM8WTL9MQU4MJLE" } }
      );

      console.log("Resend OTP Full Response:", response);
      console.log("Resend OTP Response Data:", response.data);

      if (response.status === 200 && response.data.status?.code === 0) {
        toast.success("OTP Resent Successfully", {
          position: "top-right",
          duration: 2000,
          icon: "✅",
        });

        setTimer(180);
        setResendDisabled(true);
        setMessage("A new OTP has been sent to your email");

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
          setTimer((prev) => {
            if (prev > 0) {
              return prev - 1;
            } else {
              clearInterval(intervalRef.current);
              setResendDisabled(false);
              return 0;
            }
          });
        }, 1000);
      } else {
        toast.error("Failed to resend OTP. Please try again.", {
          position: "top-right",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Resend OTP Error:", error.message, error.response?.data);
      toast.error("Failed to resend OTP. Please try again.", {
        position: "top-right",
        duration: 2000,
      });
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
            alt="Authentication"
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
            <h5 className="mb-12">Enter OTP</h5>
            <p className="mb-32 text-secondary-light" style={{ fontSize: "14px" }}>
              {message}
            </p>
            <p className="mb-24" style={{ fontSize: "14px" }}>
              Your code will expire in {`${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, "0")}`}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-container" style={{ width: "280px", margin: "0 auto" }}>
              <div
                className="otp-inputs d-flex gap-2 mb-24"
                style={{ width: "100%" }}
              >
                {formData.otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    className={`otp-box form-control text-center ${digit ? "filled" : ""}`}
                    value={digit}
                    maxLength="1"
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    style={{
                      width: "50px",
                      height: "50px",
                      fontSize: "13px",
                      fontWeight: "bold",
                      borderRadius: "8px",
                      border: "1.5px solid #d0d0d0",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.2s ease",
                    }}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <button
                type="submit"
                className="btn btn-primary text-sm btn-sm px-12 py-16 radius-12"
                style={{
                  width: "100%",
                  padding: "10px 20px",
                  fontSize: "16px",
                }}
                disabled={formData.otp.includes("") || loading}
              >
                {loading ? <div className="spinner"></div> : "Submit"}
              </button>
            </div>
          </form>

          <p className="text-secondary-light text-center mt-20">
            Did not receive code?{" "}
            <button
              className="btn btn-link text-primary-400 fw-medium"
              onClick={handleResend}
              disabled={resendDisabled || loading}
              style={{ fontSize: "16px" }}
            >
             Resend
            </button>
          </p>
        </div>
      </div>

      <style jsx>{`
        .otp-box {
          background-color: #fff;
          color: #333;
        }
        .otp-box:focus {
          border-color: #007bff;
          box-shadow: 0 0 6px rgba(0, 123, 255, 0.25);
          outline: none;
        }
        .otp-box.filled {
          background-color: #f5faff;
          border-color: #007bff;
          color: #007bff;
        }
      `}</style>
    </section>
  );
};

export default OtpVerificationLayer;