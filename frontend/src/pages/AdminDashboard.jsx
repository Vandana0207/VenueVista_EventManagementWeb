import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <Navbar />

      <div className="dashboard">

        <h1>Admin Dashboard</h1>

        <p>
          Welcome, <strong>{user?.name}</strong>
        </p>

        <div className="dashboard-cards">

          <Link
            to="/admin/users"
            className="dashboard-card-link"
          >
            <div>
              <h2>Users</h2>
              <p>
                View and manage registered users.
              </p>
            </div>
          </Link>

          <Link
            to="/admin/venues"
            className="dashboard-card-link"
          >
            <div>
              <h2>Venues</h2>
              <p>
                Add, update and manage venues.
              </p>
            </div>
          </Link>

          <Link
            to="/admin/events"
            className="dashboard-card-link"
          >
            <div>
              <h2>Events</h2>
              <p>
                Create and manage events.
              </p>
            </div>
          </Link>

          <Link
            to="/admin/seats"
            className="dashboard-card-link"
          >
            <div>
              <h2>Seats</h2>
              <p>
                Manage event seats and availability.
              </p>
            </div>
          </Link>

          <Link
            to="/admin/tickets"
            className="dashboard-card-link"
          >
            <div>
              <h2>Tickets</h2>
              <p>
                View, cancel and delete bookings.
              </p>
            </div>
          </Link>

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;