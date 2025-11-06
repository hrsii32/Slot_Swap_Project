package com.example.slot_swap.service;

import java.util.Objects;

import org.springframework.stereotype.Service;

import com.example.slot_swap.entity.Event;
import com.example.slot_swap.entity.EventStatus;
import com.example.slot_swap.entity.SwapRequest;
import com.example.slot_swap.entity.SwapStatus;
import com.example.slot_swap.entity.User;
import com.example.slot_swap.repo.EventRepo;
import com.example.slot_swap.repo.SwapRequestRepo;
import com.example.slot_swap.repo.UserRepo;

import jakarta.transaction.Transactional;

@Service
public class SwapService {

    private final EventRepo eventRepo;
    private final SwapRequestRepo swapRepo;
    private final UserRepo userRepo;

    public SwapService(EventRepo eventRepo, SwapRequestRepo swapRepo, UserRepo userRepo) {
        this.eventRepo = eventRepo;
        this.swapRepo = swapRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public SwapRequest createSwap(long requesterId, long mySlotId, long theirSlotId) {
        Event mySlot = eventRepo.findById(mySlotId)
                .orElseThrow(() -> new RuntimeException("My slot not found"));
        Event theirSlot = eventRepo.findById(theirSlotId)
                .orElseThrow(() -> new RuntimeException("Their slot not found"));

        if (!Objects.equals(mySlot.getOwner().getId(), requesterId)) {
            throw new RuntimeException("You do not own this slot");
        }

        if (Objects.equals(theirSlot.getOwner().getId(), requesterId)) {
            throw new RuntimeException("Cannot swap with yourself");
        }

        if (mySlot.getStatus() != EventStatus.SWAPPABLE || theirSlot.getStatus() != EventStatus.SWAPPABLE) {
            throw new RuntimeException("Both slots must be SWAPPABLE");
        }

        SwapRequest swap = new SwapRequest();
        swap.setMySlot(mySlot);
        swap.setTheirSlot(theirSlot);
        swap.setFromUser(userRepo.getReferenceById(requesterId));
        swap.setToUser(theirSlot.getOwner());
        swap.setStatus(SwapStatus.PENDING);
        swapRepo.save(swap);

        mySlot.setStatus(EventStatus.SWAP_PENDING);
        theirSlot.setStatus(EventStatus.SWAP_PENDING);
        eventRepo.save(mySlot);
        eventRepo.save(theirSlot);

        return swap;
    }

    @Transactional
    public SwapRequest respondSwap(long responderId, long requestId, boolean accept) {
        SwapRequest swap = swapRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Swap not found"));

        if (!Objects.equals(swap.getToUser().getId(), responderId)) {
            throw new RuntimeException("Unauthorized action");
        }

        Event mySlot = swap.getMySlot();
        Event theirSlot = swap.getTheirSlot();

        if (!accept) {
            swap.setStatus(SwapStatus.REJECTED);
            mySlot.setStatus(EventStatus.SWAPPABLE);
            theirSlot.setStatus(EventStatus.SWAPPABLE);
        } else {
            User ownerA = mySlot.getOwner();
            User ownerB = theirSlot.getOwner();

            mySlot.setOwner(ownerB);
            theirSlot.setOwner(ownerA);

            mySlot.setStatus(EventStatus.BUSY);
            theirSlot.setStatus(EventStatus.BUSY);

            swap.setStatus(SwapStatus.ACCEPTED);
        }

        eventRepo.save(mySlot);
        eventRepo.save(theirSlot);
        swapRepo.save(swap);

        return swap;
    }
}
