import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function AdminVenues() {
  const [venues, setVenues] = useState([]);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVenues();
  }, []);

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
      setMessage("Unable to connect to backend");
    }
  };

  const clearForm = () => {
    setName("");
    setLocation("");
    setCapacity("");
    setPrice("");
    setDescription("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const venueData = {
      name,
      location,
      capacity: Number(capacity),
      price: Number(price),
      description
    };

    try {
      const url = editingId
        ? `http://localhost:8083/venues/${editingId}`
        : "http://localhost:8083/venues";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(venueData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (typeof data.message === "object") {
          setMessage(
            Object.values(data.message).join(", ")
          );
        } else {
          setMessage(data.message || "Operation failed");
        }

        return;
      }

      setMessage(
        editingId
          ? "Venue updated successfully"
          : "Venue added successfully"
      );

      clearForm();
      fetchVenues();

    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to backend");
    }
  };

  const editVenue = (venue) => {
    setEditingId(venue.id);

    setName(venue.name || "");
    setLocation(venue.location || "");
    setCapacity(venue.capacity || "");
    setPrice(venue.price || "");
    setDescription(venue.description || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const deleteVenue = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this venue?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8083/venues/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.text();

      if (!response.ok) {
        setMessage(data || "Unable to delete venue");
        return;
      }

      setMessage("Venue deleted successfully");

      fetchVenues();

    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to backend");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="dashboard">

        <h1>Manage Venues</h1>

        {message && (
          <p>{message}</p>
        )}

        <div className="venue-form">

          <h2>
            {editingId
              ? "Update Venue"
              : "Add Venue"}
          </h2>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              placeholder="Venue Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              required
            />

            <input
              type="number"
              placeholder="Capacity"
              value={capacity}
              onChange={(e) =>
                setCapacity(e.target.value)
              }
              min="1"
              required
            />

            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              min="1"
              required
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              required
            />

            <button type="submit">
              {editingId
                ? "Update Venue"
                : "Add Venue"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={clearForm}
              >
                Cancel Edit
              </button>
            )}

          </form>

        </div>

        <div className="dashboard-cards">

          {venues.map((venue) => (
            <div key={venue.id}>

              <h2>{venue.name}</h2>

              <p>
                <strong>Location:</strong>{" "}
                {venue.location}
              </p>

              <p>
                <strong>Capacity:</strong>{" "}
                {venue.capacity}
              </p>

              <p>
                <strong>Price:</strong>{" "}
                ₹{venue.price}
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {venue.description}
              </p>

              <button
                onClick={() =>
                  editVenue(venue)
                }
              >
                Edit
              </button>

              <button
                onClick={() =>
                  deleteVenue(venue.id)
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

export default AdminVenues;