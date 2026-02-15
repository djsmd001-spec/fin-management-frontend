import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import "../styles/auth.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post(`/auth/reset-password/${token}`, {
        newPassword: password,
      });

      toast.success("Password Reset Successfully ✅");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Invalid or Expired Token"
      );
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>

        <input
          type="password"
          placeholder="Enter new password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}
