import { useEffect, useState } from "react";
import API from "../../services/api";

export default function DepositHistory() {
  const [deposits, setDeposits] = useState([]);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const res = await API.get("/deposits/my");
      setDeposits(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>My Deposit History</h2>

      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {deposits.length === 0 ? (
          <p>No Deposit History Found</p>
        ) : (
          deposits.map((d) => (
            <div key={d._id} style={card}>
              <p><b>Amount:</b> ₹{d.amount}</p>

              <p>
                <b>Status:</b>{" "}
                <span
                  style={{
                    color:
                      d.status === "approved"
                        ? "green"
                        : d.status === "rejected"
                        ? "red"
                        : "orange"
                  }}
                >
                  {d.status}
                </span>
              </p>

              <p><b>Penalty:</b> ₹{d.penalty || 0}</p>

              <p><b>Transaction ID:</b> {d.transactionId || "N/A"}</p>

              <p><b>Payment Mode:</b> {d.paymentMode || "N/A"}</p>

              <p>
                <b>Payment Date:</b>{" "}
                {d.paymentDate
                  ? new Date(d.paymentDate).toDateString()
                  : "N/A"}
              </p>

              <p>
                <b>Requested Date:</b>{" "}
                {new Date(d.createdAt).toDateString()}
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
