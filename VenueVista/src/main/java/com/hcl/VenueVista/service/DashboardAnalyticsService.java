package com.hcl.VenueVista.service;

import com.hcl.VenueVista.dto.DashboardAnalyticsDTO;
import com.hcl.VenueVista.repository.EventRepository;
import com.hcl.VenueVista.repository.TicketRepository;
import com.hcl.VenueVista.repository.UserRepository;
import com.hcl.VenueVista.repository.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardAnalyticsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VenueRepository venueRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private TicketRepository ticketRepository;

    public DashboardAnalyticsDTO getDashboardAnalytics() {

        long totalUsers = userRepository.count();
        long totalVenues = venueRepository.count();
        long totalEvents = eventRepository.count();
        long totalTickets = ticketRepository.count();

        double totalRevenue = ticketRepository.findAll()
                .stream()
                .filter(ticket -> ticket.getStatus().equalsIgnoreCase("CONFIRMED"))
                .mapToDouble(ticket -> ticket.getTotalAmount())
                .sum();

        return new DashboardAnalyticsDTO(
                totalUsers,
                totalVenues,
                totalEvents,
                totalTickets,
                totalRevenue
        );
    }
}
