import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);

  const [resetUser, setResetUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    try {
      const res = await API.get(
        `/admin/users?page=${page}&limit=5&search=${search}`
      );

      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
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
    await API.put(`/admin/users/${editingUser._id}`, {
      name: editingUser.name,
      role: editingUser.role,
    });
    setEditingUser(null);
    fetchUsers();
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
      toast.error(
        err.response?.data?.message || "Reset failed"
      );
    }
  };

  return (
    <>
      <h2>All Users</h2>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        style={{ padding: "8px", marginBottom: "15px" }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => setEditingUser(user)}>
                    Edit
                  </button>

                  <button
                    style={{ marginLeft: "8px", color: "red" }}
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>

                  <button
                    style={{
                      marginLeft: "8px",
                      background: "#e74a3b",
                      color: "white",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                    onClick={() => setResetUser(user)}
                  >
                    Reset Password
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* RESET PASSWORD MODAL */}
      {resetUser && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "8px",
            width: "300px"
          }}>
            <h3>Reset Password</h3>
            <p>{resetUser.email}</p>

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />

            <div style={{ marginTop: "10px" }}>
              <button onClick={handleAdminReset}>
                Confirm
              </button>

              <button
                style={{ marginLeft: "10px" }}
                onClick={() => {
                  setResetUser(null);
                  setNewPassword("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
