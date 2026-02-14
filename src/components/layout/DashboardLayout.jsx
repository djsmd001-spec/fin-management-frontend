import { Outlet, Link, useNavigate } from "react-router-dom";

export default function DashboardLayout({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={container}>
      
      {/* Sidebar */}
      <div style={sidebar}>
        <div>
          <h2 style={logo}>
            {role === "admin" ? "Admin" : "User"}
          </h2>

          <nav style={nav}>
            {role === "admin" ? (
              <>
                <Link style={centerLink} to="/admin/dashboard">Dashboard</Link>
                <Link style={centerLink} to="/admin/users">Users</Link>
                <Link style={centerLink} to="/admin/loan-requests">Loan Requests</Link>
                <Link style={centerLink} to="/admin/loan-history">Loan History</Link>
                <Link style={centerLink} to="/admin/deposit-requests">Deposit Requests</Link>
                <Link style={centerLink} to="/admin/deposit-history">Deposit History</Link>
                <Link style={centerLink} to="/admin/transactions">Transactions</Link>
                <Link style={centerLink} to="/admin/emi-approval">EMI Approval</Link>
              </>
            ) : (
              <>
                <Link style={centerLink} to="/user/dashboard">Dashboard</Link>
                <Link style={centerLink} to="/user/deposit">Deposit</Link>
                <Link style={centerLink} to="/user/deposit-history">Deposit History</Link>
                <Link style={centerLink} to="/user/loan">Loan</Link>
                <Link style={centerLink} to="/user/loan-history">Loan History</Link>
                <Link style={centerLink} to="/user/emi">EMI</Link>
                <Link style={centerLink} to="/user/transactions">Transactions</Link>
              </>
            )}
          </nav>
        </div>

        {/* Logout Bottom */}
        <button onClick={handleLogout} style={logoutBtn}>
          Logout
        </button>
      </div>

      {/* Right Section */}
      <div style={rightSection}>
        <div style={header}>
          <h3>Fin Management System</h3>
        </div>

        <div style={content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  display: "flex",
  height: "100vh",
  overflow: "hidden"
};

const sidebar = {
  width: "200px",   // 🔥 Reduced width
  background: "#111827",
  color: "white",
  padding: "20px 10px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between"
};

const logo = {
  marginBottom: "30px",
  fontSize: "18px",
  textAlign: "center"
};

const nav = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  alignItems: "center"   // 🔥 Center items horizontally
};

/* 🔥 Center aligned links */
const centerLink = {
  color: "white",
  textDecoration: "none",
  fontSize: "15px",
  fontWeight: "500",
  textAlign: "center",
  width: "100%",
  padding: "8px 0",
  borderRadius: "6px"
};

const logoutBtn = {
  padding: "8px",
  background: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px"
};

const rightSection = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  background: "#f3f4f6"
};

const header = {
  height: "60px",
  background: "white",
  display: "flex",
  alignItems: "center",
  padding: "0 20px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
};

const content = {
  flex: 1,
  overflowY: "auto",
  padding: "25px"
};
