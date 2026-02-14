import { useEffect, useState } from "react";
import API from "../../services/api";

export default function EmiRequests() {
  const [emis, setEmis] = useState([]);

  useEffect(() => {
    fetchEmis();
  }, []);

  const fetchEmis = async () => {
    const res = await API.get("/emi/pending");
    setEmis(res.data);
  };

  const approve = async (id) => {
    await API.put(`/emi/approve/${id}`);
    fetchEmis();
  };

  const reject = async (id) => {
    await API.put(`/emi/reject/${id}`);
    fetchEmis();
  };

  return (
    <div>
      <h2>EMI Payment Requests</h2>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>User</th>
            <th>EMI No</th>
            <th>Amount</th>
            <th>Transaction ID</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {emis.map((e) => (
            <tr key={e._id}>
              <td>{e.user?.name}</td>
              <td>{e.emiNumber}</td>
              <td>₹{e.amount}</td>
              <td>{e.transactionId}</td>
              <td>
                <button onClick={() => approve(e._id)}>Approve</button>
                <button onClick={() => reject(e._id)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
