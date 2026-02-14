import { useEffect, useState } from "react";
import API from "../../services/api";
import { generateEmiReceipt } from "../../utils/generateEmiReceipt";

export default function EMIPage() {
  const [emis, setEmis] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedEmi, setSelectedEmi] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const emiRes = await API.get("/emi/my");
      const summaryRes = await API.get("/emi/summary");

      setEmis(emiRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      console.log("Fetch Error:", err);
    }
  };

  /* ================= EMI PAYMENT ================= */

  const submitPayment = async () => {
    if (!transactionId) {
      alert("Enter Transaction ID");
      return;
    }

    try {
      setLoading(true);

      await API.put(`/emi/pay/${selectedEmi._id}`, {
        transactionId,
        paymentMode
      });

      alert("Payment Request Sent To Admin");
      setSelectedEmi(null);
      setTransactionId("");
      fetchData();
    } catch (err) {
      alert("Payment Failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RECEIPT ================= */

  const downloadReceipt = async (id) => {
    try {
      const res = await API.get(`/emi/receipt-data/${id}`);
      generateEmiReceipt(res.data);
    } catch (err) {
      alert("Receipt Download Failed");
    }
  };

  const progress =
    summary && summary.totalEmi > 0
      ? (summary.paidEmi / summary.totalEmi) * 100
      : 0;

  return (
    <div style={container}>
      <h2 style={title}>EMI Dashboard</h2>

      {/* ================= SUMMARY ================= */}
      {summary && (
        <div style={card}>
          <div style={summaryRow}>
            <div style={summaryBox}>
              <p>Total EMI</p>
              <h3>{summary.totalEmi}</h3>
            </div>

            <div style={summaryBox}>
              <p>Paid EMI</p>
              <h3 style={{ color: "green" }}>{summary.paidEmi}</h3>
            </div>

            <div style={summaryBox}>
              <p>Remaining</p>
              <h3>₹{summary.remainingAmount}</h3>
            </div>
          </div>

          <div style={progressBarBg}>
            <div
              style={{
                ...progressBarFill,
                width: `${progress}%`
              }}
            />
          </div>
        </div>
      )}

      {/* ================= EMI TABLE ================= */}
      <div style={tableContainer}>
        <table style={tableStyle}>
          <thead style={theadStyle}>
            <tr>
              <th style={th}>#</th>
              <th style={th}>Amount</th>
              <th style={th}>Penalty</th>
              <th style={th}>Due Date</th>
              <th style={th}>Status</th>
              <th style={th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {emis.length === 0 ? (
              <tr>
                <td colSpan="6" style={emptyRow}>
                  No EMI Found
                </td>
              </tr>
            ) : (
              emis.map((e) => (
                <tr key={e._id}>
                  <td style={td}>{e.emiNumber}</td>
                  <td style={td}>₹{e.amount}</td>
                  <td style={td}>₹{e.penalty || 0}</td>
                  <td style={td}>
                    {new Date(e.dueDate).toLocaleDateString()}
                  </td>

                  <td
                    style={{
                      ...td,
                      fontWeight: "600",
                      color:
                        e.status === "paid"
                          ? "green"
                          : e.status === "pending"
                          ? "orange"
                          : "red"
                    }}
                  >
                    {e.status}
                  </td>

                  <td style={td}>
                    {e.status === "unpaid" && (
                      <button
                        style={payBtn}
                        onClick={() => setSelectedEmi(e)}
                      >
                        Pay
                      </button>
                    )}

                    {e.status === "paid" && (
                      <button
                        style={receiptBtn}
                        onClick={() => downloadReceipt(e._id)}
                      >
                        Receipt
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAYMENT MODAL WITH QR ================= */}
      {selectedEmi && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3 style={{ marginBottom: "15px" }}>
              Pay EMI #{selectedEmi.emiNumber}
            </h3>

            {(() => {
              const totalAmount =
                Number(selectedEmi.amount) +
                Number(selectedEmi.penalty || 0);

              const upiId = "9607695009@ybl"; // 🔥 replace with real UPI
              const receiverName = "Gorakh Sunil Ekhande";

              const upiLink = `upi://pay?pa=${upiId}&pn=${receiverName}&am=${totalAmount}&cu=INR&tn=EMI Payment`;

              const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                upiLink
              )}`;

              return (
                <>
                  <div style={amountBox}>
                    <p>Total Payable</p>
                    <h2>₹{totalAmount}</h2>
                  </div>

                  <img src={qrUrl} alt="UPI QR" style={qrStyle} />

                  <div style={bankBox}>
                    <p><b>UPI ID:</b> {upiId}</p>
                    <p><b>Note:</b> EMI Payment</p>
                  </div>

                  <input
                    placeholder="Enter Transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    style={input}
                  />

                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    style={input}
                  >
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                  </select>

                  <button
                    style={submitBtn}
                    onClick={submitPayment}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Submit Payment"}
                  </button>

                  <button
                    style={cancelBtn}
                    onClick={() => setSelectedEmi(null)}
                  >
                    Cancel
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const container = { padding: "30px", background: "#f3f4f6", minHeight: "100vh" };
const title = { marginBottom: "25px" };

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "14px",
  marginBottom: "25px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)"
};

const summaryRow = { display: "flex", justifyContent: "space-between", marginBottom: "15px" };
const summaryBox = { textAlign: "center", flex: 1 };

const progressBarBg = { height: "8px", background: "#e5e7eb", borderRadius: "10px" };
const progressBarFill = { height: "8px", background: "#111827", borderRadius: "10px", transition: "0.4s" };

const tableContainer = {
  maxHeight: "60vh",
  overflowY: "auto",
  background: "white",
  borderRadius: "14px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)"
};

const tableStyle = { width: "100%", borderCollapse: "collapse" };
const theadStyle = { background: "#111827", color: "white" };
const th = { padding: "14px", textAlign: "center" };
const td = { padding: "14px", textAlign: "center", borderBottom: "1px solid #eee" };
const emptyRow = { textAlign: "center", padding: "25px" };

const payBtn = { padding: "6px 14px", background: "#111827", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" };
const receiptBtn = { padding: "6px 12px", background: "green", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" };

const modalOverlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" };
const modalBox = { background: "white", padding: "25px", borderRadius: "14px", width: "360px", textAlign: "center" };

const amountBox = { marginBottom: "15px" };
const qrStyle = { width: "220px", margin: "10px auto" };
const bankBox = { fontSize: "13px", marginBottom: "10px" };

const input = { width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "6px", border: "1px solid #ddd" };

const submitBtn = { padding: "10px", width: "100%", background: "#111827", color: "white", border: "none", borderRadius: "8px", marginBottom: "8px", cursor: "pointer" };
const cancelBtn = { padding: "10px", width: "100%", background: "red", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" };
