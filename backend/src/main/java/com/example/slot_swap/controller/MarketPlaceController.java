package com.example.slot_swap.controller;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.slot_swap.dto.EventDto;
import com.example.slot_swap.entity.Event;
import com.example.slot_swap.entity.EventStatus;
import com.example.slot_swap.entity.User;
import com.example.slot_swap.repo.EventRepo;
import com.example.slot_swap.repo.UserRepo;

@RestController
@RequestMapping("/api")
public class MarketPlaceController {

    @Autowired
    private EventRepo eventRepo;
    @Autowired
    private UserRepo userRepo;

    private User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof org.springframework.security.core.userdetails.User u)) {
            return null;
        }
        return userRepo.findByEmail(u.getUsername()).orElse(null);
    }

    @GetMapping("/swappable-slots")
    public ResponseEntity<?> swappable() {
        User me = getCurrentUser();
        if (me == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Event> events = eventRepo.findSwappableExcludingOwner(me.getId(), EventStatus.SWAPPABLE);

        List<EventDto> dtos = events.stream().map(event -> {
            EventDto dto = new EventDto();
            dto.setId(event.getId());
            dto.setTitle(event.getTitle());
            dto.setStatus(event.getStatus());
            dto.setStartTime(LocalDateTime.ofInstant(event.getStartTime(), ZoneId.systemDefault()));
            dto.setEndTime(LocalDateTime.ofInstant(event.getEndTime(), ZoneId.systemDefault()));
            return dto;
        }).toList();

        return ResponseEntity.ok(dtos);
    }
}
