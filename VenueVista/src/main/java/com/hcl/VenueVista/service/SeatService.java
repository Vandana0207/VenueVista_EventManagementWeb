package com.hcl.VenueVista.service;

import com.hcl.VenueVista.model.Event;
import com.hcl.VenueVista.model.Seat;
import com.hcl.VenueVista.repository.EventRepository;
import com.hcl.VenueVista.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeatService {

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private EventRepository eventRepository;

    public Seat saveSeat(Seat seat) {

        Event event = eventRepository.findById(seat.getEvent().getId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        boolean seatExists =
                seatRepository.existsBySeatNumberAndEventIdAndIdNot(
                        seat.getSeatNumber(),
                        event.getId(),
                        seat.getId()
                );

        if (seatExists) {
            throw new RuntimeException(
                    "Seat " + seat.getSeatNumber()
                            + " already exists for this event"
            );
        }

        seat.setEvent(event);

        return seatRepository.save(seat);
    }

    public List<Seat> getAllSeats() {
        return seatRepository.findAll();
    }

    public List<Seat> getSeatsByEvent(Long eventId) {
        return seatRepository.findByEventId(eventId);
    }

    public Optional<Seat> getSeatById(Long id) {
        return seatRepository.findById(id);
    }

    public void deleteSeat(Long id) {
        seatRepository.deleteById(id);
    }
}
