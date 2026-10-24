import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <Navbar />

      <div className="dashboard">

        <h1>Welcome to VenueVista</h1>

        <p>
          Hello, <strong>{user?.name}</strong>
        </p>

        <div className="dashboard-cards">

          <Link
            to="/events"
            className="dashboard-card-link"
          >
            <div>
              <h2>Events</h2>
              <p>
                Explore upcoming events and
                book your tickets.
              </p>
            </div>
          </Link>

          <Link
            to="/venues"
            className="dashboard-card-link"
          >
            <div>
              <h2>Venues</h2>
              <p>
                View available venues and
                their details.
              </p>
            </div>
          </Link>

          <Link
            to="/tickets"
            className="dashboard-card-link"
          >
            <div>
              <h2>My Tickets</h2>
              <p>
                View and manage your bookings.
              </p>
            </div>
          </Link>

        </div>

      </div>
    </div>
  );
}

export default UserDashboard;