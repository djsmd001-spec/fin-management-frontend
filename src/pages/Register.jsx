import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/auth.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState("");
  const navigate = useNavigate();

  // ✅ Password Strength Checker
  const checkStrength = (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    if (score <= 2) return "weak";
    if (score === 3 || score === 4) return "medium";
    return "strong";
  };

  const nameRegex = /^[A-Za-z\s]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      setStrength(checkStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Name Validation
    if (!nameRegex.test(form.name)) {
      alert("Name must contain only letters ❌");
      return;
    }

    // ✅ Password Rule Validation
    if (!passwordRegex.test(form.password)) {
      alert(
        "Password must be minimum 6 characters and include 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Character ❌"
      );
      return;
    }

    // ✅ Confirm Password Match
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    try {
      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password
      });

      alert("Registration Successful ✅");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed ❌");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        {/* Password Field */}
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {/* Strength Text + Bar */}
        {form.password && (
          <>
            <div className={`strength ${strength}`}>
              Password Strength: {strength}
            </div>
            <div className={`strength-bar ${strength}`}></div>
          </>
        )}

        <input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>

        <p>
          Already have account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
