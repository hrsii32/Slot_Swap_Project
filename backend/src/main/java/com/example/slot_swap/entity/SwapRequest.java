package com.example.slot_swap.entity;

import java.time.Instant;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "swap_requests")
public class SwapRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "my_slot_id", nullable = false)
    private Event mySlot;

    @ManyToOne
    @JoinColumn(name = "their_slot_id", nullable = false)
    private Event theirSlot;

    @ManyToOne
    @JoinColumn(name = "from_user_id", nullable = false)
    private User fromUser;

    @ManyToOne
    @JoinColumn(name = "to_user_id", nullable = false)
    private User toUser;

    @Enumerated(EnumType.STRING)
    private SwapStatus status = SwapStatus.PENDING;

    private Instant createdAt = Instant.now();
}
