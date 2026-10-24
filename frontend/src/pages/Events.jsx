import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Events() {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:8083/events",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Unable to load events"
        );
        return;
      }

      setEvents(data);

    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to backend");
    }
  };

  const handleBookTicket = (eventId) => {
    window.location.href = `/book/${eventId}`;
  };

  return (
    <div>
      <Navbar />

      <div className="dashboard">

        <h1>Upcoming Events</h1>

        <p>
          Discover events and book your seats.
        </p>

        {message && (
          <p>{message}</p>
        )}

        {events.length === 0 && !message && (
          <p>No events available.</p>
        )}

        <div className="dashboard-cards">

          {events.map((event) => (
            <div
              key={event.id}
              className="event-card"
            >

              <span className="event-type">
                {event.type}
              </span>

              <h2>{event.name}</h2>

              <div className="event-details">

                <p>
                  📅 <strong>Date:</strong>{" "}
                  {event.date}
                </p>

                <p>
                  ⏰ <strong>Time:</strong>{" "}
                  {event.time}
                </p>

                <p>
                  🎟️ <strong>Tickets:</strong>{" "}
                  {event.totalTickets}
                </p>

                <p>
                  💰 <strong>Price:</strong>{" "}
                  ₹{event.ticketPrice}
                </p>

                <p>
                  📍 <strong>Venue:</strong>{" "}
                  {event.venue?.name || "Not available"}
                </p>

                <p>
                  📌 <strong>Location:</strong>{" "}
                  {event.venue?.location || "Not available"}
                </p>

              </div>

              <button
                onClick={() =>
                  handleBookTicket(event.id)
                }
              >
                Book Ticket
              </button>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default Events;