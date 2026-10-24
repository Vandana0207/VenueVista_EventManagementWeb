package com.hcl.VenueVista.repository;

import com.hcl.VenueVista.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByEventId(Long eventId);

    boolean existsBySeatNumberAndEventIdAndIdNot(
            String seatNumber,
            Long eventId,
            Long id
    );
}