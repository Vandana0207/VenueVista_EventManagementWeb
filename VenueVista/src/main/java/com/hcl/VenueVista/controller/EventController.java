package com.hcl.VenueVista.controller;

import com.hcl.VenueVista.model.Event;
import com.hcl.VenueVista.service.EventService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // Add new event
    @PostMapping
    public Event saveEvent(@Valid @RequestBody Event event) {
        return eventService.saveEvent(event);
    }

    // Get all events
    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    // Get event by ID
    @GetMapping("/{id}")
    public Event getEventById(@PathVariable Long id) {

        return eventService.getEventById(id)
                .orElseThrow(() ->
                        new RuntimeException("Event not found"));
    }

    // Update event
    @PutMapping("/{id}")
    public Event updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody Event event) {

        Event existingEvent = eventService.getEventById(id)
                .orElseThrow(() ->
                        new RuntimeException("Event not found"));

        existingEvent.setName(event.getName());
        existingEvent.setDate(event.getDate());
        existingEvent.setTime(event.getTime());
        existingEvent.setType(event.getType());
        existingEvent.setTotalTickets(event.getTotalTickets());
        existingEvent.setTicketPrice(event.getTicketPrice());
        existingEvent.setVenue(event.getVenue());

        return eventService.saveEvent(existingEvent);
    }

    // Delete event
    @DeleteMapping("/{id}")
    public String deleteEvent(@PathVariable Long id) {

        eventService.getEventById(id)
                .orElseThrow(() ->
                        new RuntimeException("Event not found"));

        eventService.deleteEvent(id);

        return "Event deleted successfully";
    }
}