import { useEffect, useState } from "react";
import API from "../../services/api";

export default function LoansPage() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    const res = await API.get("/admin/loans");
    setLoans(res.data);
  };

  const approveLoan = async (id) => {
    await API.put(`/loans/approve/${id}`);
    fetchLoans();
  };

  const rejectLoan = async (id) => {
    await API.put(`/loans/reject/${id}`);
    fetchLoans();
  };

  return (
    <>
      <h2>Loan Management</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>User</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {loans.map((loan) => (
            <tr key={loan._id}>
              <td>{loan.user?.name}</td>
              <td>₹{loan.amount}</td>
              <td>{loan.status}</td>
              <td>
                {loan.status === "pending" && (
                  <>
                    <button onClick={() => approveLoan(loan._id)}>
                      Approve
                    </button>
                    <button onClick={() => rejectLoan(loan._id)}>
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

const styles = {
  table: {
    width: "100%",
    marginTop: "20px",
    borderCollapse: "collapse"
  }
};
