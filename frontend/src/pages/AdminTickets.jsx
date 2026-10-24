import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch(
        "http://localhost:8083/tickets",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Unable to load tickets"
        );
        return;
      }

      setTickets(data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to backend");
    }
  };

  const cancelTicket = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this ticket?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8083/tickets/${id}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Unable to cancel ticket"
        );
        return;
      }

      setMessage("Ticket cancelled successfully");

      fetchTickets();
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to backend");
    }
  };

  const deleteTicket = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8083/tickets/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.text();

      if (!response.ok) {
        setMessage(
          data || "Unable to delete ticket"
        );
        return;
      }

      setMessage("Ticket deleted successfully");

      fetchTickets();
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to backend");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="dashboard">

        <h1>Manage Tickets</h1>

        {message && (
          <p>{message}</p>
        )}

        {tickets.length === 0 && !message && (
          <p>No tickets available.</p>
        )}

        <div className="dashboard-cards">

          {tickets.map((ticket) => (
            <div key={ticket.id}>

              <h2>
                Ticket #{ticket.id}
              </h2>

              <p>
                <strong>User:</strong>{" "}
                {ticket.user?.name || "Unknown"}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {ticket.user?.email || "Unknown"}
              </p>

              <p>
                <strong>Quantity:</strong>{" "}
                {ticket.quantity}
              </p>

              <p>
                <strong>Total Amount:</strong>{" "}
                ₹{ticket.totalAmount}
              </p>

              <p>
                <strong>Booking Date:</strong>{" "}
                {ticket.bookingDate}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {ticket.status}
              </p>

              {ticket.status !== "CANCELLED" && (
                <button
                  onClick={() =>
                    cancelTicket(ticket.id)
                  }
                >
                  Cancel Ticket
                </button>
              )}

              <button
                onClick={() =>
                  deleteTicket(ticket.id)
                }
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

export default AdminTickets;