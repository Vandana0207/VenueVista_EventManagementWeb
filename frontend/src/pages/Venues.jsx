import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Venues() {
  const [venues, setVenues] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    const token = localStorage.getItem("token");

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
      setMessage("Unable to connect to backend");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="dashboard">
        <h1>Venues</h1>

        {message && <p>{message}</p>}

        <div className="dashboard-cards">
          {venues.map((venue) => (
            <div key={venue.id}>
              <h2>{venue.name}</h2>

              <p>
                <strong>Location:</strong> {venue.location}
              </p>

              <p>
                <strong>Capacity:</strong> {venue.capacity}
              </p>

              <p>
                <strong>Price:</strong> ₹{venue.price}
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {venue.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Venues;