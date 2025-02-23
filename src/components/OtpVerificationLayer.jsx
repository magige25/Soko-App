import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/spinner.css";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const OtpVerificationLayer = () => {
  const [formData, setFormData] = useState({
    email: "",
    authMethod: "EMAILPASSWORD", // Fixed value
    password: "", // Not used in OTP verification but included for consistency
    otp: ["", "", "", "", ""], // OTP is stored as an array
  });
  const [message, setMessage] = useState("We have sent an OTP to your email");
  const [timer, setTimer] = useState(10);
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
    password: location.state.password, // Ensure password is set
  }));
  
    } else {
      navigate("/sign-in"); // Redirect to sign-in if no email is provided
    }

    // Start the OTP timer
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

  useEffect(() => {
    //console.log("Sending data:", { email: formData.email, password: formData.password });
  }, [formData]);

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...formData.otp];
    //console.log("OTP", newOtp)
    newOtp[index] = value;
    setFormData((prevData) => ({
      ...prevData,
      otp: newOtp,
    }));

    // Move focus to the next input field
    if (value && index < formData.otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);

    const otpCode = formData.otp.join("");

    // Basic client-side validation: Ensure all OTP fields are filled
    if (otpCode.length !== 5) {
      toast.error("Please enter a valid 5-digit OTP.", {
        position: "top-right",
        duration: 2000,
      });
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Make API call to validate OTP
      const response = await axios.post(
        "https://biz-system-production.up.railway.app/v1/auth/validate-otp", // Correct API endpoint
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
      //console.log("API Response:", response.data);
      // Check if the OTP validation was successful
      if (response.data.status.code === 0 && response.status === 200) {
        toast.success("OTP Verified Successfully", {
          position: "top-right",
          duration: 1000,
          icon: "✅",
        });


        localStorage.setItem("token", response.data.data.accessToken)

        // Navigate to the dashboard only after successful OTP validation
        navigate("/index-1");
      } else {
        toast.error("Invalid OTP. Please try again.", {
          position: "top-right",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("OTP Validation Error:", error);
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
  
    try {
      const response = await axios.post(
        "https://biz-system-production.up.railway.app/v1/auth/validate-otp", // Endpoint for resending OTP
        { email: formData.email },
        { headers: { "APP-KEY": "BCM8WTL9MQU4MJLE" } }
      );
      console.log("API Response:", response);
      console.log("Response Data:", response.data);
      console.log("Status Code:", response.data?.status?.code);
      console.log("Status Message:", response.data?.status?.message);

      if (response.data.status.code === 0 && response.status === 200) {
        console.log("OTP successfully sent to:", formData.email);

        toast.success("OTP Resent Successfully", {
          position: "top-right",
          duration: 1000,
          icon: "✅",
        });
  
        setTimer(10); // ✅ Reset timer only on success
        setResendDisabled(true); // ✅ Disable button only on success
        setMessage("A new OTP has been sent to your email"); // ✅ Set message on success
  
        // Restart the timer
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
      toast.error("Failed to resend OTP. Please try again.", {
        position: "top-right",
        duration: 2000,
      });
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
          <div className="text-center">
            <Link to="/" className="mb-40 max-w-290-px">
              <img
                src="assets/images/logo.png"
                alt=""
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

          {/* OTP Input Boxes */}
          <form onSubmit={handleSubmit}>
            <div className="otp-inputs d-flex justify-content-center gap-2 mb-24">
              {formData.otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  className="otp-box form-control text-center"
                  value={digit}
                  maxLength="1"
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  style={{
                    width: "50px",
                    height: "50px",
                    fontSize: "14px",
                    textAlign: "center",
                    borderRadius: "10px",
                    fontWeight: "bold",
                  }}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "280px", display: "block", margin: "0 auto" }}
              disabled={formData.otp.includes("") || loading}
            >
              {loading ? <div className="spinner"></div> : "Submit"}
            </button>
          </form>

          <p className="text-secondary-light text-center">
            Did not receive code?{" "}
            <button
              className="btn btn-link text-primary-400 fw-medium"
              onClick={handleResend}
              disabled={resendDisabled}
              style={{ fontSize: "16px" }}
            >
              Resend
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default OtpVerificationLayer;