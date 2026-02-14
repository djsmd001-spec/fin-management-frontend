import { useEffect, useState } from "react";
import API from "../../services/api";

export default function DepositHistoryAdmin() {
  const [deposits, setDeposits] = useState([]);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const res = await API.get("/deposits/all");
      setDeposits(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>All Deposit History</h2>

      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {deposits.length === 0 ? (
          <p>No Deposits Found</p>
        ) : (
          deposits.map((d) => (
            <div key={d._id} style={card}>
              <p><b>User:</b> {d.user?.name}</p>
              <p><b>Amount:</b> ₹{d.amount}</p>
              <p><b>Status:</b> {d.status}</p>
              <p><b>Penalty:</b> ₹{d.penalty}</p>
              <p><b>Date:</b> {new Date(d.paymentDate).toDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px"
};
