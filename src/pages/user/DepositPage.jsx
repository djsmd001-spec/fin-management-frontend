import { useState } from "react";
import API from "../../services/api";

export default function DepositPage() {
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [transactionId, setTransactionId] = useState("");
  const [paymentDate, setPaymentDate] = useState("");

  const upiId = "9607695009@ibl";   // Make sure this UPI ID is active
  const receiverName = "Gorakh Sunil Ekhande";

  /* ===== FORMAT DATE dd/mm/yyyy ===== */
  const formatDate = (value) => {
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (e) => {
    setPaymentDate(formatDate(e.target.value));
  };

  const handleSubmit = async () => {
    if (!amount || !transactionId || !paymentDate) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("/deposits/request", {
        amount: Number(amount),
        paymentMode,
        transactionId,
        paymentDate
      });

      alert("Deposit Request Sent to Admin");

      setAmount("");
      setTransactionId("");
      setPaymentDate("");
    } catch (error) {
      alert("Deposit Failed");
    }
  };

  /* ===== CORRECT UPI LINK (FIXED VERSION) ===== */

  const totalAmount = Number(amount) > 0 ? Number(amount) : "";

  const encodedName = encodeURIComponent(receiverName);
  const encodedNote = encodeURIComponent("Deposit Payment");

  const upiString = totalAmount
    ? `upi://pay?pa=${upiId}&pn=${encodedName}&am=${totalAmount}&cu=INR&tn=${encodedNote}`
    : `upi://pay?pa=${upiId}&pn=${encodedName}&cu=INR`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    upiString
  )}`;

  return (
    <div style={container}>
      <h2>Make Deposit</h2>

      <div style={wrapper}>
        
        {/* LEFT SIDE - QR SECTION */}
        <div style={card}>
          <h3 style={{ textAlign: "center" }}>Scan & Pay</h3>

          <div style={amountBox}>
            <p>Total Amount</p>
            <h2>₹{totalAmount || 0}</h2>
          </div>

          <div style={qrContainer}>
            <img src={qrUrl} alt="UPI QR" style={qrStyle} />
          </div>

          <div style={centerInfo}>
            <p><strong>UPI ID:</strong> {upiId}</p>
            <p><strong>Receiver:</strong> {receiverName}</p>
            <p><strong>Account No:</strong> 42128100001046</p>
            <p><strong>IFSC Code:</strong> BARB0AKOLEX</p>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div style={card}>
          <h3>Submit Deposit Request</h3>

          <label>Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={input}
          />

          <label>Payment Mode</label>
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            style={input}
          >
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
          </select>

          <label>Transaction ID</label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            style={input}
          />

          <label>Payment Date (dd/mm/yyyy)</label>
          <input
            type="date"
            onChange={handleDateChange}
            style={input}
          />

          <button onClick={handleSubmit} style={button}>
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  padding: "30px",
  background: "#f3f4f6",
  minHeight: "100vh"
};

const wrapper = {
  display: "flex",
  gap: "40px",
  marginTop: "20px"
};

const card = {
  flex: 1,
  background: "white",
  padding: "25px",
  borderRadius: "14px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)"
};

const amountBox = {
  textAlign: "center",
  marginBottom: "15px"
};

const qrContainer = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "15px"
};

const qrStyle = {
  width: "250px",
  height: "250px"
};

const centerInfo = {
  textAlign: "center",
  fontSize: "14px",
  lineHeight: "1.6",
  marginTop: "10px"
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const button = {
  padding: "10px 15px",
  backgroundColor: "#111827",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};
