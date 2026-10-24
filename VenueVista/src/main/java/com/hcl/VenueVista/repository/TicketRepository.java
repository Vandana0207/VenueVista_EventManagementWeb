package com.hcl.VenueVista.repository;

import com.hcl.VenueVista.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Query("SELECT COALESCE(SUM(t.quantity), 0) " +
           "FROM Ticket t " +
           "WHERE t.event.id = :eventId " +
           "AND t.status = 'CONFIRMED'")
    Long getBookedTickets(@Param("eventId") Long eventId);

    @Query("SELECT COALESCE(SUM(t.totalAmount), 0) " +
           "FROM Ticket t " +
           "WHERE t.event.id = :eventId " +
           "AND t.status = 'CONFIRMED'")
    Double getTotalRevenue(@Param("eventId") Long eventId);

    @Query("SELECT COALESCE(SUM(t.totalAmount), 0) " +
           "FROM Ticket t " +
           "WHERE t.event.id = :eventId " +
           "AND t.status = 'CANCELLED'")
    Double getCancelledRevenue(@Param("eventId") Long eventId);
}