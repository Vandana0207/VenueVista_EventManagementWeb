package com.hcl.VenueVista.controller;

import com.hcl.VenueVista.model.Seat;
import com.hcl.VenueVista.service.SeatService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seats")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    // Add new seat
    @PostMapping
    public Seat saveSeat(@Valid @RequestBody Seat seat) {
        return seatService.saveSeat(seat);
    }

    // Get all seats
    @GetMapping
    public List<Seat> getAllSeats() {
        return seatService.getAllSeats();
    }

    // Get seats by event
    @GetMapping("/event/{eventId}")
    public List<Seat> getSeatsByEvent(@PathVariable Long eventId) {
        return seatService.getSeatsByEvent(eventId);
    }

    // Get seat by ID
    @GetMapping("/{id}")
    public Seat getSeatById(@PathVariable Long id) {

        return seatService.getSeatById(id)
                .orElseThrow(() ->
                        new RuntimeException("Seat not found"));
    }

    // Update seat
    @PutMapping("/{id}")
    public Seat updateSeat(
            @PathVariable Long id,
            @Valid @RequestBody Seat seat) {

        Seat existingSeat = seatService.getSeatById(id)
                .orElseThrow(() ->
                        new RuntimeException("Seat not found"));

        existingSeat.setSeatNumber(seat.getSeatNumber());
        existingSeat.setSeatType(seat.getSeatType());
        existingSeat.setStatus(seat.getStatus());

        return seatService.saveSeat(existingSeat);
    }

    // Delete seat
    @DeleteMapping("/{id}")
    public String deleteSeat(@PathVariable Long id) {

        seatService.getSeatById(id)
                .orElseThrow(() ->
                        new RuntimeException("Seat not found"));

        seatService.deleteSeat(id);

        return "Seat deleted successfully";
    }
}