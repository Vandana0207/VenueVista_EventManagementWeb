import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Events from "./pages/Events";
import Venues from "./pages/Venues";
import MyTickets from "./pages/MyTickets";
import BookTicket from "./pages/BookTicket";
import AdminUsers from "./pages/AdminUsers";
import AdminVenues from "./pages/AdminVenues";
import AdminEvents from "./pages/AdminEvents";
import AdminSeats from "./pages/AdminSeats";
import AdminTickets from "./pages/AdminTickets";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:8083/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      window.location.href =
        data.user.role === "ADMIN"
          ? "/admin"
          : "/dashboard";

    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <h1>VenueVista</h1>
        <h2>Login</h2>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

        {message && <p>{message}</p>}

      </div>
    </div>
  );
}

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* USER */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="USER">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

        <Route
            path="/events"
            element={
              <ProtectedRoute role="USER">
                <Events />
              </ProtectedRoute>
            }
          />
          <Route
              path="/venues"
              element={
                <ProtectedRoute role="USER">
                  <Venues />
                </ProtectedRoute>
              }
            />
             <Route
                path="/tickets"
                element={
                  <ProtectedRoute role="USER">
                    <MyTickets />
                  </ProtectedRoute>
                }
              />
              <Route
                  path="/book/:eventId"
                  element={
                    <ProtectedRoute role="USER">
                      <BookTicket />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute role="ADMIN">
                      <AdminUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/venues"
                  element={
                    <ProtectedRoute role="ADMIN">
                      <AdminVenues />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/events"
                  element={
                    <ProtectedRoute role="ADMIN">
                      <AdminEvents />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/seats"
                  element={
                    <ProtectedRoute role="ADMIN">
                      <AdminSeats />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/tickets"
                  element={
                    <ProtectedRoute role="ADMIN">
                      <AdminTickets />
                    </ProtectedRoute>
                  }
                />
      </Routes>

    </BrowserRouter>
  );
}

export default App;