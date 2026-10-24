import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [totalTickets, setTotalTickets] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [venueId, setVenueId] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEvents();
    fetchVenues();
  }, []);

  const fetchEvents = async () => {
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
        setMessage(data.message || "Unable to load events");
        return;
      }

      setEvents(data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to backend");
    }
  };

  const fetchVenues = async () => {
    try {
      const response = await fetch(
        "http://localhost:8083/venues",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to load venues");
        return;
      }

      setVenues(data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load venues");
    }
  };

  const clearForm = () => {
    setName("");
    setDate("");
    setTime("");
    setType("");
    setTotalTickets("");
    setTicketPrice("");
    setVenueId("");
    setEditingId(null);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const eventData = {
      name: name,
      date: date,
      time: time,
      type: type,
      totalTickets: Number(totalTickets),
      ticketPrice: Number(ticketPrice),
      venue: {
        id: Number(venueId)
      }
    };

    try {
      let url;
      let method;

      if (editingId === null) {
        url = "http://localhost:8083/events";
        method = "POST";
      } else {
        url = `http://localhost:8083/events/${editingId}`;
        method = "PUT";
      }

      console.log("Method:", method);
      console.log("URL:", url);
      console.log("Data:", eventData);

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(eventData)
      });

      const data = await response.json();

      console.log("Response:", data);

      if (!response.ok) {
        if (typeof data.message === "object") {
          setMessage(
            Object.values(data.message).join(", ")
          );
        } else {
          setMessage(
            data.message || "Operation failed"
          );
        }

        return;
      }

      if (editingId === null) {
        setMessage("Event added successfully");
      } else {
        setMessage("Event updated successfully");
      }

      clearForm();
      fetchEvents();

    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to backend");
    }
  };

  const editEvent = (event) => {
    setEditingId(Number(event.id));

    setName(event.name || "");
    setDate(event.date || "");
    setTime(event.time || "");
    setType(event.type || "");
    setTotalTickets(event.totalTickets ?? "");
    setTicketPrice(event.ticketPrice ?? "");
    setVenueId(event.venue?.id ?? "");

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const deleteEvent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8083/events/${id}`,
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
          data || "Unable to delete event"
        );
        return;
      }

      setMessage("Event deleted successfully");

      if (Number(editingId) === Number(id)) {
        clearForm();
      }

      fetchEvents();

    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to backend");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="dashboard">

        <h1>Manage Events</h1>

        {message && (
          <p>{message}</p>
        )}

        <div className="venue-form">

          <h2>
            {editingId === null
              ? "Add Event"
              : "Update Event"}
          </h2>

          {editingId !== null && (
            <p>
              <strong>Editing Event ID:</strong>{" "}
              {editingId}
            </p>
          )}

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              placeholder="Event Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              required
            />

            <input
              type="text"
              placeholder="Event Time"
              value={time}
              onChange={(e) =>
                setTime(e.target.value)
              }
              required
            />

            <input
              type="text"
              placeholder="Event Type"
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
              required
            />

            <input
              type="number"
              placeholder="Total Tickets"
              min="1"
              value={totalTickets}
              onChange={(e) =>
                setTotalTickets(e.target.value)
              }
              required
            />

            <input
              type="number"
              placeholder="Ticket Price"
              min="1"
              value={ticketPrice}
              onChange={(e) =>
                setTicketPrice(e.target.value)
              }
              required
            />

            <select
              value={venueId}
              onChange={(e) =>
                setVenueId(e.target.value)
              }
              required
            >
              <option value="">
                Select Venue
              </option>

              {venues.map((venue) => (
                <option
                  key={venue.id}
                  value={venue.id}
                >
                  {venue.name}
                </option>
              ))}
            </select>

            {editingId === null ? (
              <button type="submit">
                Add Event
              </button>
            ) : (
              <>
                <button type="submit">
                  Update Event
                </button>

                <button
                  type="button"
                  onClick={clearForm}
                >
                  Cancel Edit
                </button>
              </>
            )}

          </form>
        </div>

        <div className="dashboard-cards">

          {events.map((event) => (
            <div key={event.id}>

              <h2>{event.name}</h2>

              <p>
                <strong>ID:</strong>{" "}
                {event.id}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {event.date}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {event.time}
              </p>

              <p>
                <strong>Type:</strong>{" "}
                {event.type}
              </p>

              <p>
                <strong>Total Tickets:</strong>{" "}
                {event.totalTickets}
              </p>

              <p>
                <strong>Ticket Price:</strong>{" "}
                ₹{event.ticketPrice}
              </p>

              <p>
                <strong>Venue:</strong>{" "}
                {event.venue?.name || "Not available"}
              </p>

              <button
                onClick={() =>
                  editEvent(event)
                }
              >
                Edit
              </button>

              <button
                onClick={() =>
                  deleteEvent(event.id)
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

export default AdminEvents;