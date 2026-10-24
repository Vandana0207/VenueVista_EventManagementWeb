package com.hcl.VenueVista.dto;

public class SalesAnalyticsDTO {

    private long eventId;
    private String eventName;
    private long totalTicketsSold;
    private double totalRevenue;
    private double cancelledRevenue;

    public SalesAnalyticsDTO() {
    }

    public SalesAnalyticsDTO(
            long eventId,
            String eventName,
            long totalTicketsSold,
            double totalRevenue,
            double cancelledRevenue) {

        this.eventId = eventId;
        this.eventName = eventName;
        this.totalTicketsSold = totalTicketsSold;
        this.totalRevenue = totalRevenue;
        this.cancelledRevenue = cancelledRevenue;
    }

    public long getEventId() {
        return eventId;
    }

    public void setEventId(long eventId) {
        this.eventId = eventId;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public long getTotalTicketsSold() {
        return totalTicketsSold;
    }

    public void setTotalTicketsSold(long totalTicketsSold) {
        this.totalTicketsSold = totalTicketsSold;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public double getCancelledRevenue() {
        return cancelledRevenue;
    }

    public void setCancelledRevenue(double cancelledRevenue) {
        this.cancelledRevenue = cancelledRevenue;
    }
}
