import { Link } from "react-router-dom";

export default function Sidebar({ role }) {

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div style={sidebarStyle}>
      <h2>FIN</h2>

      {role === "user" && (
        <>
          <Link style={linkStyle} to="/user/dashboard">Dashboard</Link>
          <Link style={linkStyle} to="/user/deposit">Deposit</Link>
          <Link style={linkStyle} to="/user/deposit-history">Deposit History</Link>
          <Link style={linkStyle} to="/user/loan">Loan</Link>
          <Link style={linkStyle} to="/user/loan-history">Loan History</Link>
          <Link style={linkStyle} to="/user/emi">EMI</Link>
          <Link style={linkStyle} to="/user/transactions">Transactions</Link>
        </>
      )}

      {role === "admin" && (
        <>
          <Link style={linkStyle} to="/admin/dashboard">Dashboard</Link>
          <Link style={linkStyle} to="/admin/users">Users</Link>
          <Link style={linkStyle} to="/admin/loan-requests">Loan Requests</Link>
          <Link style={linkStyle} to="/admin/loan-history">Loan History</Link>
          <Link style={linkStyle} to="/admin/deposit-requests">Deposit Requests</Link>
          <Link style={linkStyle} to="/admin/deposit-history">Deposit History</Link>
          <Link style={linkStyle} to="/admin/transactions">Transactions</Link>
          <Link style={linkStyle} to="/admin/emi-approval">EMI Approval</Link>
        </>
      )}

      <button onClick={handleLogout} style={logoutBtn}>
        Logout
      </button>
    </div>
  );
}

const sidebarStyle = {
  width: "220px",
  height: "100vh",
  background: "#111827",
  color: "white",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "15px"
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  padding: "8px",
  backgroundColor: "#1f2937",
  borderRadius: "5px"
};

const logoutBtn = {
  marginTop: "auto",
  padding: "8px",
  background: "red",
  color: "white",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px"
};
