import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "../hook/spinner-utils";

const ForgotPasswordLayer = () => {
    const [emailError, setEmailError] = useState("");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
    });
    const navigate = useNavigate();

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

    const handleClick = async (e) => {
        e.preventDefault();
        
        console.log("Attempting password reset with:", formData);

        if (!formData.email) {
            console.log("Email field is empty");
            toast.error("Please enter an email address", {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }

        if (emailError) {
            console.log("Validation failed:", { emailError });
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
            console.log("Sending Request with Payload:", { email: formData.email });
            const response = await axios.post(
                "https://api.bizchain.co.ke/v1/auth/forget-password",
                {
                    email: formData.email,
                },
                {
                    headers: {
                        "APP-KEY": "BCM8WTL9MQU4MJLE",
                    },
                    timeout: 10000,
                }
            );

            console.log("Full API Response:", response);
            console.log("Response Status:", response.status);
            console.log("Response Data:", response.data);
            console.log("Status Code Check:", response.data?.status?.code);

            if (response.status === 200 && response.data?.status?.code === 29) {
                console.log("Success condition met (code 29), showing success toast and navigating");
                toast.success("Password reset email sent! Please check your inbox.", {
                    position: "top-right",
                    autoClose: 2000,
                });

                setTimeout(() => {
                    navigate("/sign-in");
                }, 2000);
            } else {
                console.log("Response did not meet success criteria:", response.data);
                toast.error(
                    response.data?.status?.message || "Failed to send reset email. Please try again.",
                    {
                        position: "top-right",
                        autoClose: 2000,
                    }
                );
            }
        } catch (error) {
            console.error("Caught Error in Forgot Password Request:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });

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
                    toast.error("Invalid email format. Please check your email.", {
                        position: "top-right",
                        autoClose: 2000,
                    });
                } else if (error.response.status === 404) {
                    toast.error("Email not found. Please check your email.", {
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
                        error.response?.data?.status?.message || "Failed to send reset email. Please try again.",
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
            console.log("Request finished, setting loading to false");
            setLoading(false);
        }
    };

    return (
        <section className="auth bg-base d-flex flex-wrap">
            <ToastContainer position="top-right" autoClose={2000} />
            <div className="auth-left d-lg-block d-none">
                <div className="d-flex align-items-center flex-column h-100 justify-content-center">
                    <img
                        src="/assets/images/auth/reset-forgot-img.png"
                        alt="Forgot Password"
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
                                style={{ width: "100%", maxWidth: "350px", margin: "0 auto" }}
                            />
                        </Link>
                        <p
                            className="mb-32 text-secondary-light"
                            style={{ fontSize: "13px", maxWidth: "350px", margin: "0 auto", fontWeight: 600 }}
                        >
                            We’ll send you an email with a link to reset your password.
                        </p>
                    </div>
                    <form onSubmit={handleClick}>
                        <div className="mb-28" style={{ position: "relative" }}>
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
                                        disabled={loading}
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
                        <button
                            type="submit"
                            className="btn btn-primary auth-btn text-sm btn-sm radius-4 mt-32"
                            disabled={loading || !formData.email || emailError}
                            style={{ 
                                height: "40px",
                                maxWidth: "350px", 
                                margin: "32px auto 0", 
                                display: "block",
                                width: "100%",
                                lineHeight: "1",
                            }}
                        >
                            {loading ? <div className=""> <Spinner /> </div> : "Send Reset Link"}
                        </button>
                        <div className="text-sm fs-6 mt-10" style={{ maxWidth: "350px", margin: "0 auto"}}>
                            <p className="mb-0" style={{ fontSize: "13px", textAlign: "right" }}>
                                Remember your password?{" "}
                                <Link to="/sign-in" className="sign-in-link text-primary-800 fw-bold">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ForgotPasswordLayer;