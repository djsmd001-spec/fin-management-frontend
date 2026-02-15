import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import "../styles/auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/forgot-password", { email });

      toast.success(res.data.message);

      if (res.data.resetLink) {
        // 🔥 Direct browser redirect (most stable)
        window.location.href = res.data.resetLink;
      }

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Generate Reset Link</button>
      </form>
    </div>
  );
}
