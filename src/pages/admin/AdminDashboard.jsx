import { useEffect, useState } from "react";
import API from "../../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

/* ================= FORMAT ================= */
const formatCurrency = (num) =>
  `₹${Number(num || 0).toFixed(2)}`;

/* ================= ANIMATED COUNTER ================= */
function CountUp({ value }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const increment = value / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(counter);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(counter);
  }, [value]);

  return <>{Number(count).toFixed(2)}</>;
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await API.get("/admin/dashboard-overview");
    setData(res.data);
  };

  if (!data) return <div style={loading}>Loading...</div>;

  return (
    <div style={page}>
      <h2 style={title}>Finance Admin Dashboard</h2>

      {/* ================= KPI SECTION ================= */}
      <div style={grid}>

        {/* Row 1 */}
        <Kpi title="Total Users" value={data.totalUsers} color="#2563eb" isCurrency={false} />
        <Kpi title="Total Deposits" value={data.totalDeposits} color="#0891b2" />
        <Kpi title="Fund Available" value={data.totalFundAvailable} color="#f97316" />
        <Kpi title="Loan Portfolio" value={data.totalLoanAmount} color="#9333ea" />
        <Kpi title="Total Loans" value={data.totalLoans} color="#7c3aed" isCurrency={false} />

        {/* Row 2 */}
        <Kpi title="Total Profit" value={data.totalProfit} color="#22c55e" />
        <Kpi title="Monthly Profit" value={data.monthlyProfit} color="#4f46e5" />
        <Kpi title="Active Loans" value={data.activeLoans} color="#16a34a" isCurrency={false} />
        <Kpi title="Pending Loans" value={data.pendingLoans} color="#f59e0b" isCurrency={false} />
        <Kpi title="Pending EMIs" value={data.pendingEMIs} color="#ef4444" isCurrency={false} />

      </div>

      {/* ================= RECENT SECTION (NOW ABOVE CHART) ================= */}
      <div style={horizontalWrapper}>

        <div style={scrollCard}>
          <h3 style={scrollTitle}>Recent Loans</h3>
          {data.recentLoans.slice(0, 5).map((loan, i) => (
            <div key={i} style={scrollRow}>
              <span>{loan.user}</span>
              <span>{formatCurrency(loan.amount)}</span>
              <span>{loan.status}</span>
            </div>
          ))}
        </div>

        <div style={scrollCard}>
          <h3 style={scrollTitle}>Recent Deposits</h3>
          {data.recentDeposits.slice(0, 5).map((dep, i) => (
            <div key={i} style={scrollRow}>
              <span>{dep.user}</span>
              <span>{formatCurrency(dep.amount)}</span>
              <span>{dep.status}</span>
            </div>
          ))}
        </div>

      </div>

      {/* ================= CHART (NOW BELOW RECENT) ================= */}
      <div style={chartCard}>
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
          Loans vs Profit Trend
        </h3>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data.monthlyStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="loans" stroke="#4f46e5" strokeWidth={3} />
            <Line yAxisId="right" type="monotone" dataKey="profit" stroke="#16a34a" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

/* ================= KPI ================= */

function Kpi({ title, value, color, isCurrency = true }) {
  return (
    <div style={{ ...card, borderTop: `6px solid ${color}` }} className="hoverCard">
      <p style={cardTitle}>{title}</p>
      <h2 style={cardValue}>
        {isCurrency ? "₹" : ""}
        <CountUp value={Number(value || 0)} />
      </h2>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  padding: "30px 40px",
  background: "#f3f4f6",
  minHeight: "100vh",
  fontFamily: "Inter, sans-serif"
};

const title = {
  fontSize: "26px",
  fontWeight: "600",
  marginBottom: "25px",
  textAlign: "center"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: "20px",
  marginBottom: "40px"
};

const card = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "14px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
  textAlign: "center",
  transition: "0.3s ease",
  cursor: "pointer"
};

const cardTitle = {
  fontSize: "13px",
  color: "#6b7280",
  marginBottom: "8px"
};

const cardValue = {
  fontSize: "18px",
  fontWeight: "600"
};

const horizontalWrapper = {
  display: "flex",
  gap: "20px",
  overflowX: "auto",
  maxHeight: "260px",
  marginBottom: "35px"
};

const scrollCard = {
  minWidth: "450px",
  background: "#ffffff",
  padding: "20px",
  borderRadius: "14px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
  overflowY: "auto"
};

const scrollTitle = {
  marginBottom: "15px",
  textAlign: "center",
  fontWeight: "600"
};

const scrollRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  borderBottom: "1px solid #eee",
  fontSize: "13px"
};

const chartCard = {
  background: "#ffffff",
  padding: "25px",
  borderRadius: "14px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)"
};

const loading = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "20px"
};

const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
  .hoverCard:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  }
`;
document.head.appendChild(styleSheet);
