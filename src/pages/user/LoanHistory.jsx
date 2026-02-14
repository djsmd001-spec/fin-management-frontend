import { useEffect, useState } from "react";
import API from "../../services/api";

export default function LoanHistory() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await API.get("/loans/my");
      setLoans(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>My Loan History</h2>

      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {loans.length === 0 ? (
          <p>No Loan History Found</p>
        ) : (
          loans.map((loan) => (
            <div key={loan._id} style={card}>
              <p><b>Amount:</b> ₹{loan.amount}</p>
              <p><b>Duration:</b> {loan.duration} Months</p>
              <p><b>Interest:</b> ₹{loan.totalInterest}</p>
              <p><b>Total Payable:</b> ₹{loan.totalAmount}</p>

              <p>
                <b>Status:</b>{" "}
                <span
                  style={{
                    color:
                      loan.status === "approved"
                        ? "green"
                        : loan.status === "rejected"
                        ? "red"
                        : "orange"
                  }}
                >
                  {loan.status}
                </span>
              </p>

              <p>
                <b>Requested Date:</b>{" "}
                {new Date(loan.createdAt).toDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  padding: "15px",
  marginBottom: "12px",
  borderRadius: "10px",
  backgroundColor: "#ffffff",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
};
