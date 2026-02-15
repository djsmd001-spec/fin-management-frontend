import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [resetUser, setResetUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    users: 0
  });

  const [animatedStats, setAnimatedStats] = useState({
    total: 0,
    admins: 0,
    users: 0
  });

  useEffect(() => {
    fetchUsers();
  }, [search]);

  // 🔥 Animated Counter
  useEffect(() => {
    const duration = 800;
    const steps = 30;

    const animate = (key) => {
      let start = 0;
      const end = stats[key];
      const increment = end / steps;

      const counter = setInterval(() => {
        start += increment;
        if (start >= end) {
          setAnimatedStats(prev => ({ ...prev, [key]: end }));
          clearInterval(counter);
        } else {
          setAnimatedStats(prev => ({
            ...prev,
            [key]: Math.floor(start)
          }));
        }
      }, duration / steps);
    };

    animate("total");
    animate("admins");
    animate("users");

  }, [stats]);

  const fetchUsers = async () => {
    try {
      const res = await API.get(`/admin/users?limit=100&search=${search}`);
      const userList = res.data.users || [];

      setUsers(userList);

      const total = userList.length;
      const admins = userList.filter(u => u.role === "admin").length;
      const normalUsers = userList.filter(u => u.role === "user").length;

      setStats({ total, admins, users: normalUsers });

    } catch (error) {
      console.error(error);
      setUsers([]);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await API.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  const updateUser = async () => {
    try {
      await API.put(`/admin/users/${editingUser._id}`, {
        name: editingUser.name,
        role: editingUser.role,
      });

      toast.success("User updated ✅");
      setEditingUser(null);
      fetchUsers();

    } catch {
      toast.error("Update failed");
    }
  };

  const handleAdminReset = async () => {
    if (!newPassword) {
      toast.error("Enter new password");
      return;
    }

    try {
      await API.post("/auth/admin-reset-password", {
        userId: resetUser._id,
        newPassword,
      });

      toast.success("Password reset successfully ✅");
      setResetUser(null);
      setNewPassword("");

    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div style={styles.page}>

      <style>{`
        .card {
          background: white;
          border-radius: 14px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
        }
        .stats-card {
          background: linear-gradient(135deg,#6366f1,#8b5cf6);
          color: white;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }
        .table-wrapper {
          max-height: 320px; /* 🔥 5 rows approx */
          overflow-y: auto;
          border-radius: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 14px;
          text-align: left;
        }
        thead {
          background: #f3f4f6;
          position: sticky;
          top: 0;
          z-index: 1;
        }
        tbody tr:hover {
          background: #f9fafb;
        }
        .badge {
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .badge.admin {
          background: #ede9fe;
          color: #6d28d9;
        }
        .badge.user {
          background: #e0f2fe;
          color: #0369a1;
        }
        .btn {
          padding: 6px 10px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          margin-right: 6px;
          font-size: 12px;
        }
        .edit { background:#3b82f6; color:white; }
        .delete { background:#ef4444; color:white; }
        .reset { background:linear-gradient(135deg,#f97316,#ef4444); color:white; }
        .modal-overlay {
          position: fixed;
          top:0; left:0;
          width:100%; height:100%;
          background: rgba(0,0,0,0.4);
          display:flex;
          justify-content:center;
          align-items:center;
        }
        .modal {
          background:white;
          padding:25px;
          border-radius:12px;
          width:320px;
        }
      `}</style>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div className="stats-card">
          <h2>{animatedStats.total}</h2>
          <p>Total Users</p>
        </div>
        <div className="stats-card">
          <h2>{animatedStats.admins}</h2>
          <p>Admins</p>
        </div>
        <div className="stats-card">
          <h2>{animatedStats.users}</h2>
          <p>Normal Users</p>
        </div>
      </div>

      <div className="card">

        <div style={styles.header}>
          <h2>User Management</h2>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.search}
          />
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={
                      user.role === "admin"
                        ? "badge admin"
                        : "badge user"
                    }>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn edit"
                      onClick={() => setEditingUser(user)}
                    >Edit</button>

                    <button
                      className="btn delete"
                      onClick={() => deleteUser(user._id)}
                    >Delete</button>

                    <button
                      className="btn reset"
                      onClick={() => setResetUser(user)}
                    >Reset</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}

const styles = {
  page: {
    padding: "30px",
    background: "#f5f7fa",
    minHeight: "100vh"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "20px",
    marginBottom: "30px"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px"
  },
  search: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd"
  }
};
