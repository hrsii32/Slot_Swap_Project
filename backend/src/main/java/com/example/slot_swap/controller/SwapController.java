package com.example.slot_swap.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.slot_swap.dto.CreateSwapDto;
import com.example.slot_swap.entity.SwapRequest;
import com.example.slot_swap.entity.User;
import com.example.slot_swap.repo.SwapRequestRepo;
import com.example.slot_swap.repo.UserRepo;
import com.example.slot_swap.service.SwapService;

@RestController
@RequestMapping("/api")
public class SwapController {

    @Autowired
    private SwapService swapService;
    @Autowired
    private SwapRequestRepo swapRepo;
    @Autowired
    private UserRepo userRepo;

    private User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof org.springframework.security.core.userdetails.User u)) {
            return null;
        }
        return userRepo.findByEmail(u.getUsername()).orElse(null);
    }

    @PostMapping("/swap-request")
    public ResponseEntity<?> create(@RequestBody CreateSwapDto dto) {
        User me = getCurrentUser();
        if (me == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        SwapRequest swap = swapService.createSwap(me.getId(), dto.getMySlotId(), dto.getTheirSlotId());
        return ResponseEntity.ok(swap);
    }

    @PostMapping("/swap-response/{requestId}")
    public ResponseEntity<?> respond(@PathVariable Long requestId, @RequestBody Map<String, Boolean> body) {
        User me = getCurrentUser();
        if (me == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        boolean accept = Boolean.TRUE.equals(body.get("accept"));
        SwapRequest swap = swapService.respondSwap(me.getId(), requestId, accept);
        return ResponseEntity.ok(swap);
    }

    @GetMapping("/swap-requests")
    public ResponseEntity<?> listForMe() {
        User me = getCurrentUser();
        if (me == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<SwapRequest> all = swapRepo.findForUser(me.getId());
        Map<String, Object> res = new HashMap<>();

        res.put("incoming", all.stream()
                .filter(s -> Objects.equals(s.getToUser().getId(), me.getId()))
                .toList());

        res.put("outgoing", all.stream()
                .filter(s -> Objects.equals(s.getFromUser().getId(), me.getId()))
                .toList());

        return ResponseEntity.ok(res);
    }
}
