export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: "40px" }}>
      <h1>Welcome {user?.name}</h1>
      <p>This is FIN Management Dashboard</p>
    </div>
  );
}
