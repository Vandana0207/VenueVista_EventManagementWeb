package com.hcl.VenueVista.controller;

import com.hcl.VenueVista.dto.TicketResponseDTO;
import com.hcl.VenueVista.dto.UserResponseDTO;
import com.hcl.VenueVista.model.Ticket;
import com.hcl.VenueVista.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // Create ticket
    @PostMapping
    public TicketResponseDTO saveTicket(
            @Valid @RequestBody Ticket ticket) {

        Ticket savedTicket =
                ticketService.saveTicket(ticket);

        return convertToDTO(savedTicket);
    }

    // Get all tickets
    @GetMapping
    public List<TicketResponseDTO> getAllTickets() {

        return ticketService.getAllTickets()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // Get tickets of logged-in user
    @GetMapping("/my")
    public List<TicketResponseDTO> getMyTickets() {

        return ticketService.getMyTickets()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // Get ticket by ID
    @GetMapping("/{id}")
    public TicketResponseDTO getTicketById(
            @PathVariable Long id) {

        Ticket ticket = ticketService.getTicketById(id)
                .orElseThrow(() ->
                        new RuntimeException("Ticket not found"));

        return convertToDTO(ticket);
    }

    // Update ticket
    @PutMapping("/{id}")
    public TicketResponseDTO updateTicket(
            @PathVariable Long id,
            @Valid @RequestBody Ticket ticket) {

        Ticket updatedTicket =
                ticketService.updateTicket(id, ticket);

        return convertToDTO(updatedTicket);
    }

    // Cancel ticket
    @PutMapping("/{id}/cancel")
    public TicketResponseDTO cancelTicket(
            @PathVariable Long id) {

        Ticket ticket =
                ticketService.cancelTicket(id);

        return convertToDTO(ticket);
    }

    // Delete ticket
    @DeleteMapping("/{id}")
    public String deleteTicket(
            @PathVariable Long id) {

        ticketService.getTicketById(id)
                .orElseThrow(() ->
                        new RuntimeException("Ticket not found"));

        ticketService.deleteTicket(id);

        return "Ticket deleted successfully";
    }

    // Convert Ticket to TicketResponseDTO
    private TicketResponseDTO convertToDTO(Ticket ticket) {

        UserResponseDTO userDTO = null;

        if (ticket.getUser() != null) {

            userDTO = new UserResponseDTO(
                    ticket.getUser().getId(),
                    ticket.getUser().getName(),
                    ticket.getUser().getEmail(),
                    ticket.getUser().getRole()
            );
        }

        return new TicketResponseDTO(
                ticket.getId(),
                ticket.getQuantity(),
                ticket.getTotalAmount(),
                ticket.getBookingDate(),
                ticket.getStatus(),
                userDTO
        );
    }
}