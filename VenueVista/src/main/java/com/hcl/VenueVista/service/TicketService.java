package com.hcl.VenueVista.service;

import com.hcl.VenueVista.model.Event;
import com.hcl.VenueVista.model.Seat;
import com.hcl.VenueVista.model.Ticket;
import com.hcl.VenueVista.model.User;
import com.hcl.VenueVista.repository.EventRepository;
import com.hcl.VenueVista.repository.SeatRepository;
import com.hcl.VenueVista.repository.TicketRepository;
import com.hcl.VenueVista.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private SeatRepository seatRepository;

    // Create ticket
    public Ticket saveTicket(Ticket ticket) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException("User is not authenticated");
        }

        String loggedInEmail = authentication.getName();

        // Get user from JWT email
        User user = userRepository.findByEmail(loggedInEmail)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (ticket.getEvent() == null ||
                ticket.getEvent().getId() == 0) {

            throw new RuntimeException("Event is required");
        }

        if (ticket.getSeat() == null ||
                ticket.getSeat().getId() == 0) {

            throw new RuntimeException("Seat is required");
        }

        Event event = eventRepository
                .findById(ticket.getEvent().getId())
                .orElseThrow(() ->
                        new RuntimeException("Event not found"));

        Seat seat = seatRepository
                .findById(ticket.getSeat().getId())
                .orElseThrow(() ->
                        new RuntimeException("Seat not found"));

        if (ticket.getQuantity() <= 0) {
            throw new RuntimeException(
                    "Ticket quantity must be greater than 0"
            );
        }

        if (seat.getEvent() == null ||
                seat.getEvent().getId() != event.getId()) {

            throw new RuntimeException(
                    "Seat does not belong to this event"
            );
        }

        if (!seat.getStatus().equalsIgnoreCase("AVAILABLE")) {
            throw new RuntimeException("Seat is already booked");
        }

        Long bookedTickets =
                ticketRepository.getBookedTickets(event.getId());

        long availableTickets =
                event.getTotalTickets() - bookedTickets;

        if (ticket.getQuantity() > availableTickets) {
            throw new RuntimeException(
                    "Only " + availableTickets +
                            " tickets are available"
            );
        }

        double totalAmount =
                ticket.getQuantity() * event.getTicketPrice();

        // Use authenticated user from JWT
        ticket.setUser(user);
        ticket.setEvent(event);
        ticket.setSeat(seat);
        ticket.setTotalAmount(totalAmount);
        ticket.setStatus("CONFIRMED");

        seat.setStatus("BOOKED");
        seatRepository.save(seat);

        return ticketRepository.save(ticket);
    }

    // Update ticket
    public Ticket updateTicket(Long id, Ticket updatedTicket) {

        Ticket existingTicket = ticketRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Ticket not found"));

        checkTicketAccess(existingTicket);

        if (updatedTicket.getQuantity() <= 0) {
            throw new RuntimeException(
                    "Ticket quantity must be greater than 0"
            );
        }

        Event event = existingTicket.getEvent();

        Long bookedTickets =
                ticketRepository.getBookedTickets(event.getId());

        if (existingTicket.getStatus().equalsIgnoreCase("CONFIRMED")) {
            bookedTickets =
                    bookedTickets - existingTicket.getQuantity();
        }

        long availableTickets =
                event.getTotalTickets() - bookedTickets;

        if (updatedTicket.getQuantity() > availableTickets) {
            throw new RuntimeException(
                    "Only " + availableTickets +
                            " tickets are available"
            );
        }

        double totalAmount =
                updatedTicket.getQuantity() *
                        event.getTicketPrice();

        existingTicket.setQuantity(
                updatedTicket.getQuantity()
        );

        existingTicket.setBookingDate(
                updatedTicket.getBookingDate()
        );

        existingTicket.setTotalAmount(totalAmount);

        return ticketRepository.save(existingTicket);
    }

    // Get all tickets
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // Get tickets of logged-in user
    public List<Ticket> getMyTickets() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException("User is not authenticated");
        }

        String loggedInEmail = authentication.getName();
         System.out.println("Logged in email: " + loggedInEmail);
         
        return ticketRepository.findAll()
                .stream()
                .filter(ticket ->
                        ticket.getUser() != null &&
                        ticket.getUser()
                                .getEmail()
                                .equals(loggedInEmail))
                .toList();
    }

    // Get ticket by ID
    public Optional<Ticket> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }

    // Cancel ticket
    public Ticket cancelTicket(Long id) {

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Ticket not found"));

        checkTicketAccess(ticket);

        if (ticket.getStatus()
                .equalsIgnoreCase("CANCELLED")) {

            throw new RuntimeException(
                    "Ticket is already cancelled"
            );
        }

        ticket.setStatus("CANCELLED");

        if (ticket.getSeat() != null) {

            Seat seat = ticket.getSeat();

            seat.setStatus("AVAILABLE");

            seatRepository.save(seat);
        }

        return ticketRepository.save(ticket);
    }

    // Check ticket ownership
    private void checkTicketAccess(Ticket ticket) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String loggedInEmail =
                authentication.getName();

        boolean isAdmin =
                authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                authority.getAuthority()
                                        .equals("ROLE_ADMIN"));

        if (isAdmin) {
            return;
        }

        if (ticket.getUser() == null ||
                !ticket.getUser()
                        .getEmail()
                        .equals(loggedInEmail)) {

            throw new RuntimeException(
                    "You are not allowed to manage this ticket"
            );
        }
    }

    // Delete ticket
    public void deleteTicket(Long id) {

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Ticket not found"));

        checkTicketAccess(ticket);

        if (ticket.getSeat() != null) {

            Seat seat = ticket.getSeat();

            seat.setStatus("AVAILABLE");

            seatRepository.save(seat);
        }

        ticketRepository.deleteById(id);
    }
}