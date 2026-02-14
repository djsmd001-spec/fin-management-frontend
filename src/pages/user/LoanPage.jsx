import { useState } from "react";
import API from "../../services/api";

export default function LoanPage() {
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState(1);

  const interestRate = 6;

  const numericAmount = Number(amount);

  const interest =
    numericAmount && duration
      ? (numericAmount * interestRate * duration) / 100
      : 0;

  const total = numericAmount + interest;

  const emi =
    duration > 0 ? (total / duration).toFixed(2) : 0;

  const handleSubmit = async () => {
    if (!numericAmount || numericAmount <= 0) {
      alert("Enter valid loan amount");
      return;
    }

    try {
      await API.post("/loans/request", {
        amount: numericAmount,      // ✅ force number
        duration: Number(duration)  // ✅ force number
      });

      alert("Loan Request Sent");

      setShowForm(false);
      setAmount("");
      setDuration(1);

    } catch (error) {
      console.log(error.response?.data);
      alert("Request Failed");
    }
  };

  return (
    <div>
      <h2>Loan Section</h2>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          style={buttonStyle}
        >
          Apply Loan
        </button>
      ) : (
        <div style={{ display: "flex", gap: "40px" }}>
          {/* LEFT SIDE FORM */}
          <div style={formStyle}>
            <h3>Loan Request Form</h3>

            <label>Loan Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={inputStyle}
            />

            <label>Interest Rate</label>
            <input
              type="text"
              value="6% per month"
              disabled
              style={inputStyle}
            />

            <label>Loan Duration (Months)</label>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {[1, 2, 3, 6, 8, 12].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setDuration(m)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "5px",
                    border:
                      duration === m
                        ? "2px solid #111827"
                        : "1px solid #ccc",
                    background:
                      duration === m ? "#111827" : "white",
                    color:
                      duration === m ? "white" : "black",
                    cursor: "pointer"
                  }}
                >
                  {m}
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              style={{ ...buttonStyle, marginTop: "20px" }}
            >
              Submit Loan Request
            </button>
          </div>

          {/* RIGHT SIDE EMI PREVIEW */}
          <div style={previewStyle}>
            <h3>EMI Preview</h3>

            <p><b>Principal:</b> ₹{numericAmount || 0}</p>
            <p><b>Interest (6% × {duration}):</b> ₹{interest}</p>
            <p><b>Total Payable:</b> ₹{total}</p>
            <p><b>Monthly EMI:</b> ₹{emi}</p>

            <hr />

            <h4>Mini Interest Calculator</h4>
            <p>
              Formula: <br />
              Principal × 6% × Months
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const formStyle = {
  flex: 1,
  padding: "20px",
  background: "white",
  borderRadius: "10px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
};

const previewStyle = {
  width: "300px",
  padding: "20px",
  background: "#f9fafb",
  borderRadius: "10px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "15px",
  borderRadius: "5px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  padding: "10px 15px",
  backgroundColor: "#111827",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};
