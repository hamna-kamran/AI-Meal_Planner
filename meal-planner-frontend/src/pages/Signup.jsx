// Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./auth.css";
import api from "../api";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when typing
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long.`;
    }
    if (!hasUpper) return "Password must contain at least one uppercase letter.";
    if (!hasLower) return "Password must contain at least one lowercase letter.";
    if (!hasNumber) return "Password must contain at least one number.";
    if (!hasSpecial)
      return "Password must contain at least one special character.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password before submitting
    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const res = await api.post("/auth/register", form);
      alert(res.data.message || "Signup successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card shadow">
        <h3 className="text-center mb-4">Create an Account</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              required
            />
            {error && <div className="text-danger mt-1">{error}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>

          <p className="text-center mt-3">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </form>
      </div>
    </div>
  );
}
