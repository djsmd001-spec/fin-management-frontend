import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import "../styles/auth.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login Successful ✅");

      setTimeout(() => {
        navigate(user.role === "admin"
          ? "/admin/dashboard"
          : "/user/dashboard");
      }, 1000);

    } catch {
      toast.error("Invalid Credentials ❌");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <div style={{ textAlign: "right", marginBottom: "10px" }}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? <div className="spinner"></div> : "Login"}
        </button>

        <p>
          Don't have account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
