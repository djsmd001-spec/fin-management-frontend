import { useEffect, useState } from "react";
import API from "../../services/api";

export default function DepositApprovalPage() {
  const [deposits, setDeposits] = useState([]);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const res = await API.get("/deposits/pending");
      setDeposits(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const approveDeposit = async (id) => {
    try {
      await API.put(`/deposits/approve/${id}`);
      alert("Deposit Approved");
      fetchDeposits();
    } catch (error) {
      console.error(error);
    }
  };

  const rejectDeposit = async (id) => {
    try {
      await API.put(`/deposits/reject/${id}`);
      alert("Deposit Rejected");
      fetchDeposits();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Pending Deposit Requests</h2>

      {deposits.length === 0 ? (
        <p>No pending deposits</p>
      ) : (
        deposits.map((deposit) => (
          <div
            key={deposit._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px"
            }}
          >
            <p><b>User:</b> {deposit.user?.name}</p>
            <p><b>Email:</b> {deposit.user?.email}</p>
            <p><b>Amount:</b> ₹{deposit.amount}</p>
            <p><b>Mode:</b> {deposit.paymentMode}</p>
            <p><b>Transaction ID:</b> {deposit.transactionId}</p>

            <button onClick={() => approveDeposit(deposit._id)}>
              Approve
            </button>

            <button
              onClick={() => rejectDeposit(deposit._id)}
              style={{ marginLeft: "10px", background: "red", color: "white" }}
            >
              Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
}
