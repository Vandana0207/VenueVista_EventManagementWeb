import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "http://localhost:8083/users",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to load users");
        return;
      }

      setUsers(data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to backend");
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8083/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.text();

      if (!response.ok) {
        setMessage(data || "Unable to delete user");
        return;
      }

      setMessage("User deleted successfully");

      fetchUsers();
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to backend");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="dashboard">

        <h1>Manage Users</h1>

        {message && (
          <p>{message}</p>
        )}

        <div className="dashboard-cards">

          {users.map((user) => (
            <div key={user.id}>

              <h2>{user.name}</h2>

              <p>
                <strong>ID:</strong> {user.id}
              </p>

              <p>
                <strong>Email:</strong> {user.email}
              </p>

              <p>
                <strong>Role:</strong> {user.role}
              </p>

              <button
                onClick={() => deleteUser(user.id)}
              >
                Delete
              </button>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default AdminUsers;