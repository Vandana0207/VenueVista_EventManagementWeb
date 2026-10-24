package com.hcl.VenueVista.dto;

public class SeatAvailabilityDTO {

    private long eventId;
    private long totalSeats;
    private long availableSeats;
    private long bookedSeats;

    public SeatAvailabilityDTO() {
    }

    public SeatAvailabilityDTO(long eventId, long totalSeats,
                               long availableSeats, long bookedSeats) {
        this.eventId = eventId;
        this.totalSeats = totalSeats;
        this.availableSeats = availableSeats;
        this.bookedSeats = bookedSeats;
    }

    public long getEventId() {
        return eventId;
    }

    public void setEventId(long eventId) {
        this.eventId = eventId;
    }

    public long getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(long totalSeats) {
        this.totalSeats = totalSeats;
    }

    public long getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(long availableSeats) {
        this.availableSeats = availableSeats;
    }

    public long getBookedSeats() {
        return bookedSeats;
    }

    public void setBookedSeats(long bookedSeats) {
        this.bookedSeats = bookedSeats;
    }
}