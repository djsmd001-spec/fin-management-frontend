import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import UserDashboard from "./pages/user/UserDashboard";
import LoanPage from "./pages/user/LoanPage";
import EMIPage from "./pages/user/EMIPage";
import TransactionPage from "./pages/user/TransactionPage";
import DepositPage from "./pages/user/DepositPage";
import LoanHistory from "./pages/user/LoanHistory";
import DepositHistory from "./pages/user/DepositHistory";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersPage from "./pages/admin/UsersPage";   // ✅ FIXED
import LoanRequests from "./pages/admin/LoanRequests";
import LoanHistoryAdmin from "./pages/admin/LoanHistoryAdmin";
import DepositApprovalPage from "./pages/admin/DepositApprovalPage";
import DepositHistoryAdmin from "./pages/admin/DepositHistoryAdmin";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminEmiApproval from "./pages/admin/AdminEmiApproval";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <DashboardLayout role="user" />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="deposit" element={<DepositPage />} />
          <Route path="loan" element={<LoanPage />} />
          <Route path="loan-history" element={<LoanHistory />} />
          <Route path="emi" element={<EMIPage />} />
          <Route path="transactions" element={<TransactionPage />} />
          <Route path="deposit-history" element={<DepositHistory />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <DashboardLayout role="admin" />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="loan-requests" element={<LoanRequests />} />
          <Route path="loan-history" element={<LoanHistoryAdmin />} />
          <Route path="deposit-requests" element={<DepositApprovalPage />} />
          <Route path="deposit-history" element={<DepositHistoryAdmin />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="emi-approval" element={<AdminEmiApproval />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}
