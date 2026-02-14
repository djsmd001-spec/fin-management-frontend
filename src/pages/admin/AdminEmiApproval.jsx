import { useEffect, useState } from "react";
import API from "../../services/api";

export default function AdminEmiApproval() {
  const [emis, setEmis] = useState([]);

  useEffect(() => {
    fetchEmis();
  }, []);

  const fetchEmis = async () => {
    try {
      const res = await API.get("/emi/pending");
      setEmis(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const approve = async (id) => {
    try {
      await API.put(`/emi/approve/${id}`);
      alert("EMI Approved");
      fetchEmis();
    } catch (err) {
      alert("Approve Failed");
    }
  };

  const reject = async (id) => {
    try {
      await API.put(`/emi/reject/${id}`);
      alert("EMI Rejected");
      fetchEmis();
    } catch (err) {
      alert("Reject Failed");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "20px" }}>Pending EMI Approvals</h2>

      <div style={tableContainer}>
        <table style={tableStyle}>
          <thead style={thead}>
            <tr>
              <th>User</th>
              <th>EMI No</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Transaction ID</th>
              <th>Mode</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {emis.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: "20px", textAlign: "center" }}>
                  No Pending EMI
                </td>
              </tr>
            ) : (
              emis.map((e) => (
                <tr key={e._id}>
                  <td>{e.user?.name}</td>
                  <td>{e.emiNumber}</td>
                  <td>₹{e.amount}</td>
                  <td>{new Date(e.dueDate).toLocaleDateString()}</td>
                  <td>{e.transactionId}</td>
                  <td>{e.paymentMode}</td>
                  <td>
                    <button
                      style={approveBtn}
                      onClick={() => approve(e._id)}
                    >
                      Approve
                    </button>

                    <button
                      style={rejectBtn}
                      onClick={() => reject(e._id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* UI */

const tableContainer = {
  maxHeight: "65vh",
  overflowY: "auto",
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse"
};

const thead = {
  background: "#111827",
  color: "white",
  position: "sticky",
  top: 0
};

const approveBtn = {
  background: "green",
  color: "white",
  border: "none",
  padding: "6px 12px",
  marginRight: "5px",
  borderRadius: "6px",
  cursor: "pointer"
};

const rejectBtn = {
  background: "red",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer"
};
