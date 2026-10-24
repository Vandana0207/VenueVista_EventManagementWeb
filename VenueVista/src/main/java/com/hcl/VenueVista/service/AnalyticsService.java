package com.hcl.VenueVista.service;

import com.hcl.VenueVista.dto.SalesAnalyticsDTO;
import com.hcl.VenueVista.model.Event;
import com.hcl.VenueVista.repository.EventRepository;
import com.hcl.VenueVista.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private EventRepository eventRepository;

    public SalesAnalyticsDTO getEventSalesAnalytics(Long eventId) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Long totalTicketsSold = ticketRepository.getBookedTickets(eventId);

        Double totalRevenue = ticketRepository.getTotalRevenue(eventId);

        Double cancelledRevenue = ticketRepository.getCancelledRevenue(eventId);

        return new SalesAnalyticsDTO(
                event.getId(),
                event.getName(),
                totalTicketsSold,
                totalRevenue,
                cancelledRevenue
        );
    }
}