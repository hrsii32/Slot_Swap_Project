package com.example.slot_swap.dto;

import java.time.LocalDateTime;

import com.example.slot_swap.entity.EventStatus;

import lombok.Data;

@Data
public class EventDto {

    private Long id;
    private String title;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private EventStatus status;
}
