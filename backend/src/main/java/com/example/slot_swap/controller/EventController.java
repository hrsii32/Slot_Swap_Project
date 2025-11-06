package com.example.slot_swap.controller;

import java.time.ZoneId;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.slot_swap.dto.EventDto;
import com.example.slot_swap.entity.Event;
import com.example.slot_swap.entity.EventStatus;
import com.example.slot_swap.entity.User;
import com.example.slot_swap.repo.EventRepo;
import com.example.slot_swap.repo.UserRepo;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private final EventRepo eventRepo;

    @Autowired
    private final UserRepo userRepo;

    public EventController(EventRepo eventRepo, UserRepo userRepo) {
        this.eventRepo = eventRepo;
        this.userRepo = userRepo;
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof org.springframework.security.core.userdetails.User userDetails) {
            String email = userDetails.getUsername();
            return userRepo.findByEmail(email).orElse(null);
        }

        return null;
    }

    @PostMapping("/add")
    public ResponseEntity<Event> create(@RequestBody EventDto dto) {
        User me = getCurrentUser();
        if (me == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Event e = new Event();
        e.setTitle(dto.getTitle());

        e.setStartTime(dto.getStartTime().atZone(ZoneId.systemDefault()).toInstant());
        e.setEndTime(dto.getEndTime().atZone(ZoneId.systemDefault()).toInstant());

        e.setStatus(dto.getStatus() != null ? dto.getStatus() : EventStatus.BUSY);
        e.setOwner(me);

        eventRepo.save(e);
        return ResponseEntity.ok(e);
    }

    @GetMapping("/get/me")
    public ResponseEntity<List<Event>> myEvents() {
        User me = getCurrentUser();
        if (me == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(eventRepo.findByOwnerIdOrderByStartTimeAsc(me.getId()));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody EventDto dto) {
        User me = getCurrentUser();
        if (me == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return eventRepo.findById(id).map(e -> {
            if (!e.getOwner().getId().equals(me.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You are not allowed to update this event"));
            }

            if (dto.getTitle() != null) {
                e.setTitle(dto.getTitle());
            }
            if (dto.getStartTime() != null) {
                e.setStartTime(dto.getStartTime().atZone(ZoneId.systemDefault()).toInstant());
            }
            if (dto.getEndTime() != null) {
                e.setEndTime(dto.getEndTime().atZone(ZoneId.systemDefault()).toInstant());
            }
            if (dto.getStatus() != null) {
                e.setStatus(dto.getStatus());
            }

            eventRepo.save(e);
            return ResponseEntity.ok(e);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        User me = getCurrentUser();
        if (me == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return eventRepo.findById(id).map(e -> {
            if (!e.getOwner().getId().equals(me.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You are not allowed to delete this event"));
            }

            eventRepo.delete(e);
            return ResponseEntity.ok(Map.of("message", "Event deleted successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }
}
