import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";

const ForgotPasswordLayer = () => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        
        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(value);

        if (isValid) {
            setEmailError("");
            setIsEmailValid(true);
        } else {
            setEmailError("Please enter a valid email");
            setIsEmailValid(false);
        }
    };

    const handleClick = async (e) => {
        e.preventDefault(); 
        setLoading(true);
        try {
            if (isEmailValid) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                toast.success("Email sent!", {
                    position: "top-right",
                    duration: 1000,
                    icon: "✅",
                });
                
            } else {
                throw new Error("Invalid email");
            }
        } catch (error) {
            toast.error("Failed. Please enter a valid email.", {
                position: "top-right",
                duration: 2000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section className="auth bg-base d-flex" style={{ height: "100vh" }}>
                <Toaster />
                <div className="auth-right d-lg-block d-none" style={{ width: "70%", height: "100vh" }}>
                    <div className="d-flex align-items-center flex-column h-100 justify-content-center">
                        <img 
                            src="assets/images/auth/forgot-pass-img.png" 
                            alt="" 
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>
                </div>
                <div className="auth-form d-flex flex-column justify-content-center align-items-center"
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
                            <h5 className="mb-12">Forgot Password</h5>
                            <p className="mb-32 text-secondary-light" style={{ fontSize: "14px", fontWeight: 600 }}>
                                Enter the email linked to your account
                            </p>
                        </div>
                        <form action="#" onSubmit={handleClick}>
                            <div className="icon-field">
                                <span className="icon top-50 translate-middle-y">
                                    <Icon icon="mage:email" />
                                </span>
                                <input
                                    type="email"
                                    className="form-control h-56-px bg-neutral-50 radius-12"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    required
                                />
                                {emailError && <p style={{ color: "red", fontSize: "12px" }}>{emailError}</p>}
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
                                disabled={!isEmailValid || loading}
                                style={{ padding: "10px 20px", fontSize: "16px" }}
                            >
                                {loading ? <div className="spinner"></div> : "Continue"}
                            </button>
                            <div className="text-center text-sm">
                                <p className="mb-0">
                                    Already have an account?{" "}
                                    <Link to="/sign-in" className="text-primary-600 fw-semibold mt-24">
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ForgotPasswordLayer;