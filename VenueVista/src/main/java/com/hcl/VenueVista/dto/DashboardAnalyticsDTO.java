package com.hcl.VenueVista.dto;

public class DashboardAnalyticsDTO {

    private long totalUsers;
    private long totalVenues;
    private long totalEvents;
    private long totalTickets;
    private double totalRevenue;

    public DashboardAnalyticsDTO() {
    }

    public DashboardAnalyticsDTO(long totalUsers, long totalVenues,
                                 long totalEvents, long totalTickets,
                                 double totalRevenue) {
        this.totalUsers = totalUsers;
        this.totalVenues = totalVenues;
        this.totalEvents = totalEvents;
        this.totalTickets = totalTickets;
        this.totalRevenue = totalRevenue;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalVenues() {
        return totalVenues;
    }

    public void setTotalVenues(long totalVenues) {
        this.totalVenues = totalVenues;
    }

    public long getTotalEvents() {
        return totalEvents;
    }

    public void setTotalEvents(long totalEvents) {
        this.totalEvents = totalEvents;
    }

    public long getTotalTickets() {
        return totalTickets;
    }

    public void setTotalTickets(long totalTickets) {
        this.totalTickets = totalTickets;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}