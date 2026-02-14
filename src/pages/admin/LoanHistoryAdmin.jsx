import { useEffect, useState } from "react";
import API from "../../services/api";

export default function LoanHistoryAdmin() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    const res = await API.get("/loans/all");
    setLoans(res.data);
  };

  return (
    <div>
      <h2>Loan History</h2>

      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {loans.map((loan) => (
          <div key={loan._id}>
            <p>User: {loan.user?.name}</p>
            <p>Amount: ₹{loan.amount}</p>
            <p>Status: {loan.status}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}
