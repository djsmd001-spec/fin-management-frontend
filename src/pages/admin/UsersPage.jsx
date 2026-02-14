import { useEffect, useState } from "react";
import API from "../../services/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>👥 All Users</h2>
          <span style={styles.count}>{users.length} Users</span>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.theadRow}>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} style={styles.tr}>
                  <td style={styles.td}>{user.name}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        background:
                          user.role === "admin"
                            ? "#4f46e5"
                            : "#10b981"
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div style={styles.empty}>No users found 🚫</div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    background: "#f3f4f6",
    minHeight: "100vh"
  },

  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "25px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },

  title: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "600",
    color: "#111827"
  },

  count: {
    background: "#e0e7ff",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#4338ca"
  },

  tableWrapper: {
    overflowX: "auto"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  theadRow: {
    background: "#f9fafb"
  },

  th: {
    padding: "14px",
    textAlign: "left",
    fontSize: "14px",
    color: "#6b7280",
    borderBottom: "1px solid #e5e7eb"
  },

  tr: {
    transition: "all 0.2s ease",
  },

  td: {
    padding: "14px",
    borderBottom: "1px solid #f3f4f6",
    fontSize: "14px",
    color: "#374151"
  },

  badge: {
    padding: "6px 12px",
    borderRadius: "20px",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "500",
    textTransform: "capitalize"
  },

  empty: {
    padding: "20px",
    textAlign: "center",
    color: "#9ca3af"
  }
};
