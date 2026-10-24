import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function AdminSeats() {
  const [seats, setSeats] = useState([]);
  const [events, setEvents] = useState([]);

  const [seatNumber, setSeatNumber] = useState("");
  const [seatType, setSeatType] = useState("");
  const [eventId, setEventId] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSeats();
    fetchEvents();
  }, []);

  const fetchSeats = async () => {
    try {
      const response = await fetch(
        "http://localhost:8083/seats",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Unable to load seats"
        );
        return;
      }

      setSeats(data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to backend");
    }
  };

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
        setMessage(
          data.message || "Unable to load events"
        );
        return;
      }

      setEvents(data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load events");
    }
  };

  const clearForm = () => {
    setSeatNumber("");
    setSeatType("");
    setEventId("");
    setEditingId(null);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const seatData = {
      seatNumber,
      seatType,
      status: "AVAILABLE",
      event: {
        id: Number(eventId)
      }
    };

    try {
      let url;
      let method;

      if (editingId === null) {
        url = "http://localhost:8083/seats";
        method = "POST";
      } else {
        url = `http://localhost:8083/seats/${editingId}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(seatData)
      });

      const data = await response.json();

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

      setMessage(
        editingId === null
          ? "Seat added successfully"
          : "Seat updated successfully"
      );

      clearForm();
      fetchSeats();

    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to backend");
    }
  };

  const editSeat = (seat) => {
    setEditingId(Number(seat.id));
    setSeatNumber(seat.seatNumber || "");
    setSeatType(seat.seatType || "");
    setEventId(seat.event?.id ?? "");

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const deleteSeat = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this seat?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8083/seats/${id}`,
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
          data || "Unable to delete seat"
        );
        return;
      }

      setMessage("Seat deleted successfully");

      if (Number(editingId) === Number(id)) {
        clearForm();
      }

      fetchSeats();

    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to backend");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="dashboard">

        <h1>Manage Seats</h1>

        {message && (
          <p>{message}</p>
        )}

        <div className="venue-form">

          <h2>
            {editingId === null
              ? "Add Seat"
              : "Update Seat"}
          </h2>

          {editingId !== null && (
            <p>
              <strong>Editing Seat ID:</strong>{" "}
              {editingId}
            </p>
          )}

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              placeholder="Seat Number"
              value={seatNumber}
              onChange={(e) =>
                setSeatNumber(e.target.value)
              }
              required
            />

            <select
              value={seatType}
              onChange={(e) =>
                setSeatType(e.target.value)
              }
              required
            >
              <option value="">
                Select Seat Type
              </option>

              <option value="VIP">
                VIP
              </option>

              <option value="REGULAR">
                REGULAR
              </option>
            </select>

            <select
              value={eventId}
              onChange={(e) =>
                setEventId(e.target.value)
              }
              required
            >
              <option value="">
                Select Event
              </option>

              {events.map((event) => (
                <option
                  key={event.id}
                  value={event.id}
                >
                  {event.name}
                </option>
              ))}
            </select>

            {editingId === null ? (
              <button type="submit">
                Add Seat
              </button>
            ) : (
              <>
                <button type="submit">
                  Update Seat
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

          {seats.map((seat) => (
            <div key={seat.id}>

              <h2>
                Seat {seat.seatNumber}
              </h2>

              <p>
                <strong>ID:</strong>{" "}
                {seat.id}
              </p>

              <p>
                <strong>Type:</strong>{" "}
                {seat.seatType}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {seat.status}
              </p>

              <p>
                <strong>Event:</strong>{" "}
                {seat.event?.name || "Not available"}
              </p>

              <button
                onClick={() => editSeat(seat)}
              >
                Edit
              </button>

              <button
                onClick={() => deleteSeat(seat.id)}
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

export default AdminSeats;