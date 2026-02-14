import { useEffect, useState } from "react";
import API from "../../services/api";

export default function LoanRequests() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await API.get("/loans/pending");
      setLoans(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const approve = async (id) => {
    await API.put(`/loans/approve/${id}`);
    fetchLoans();
  };

  const reject = async (id) => {
    await API.put(`/loans/reject/${id}`);
    fetchLoans();
  };

  return (
    <div>
      <h2>Loan Requests</h2>

      <div
        style={{
          maxHeight: "70vh",
          overflowY: "auto",
          paddingRight: "10px"
        }}
      >
        {loans.length === 0 ? (
          <p>No Pending Loans</p>
        ) : (
          loans.map((loan) => (
            <div
              key={loan._id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "8px",
                backgroundColor: "white"
              }}
            >
              <p><b>User:</b> {loan.user?.name}</p>
              <p><b>Email:</b> {loan.user?.email}</p>
              <p><b>Amount:</b> ₹{loan.amount}</p>
              <p><b>Total:</b> ₹{loan.totalAmount}</p>

              {/* ✅ Repayment Date Added */}
              <p>
                <b>Repayment Date:</b>{" "}
                {new Date(loan.repaymentDate).toLocaleDateString()}
              </p>

              <button onClick={() => approve(loan._id)}>
                Approve
              </button>

              <button
                onClick={() => reject(loan._id)}
                style={{ marginLeft: "10px" }}
              >
                Reject
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
