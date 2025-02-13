import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/spinner.css";

const OtpVerificationLayer = () => {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [message, setMessage] = useState("We have sent an OTP to your email");
  const [timer, setTimer] = useState(180);
  const [resendDisabled, setResendDisabled] = useState(true);
  const inputRefs = useRef([]);
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
  }, []);

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/index-1"); // Navigate to home screen
    }, 2000);
  };

  const handleResend = () => {
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
  };

  return (
    <section className='auth bg-base d-flex' style={{ height: '100vh' }}>
      <div className='auth-right d-lg-block d-none' style={{ width: '70%', height: '100vh' }}>
        <div className='d-flex align-items-center flex-column h-100 justify-content-center'>
          <img src='assets/images/auth/auth-img.png' alt='' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
      <div className='auth-form d-flex flex-column justify-content-center align-items-center' style={{ width: '30%', height: '100vh', padding: '0 20px' }}>
        <div className='w-100' style={{ maxWidth: '400px' }}>
          <div className='text-center'>
            <Link to='/' className='mb-40 max-w-290-px'>
              <img src='assets/images/logo.png' alt='' style={{ width: '100%', maxWidth: '200px' }} />
            </Link>
            <h5 className='mb-12'>Enter OTP</h5>
            <p className='mb-32 text-secondary-light' style={{ fontSize: '14px' }}>{message}</p>
            <p className='mb-24' style={{ fontSize: '14px' }}>Your code will expire in {`${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, "0")}`}</p>
          </div>

          {/* OTP Input Boxes */}
          <div className='otp-inputs d-flex justify-content-center gap-2 mb-24'>
            {otp.map((digit, index) => (
              <input
                key={index}
                type='text'
                className='otp-box form-control text-center'
                value={digit}
                maxLength='1'
                onChange={(e) => handleOtpChange(index, e.target.value)}
                ref={(el) => (inputRefs.current[index] = el)}
                style={{ width: '50px', height: '50px', fontSize: '14px', textAlign: 'center', borderRadius: '10px', fontWeight: 'bold' }}
                autoFocus={index === 0}
              />
            ))}
          </div>

          <button 
            className='btn btn-primary' 
            style={{ width: "280px", display: "block", margin: "0 auto" }} 
            onClick={handleSubmit} 
            disabled={otp.includes("") || loading}
          >
            {loading ? <div className="spinner"></div> : "Submit"}
          </button>

          <p className='text-secondary-light text-center'>
            Did not receive code?{" "}
            <button
              className='btn btn-link text-primary-400 fw-medium'
              onClick={handleResend}
              disabled={resendDisabled}
              style={{ fontSize: '16px' }}
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