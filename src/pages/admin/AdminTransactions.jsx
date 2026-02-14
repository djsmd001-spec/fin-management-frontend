import { useEffect, useState } from "react";
import API from "../../services/api";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions/all");
      setTransactions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>All Transactions</h2>

      {/* 🔥 SCROLL CONTAINER */}
      <div
        style={{
          maxHeight: "70vh",
          overflowY: "auto",
          paddingRight: "10px"
        }}
      >
        {transactions.length === 0 ? (
          <p>No Transactions Found</p>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx._id}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                marginBottom: "12px",
                borderRadius: "8px",
                backgroundColor: "white",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
              }}
            >
              <p><b>User:</b> {tx.user?.name}</p>
              <p><b>Email:</b> {tx.user?.email}</p>
              <p><b>Type:</b> {tx.type}</p>
              <p><b>Amount:</b> ₹{tx.amount}</p>
              <p>
                <b>Date:</b>{" "}
                {new Date(tx.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
