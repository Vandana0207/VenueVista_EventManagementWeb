package com.hcl.VenueVista.dto;

public class TicketResponseDTO {

    private long id;
    private int quantity;
    private double totalAmount;
    private String bookingDate;
    private String status;

    private UserResponseDTO user;

    public TicketResponseDTO() {
    }

    public TicketResponseDTO(
            long id,
            int quantity,
            double totalAmount,
            String bookingDate,
            String status,
            UserResponseDTO user) {

        this.id = id;
        this.quantity = quantity;
        this.totalAmount = totalAmount;
        this.bookingDate = bookingDate;
        this.status = status;
        this.user = user;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(String bookingDate) {
        this.bookingDate = bookingDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public UserResponseDTO getUser() {
        return user;
    }

    public void setUser(UserResponseDTO user) {
        this.user = user;
    }
}