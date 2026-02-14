import { useEffect, useState } from "react";
import API from "../../services/api";

export default function UserDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    const res = await API.get("/dashboard/loan-overview");
    setData(res.data);
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Loan Overview</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        <Card title="Total Savings" value={`₹${data.totalSavings}`} />
        <Card title="Eligible Loan (70%)" value={`₹${data.eligibleLoan}`} />
        <Card title="Active Loan" value={data.activeLoan ? "Yes" : "No"} />
        <Card title="Pending Requests" value={data.pendingLoans} />
        <Card
          title="Next EMI Date"
          value={
            data.nextEMIDate
              ? new Date(data.nextEMIDate).toLocaleDateString()
              : "No EMI"
          }
        />
        <Card title="Outstanding Amount" value={`₹${data.outstanding}`} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        padding: "20px",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
      }}
    >
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}
