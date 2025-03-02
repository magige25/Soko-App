import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";
import "../styles/spinner.css";
import axios from "axios";

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
                duration: 2000,
            });
            return;
        }

        if (emailError) {
            console.log("Validation failed:", { emailError });
            toast.error("Please fix the errors before submitting", {
                position: "top-right",
                duration: 2000,
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
                    duration: 2000,
                    icon: "✅",
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
                        duration: 2000,
                    }
                );
            }
        } catch (error) {
            console.error("Caught Error in Forgot Password Request:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            toast.error(
                error.response?.data?.status?.message || "Failed to send reset email. Server error occurred.",
                {
                    position: "top-right",
                    duration: 2000,
                }
            );
        } finally {
            console.log("Request finished, setting loading to false");
            setLoading(false);
        }
    };

    return (
        <section className="auth bg-base d-flex flex-wrap">
            <Toaster />
            <div className="auth-left d-lg-block d-none">
                <div className="d-flex align-items-center flex-column h-100 justify-content-center">
                    <img
                        src="assets/images/auth/forgot-pass-img.png"
                        alt="Forgot Password"
                    />
                </div>
            </div>
            <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
                <div className="max-w-464-px mx-auto w-100">
                    <div className="text-center">
                        <Link to="/" className="mb-40 max-w-290-px">
                            <img
                                src="assets/images/logo.png"
                                alt="Logo"
                                style={{ width: "100%", maxWidth: "200px" }}
                            />
                        </Link>
                        <h5 className="mb-12">Forgot Password</h5>
                        <p
                            className="mb-32 text-secondary-light"
                            style={{ fontSize: "14px", fontWeight: 600 }}
                        >
                            Enter the email linked to your account
                        </p>
                    </div>
                    <form>
                        <div className="mb-20" style={{ position: "relative" }}>
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
                                    <Icon icon="mage:email" width="20" />
                                </span>
                                <input
                                    type="email"
                                    className="form-control h-56-px bg-neutral-50 radius-12"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleEmailChange}
                                    required
                                    style={{
                                        paddingLeft: "44px",
                                        paddingRight: "12px",
                                        height: "100%",
                                        position: "relative",
                                        zIndex: 0,
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>
                            {emailError && (
                                <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>{emailError}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
                            onClick={handleClick}
                            disabled={loading || !formData.email || emailError}
                            style={{ padding: "10px 20px", fontSize: "16px" }}
                        >
                            {loading ? <div className="spinner"></div> : "Continue"}
                        </button>
                        <div className="text-center text-sm mt-20">
                            <p className="mb-0">
                                Already have an account?{" "}
                                <Link to="/sign-in" className="text-primary-600 fw-medium">
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