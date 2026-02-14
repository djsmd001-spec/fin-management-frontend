import { useEffect, useState } from "react";
import API from "../../services/api";

export default function DepositRequests() {
  const [deposits, setDeposits] = useState([]);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    const res = await API.get("/deposits/pending");
    setDeposits(res.data);
  };

  const approve = async (id) => {
    await API.put(`/deposits/approve/${id}`);
    fetchDeposits();
  };

  const reject = async (id) => {
    await API.put(`/deposits/reject/${id}`);
    fetchDeposits();
  };

  return (
    <div>
      <h2>Deposit Requests</h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>User</th>
            <th>Amount</th>
            <th>Penalty</th>
            <th>Mode</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {deposits.map((d) => (
            <tr key={d._id}>
              <td>{d.user?.name}</td>
              <td>₹{d.amount}</td>
              <td>₹{d.penalty}</td>
              <td>{d.paymentMode}</td>
              <td>
                <button onClick={() => approve(d._id)}>Approve</button>
                <button onClick={() => reject(d._id)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
