package com.example.slot_swap.repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.slot_swap.entity.Event;
import com.example.slot_swap.entity.EventStatus;

public interface EventRepo extends JpaRepository<Event, Long> {

    List<Event> findByOwnerIdOrderByStartTimeAsc(Long ownerId);

    @Query("SELECT e FROM Event e WHERE e.owner.id <> :ownerId AND e.status = :status ORDER BY e.startTime ASC")
    List<Event> findSwappableExcludingOwner(@Param("ownerId") Long ownerId, @Param("status") EventStatus status);
}
