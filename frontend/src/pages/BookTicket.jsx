import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function BookTicket() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [bookingDate, setBookingDate] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEvent();
    fetchSeats();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(
        `http://localhost:8083/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to load event");
        return;
      }

      setEvent(data);

    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to backend");
    }
  };

  const fetchSeats = async () => {
    try {
      const response = await fetch(
        `http://localhost:8083/seats/event/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to load seats");
        return;
      }

      setSeats(
        data.filter(
          (seat) => seat.status === "AVAILABLE"
        )
      );

    } catch (error) {
      console.error(error);
      setMessage("Unable to load seats");
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!selectedSeat) {
      setMessage("Please select a seat");
      return;
    }

    if (!bookingDate) {
      setMessage("Please select booking date");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8083/tickets",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            quantity: Number(quantity),
            bookingDate: bookingDate,
            event: {
              id: Number(eventId)
            },
            seat: {
              id: Number(selectedSeat)
            }
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Booking failed"
        );
        return;
      }

      setMessage("Ticket booked successfully");

      setTimeout(() => {
        navigate("/tickets");
      }, 1000);

    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to backend");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="dashboard">

        <h1>Book Ticket</h1>

        {message && (
          <p>{message}</p>
        )}

        {event && (
          <div className="booking-box">

            <h2>{event.name}</h2>

            <p>
              <strong>Date:</strong> {event.date}
            </p>

            <p>
              <strong>Time:</strong> {event.time}
            </p>

            <p>
              <strong>Type:</strong> {event.type}
            </p>

            <p>
              <strong>Ticket Price:</strong>{" "}
              ₹{event.ticketPrice}
            </p>

            <form onSubmit={handleBooking}>

              <label>
                Select Seat
              </label>

              <select
                value={selectedSeat}
                onChange={(e) =>
                  setSelectedSeat(e.target.value)
                }
              >
                <option value="">
                  Select available seat
                </option>

                {seats.map((seat) => (
                  <option
                    key={seat.id}
                    value={seat.id}
                  >
                    {seat.seatNumber} -{" "}
                    {seat.seatType}
                  </option>
                ))}
              </select>

              <label>
                Quantity
              </label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
              />

              <label>
                Booking Date
              </label>

              <input
                type="date"
                value={bookingDate}
                onChange={(e) =>
                  setBookingDate(e.target.value)
                }
              />

              <button type="submit">
                Book Ticket
              </button>

            </form>

          </div>
        )}

      </div>
    </div>
  );
}

export default BookTicket;