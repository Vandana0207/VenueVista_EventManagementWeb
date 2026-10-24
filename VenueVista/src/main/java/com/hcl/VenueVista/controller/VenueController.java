package com.hcl.VenueVista.controller;

import com.hcl.VenueVista.model.Venue;
import com.hcl.VenueVista.service.VenueService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/venues")
public class VenueController {

    private final VenueService venueService;

    public VenueController(VenueService venueService) {
        this.venueService = venueService;
    }

    // Add a new venue
    @PostMapping
    public Venue saveVenue(@Valid @RequestBody Venue venue) {
        return venueService.saveVenue(venue);
    }

    // Get all venues
    @GetMapping
    public List<Venue> getAllVenues() {
        return venueService.getAllVenues();
    }

    // Get venue by ID
    @GetMapping("/{id}")
    public Venue getVenueById(@PathVariable Long id) {

        return venueService.getVenueById(id)
                .orElseThrow(() ->
                        new RuntimeException("Venue not found"));
    }

    // Update venue
    @PutMapping("/{id}")
    public Venue updateVenue(
            @PathVariable Long id,
            @Valid @RequestBody Venue venue) {

        Venue existingVenue = venueService.getVenueById(id)
                .orElseThrow(() ->
                        new RuntimeException("Venue not found"));

        existingVenue.setName(venue.getName());
        existingVenue.setLocation(venue.getLocation());
        existingVenue.setCapacity(venue.getCapacity());
        existingVenue.setPrice(venue.getPrice());
        existingVenue.setDescription(venue.getDescription());

        return venueService.saveVenue(existingVenue);
    }

    // Delete venue
    @DeleteMapping("/{id}")
    public String deleteVenue(@PathVariable Long id) {

        venueService.getVenueById(id)
                .orElseThrow(() ->
                        new RuntimeException("Venue not found"));

        venueService.deleteVenue(id);

        return "Venue deleted successfully";
    }
}