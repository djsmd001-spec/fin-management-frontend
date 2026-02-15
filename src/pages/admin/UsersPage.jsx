import { useEffect, useState } from "react";
import API from "../../services/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);

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
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={{ marginTop: "15px" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {editingUser && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.3)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "8px"
          }}>
            <h3>Edit User</h3>

            <input
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  name: e.target.value
                })
              }
            />

            <select
              value={editingUser.role}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  role: e.target.value
                })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div style={{ marginTop: "10px" }}>
              <button onClick={updateUser}>Save</button>
              <button
                style={{ marginLeft: "10px" }}
                onClick={() => setEditingUser(null)}
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
