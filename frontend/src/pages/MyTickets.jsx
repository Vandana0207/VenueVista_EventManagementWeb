import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {

    if (!token) {
      setMessage("Please login again");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8083/tickets/my",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
          }
        }
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      console.log("Status:", response.status);
      console.log("Response:", data);

      if (!response.ok) {
        if (typeof data === "object" && data.message) {
          setMessage(
            typeof data.message === "object"
              ? Object.values(data.message).join(", ")
              : data.message
          );
        } else {
          setMessage("Unable to load tickets");
        }

        return;
      }

      setTickets(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error("Fetch error:", error);
      setMessage("Unable to connect to backend");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="dashboard">

        <h1>My Tickets</h1>

        {message && (
          <p>{message}</p>
        )}

        {!message && tickets.length === 0 && (
          <p>No tickets found.</p>
        )}

        <div className="dashboard-cards">

          {tickets.map((ticket) => (
            <div key={ticket.id}>

              <h2>Ticket #{ticket.id}</h2>

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

              {ticket.user && (
                <p>
                  <strong>User:</strong>{" "}
                  {ticket.user.email}
                </p>
              )}

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default MyTickets;