import { useEffect, useState } from "react";
import API from "../../services/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const res = await API.get("/notifications/my");
    setNotifications(res.data);
  };

  return (
    <div>
      <h2>Notifications</h2>

      {notifications.map((n) => (
        <div key={n._id} style={card}>
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px"
};
