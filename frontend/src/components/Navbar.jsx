import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h2>VenueVista</h2>

      <div className="nav-links">

        {user?.role === "USER" && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/events">Events</Link>
            <Link to="/venues">Venues</Link>
            <Link to="/tickets">My Tickets</Link>
          </>
        )}

        {user?.role === "ADMIN" && (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/venues">Venues</Link>
            <Link to="/admin/events">Events</Link>
            <Link to="/admin/seats">Seats</Link>
            <Link to="/admin/tickets">Tickets</Link>
          </>
        )}

        <button onClick={handleLogout}>
          Logout
        </button>

      </div>
    </nav>
  );
}

export default Navbar;