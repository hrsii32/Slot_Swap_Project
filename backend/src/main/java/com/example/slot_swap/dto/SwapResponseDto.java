package com.example.slot_swap.dto;

import java.time.Instant;

import com.example.slot_swap.entity.SwapStatus;

import lombok.Data;

@Data
public class SwapResponseDto {

    Long id;
    String fromUserName;
    String toUserName;
    String mySlotTitle;
    String theirSlotTitle;
    SwapStatus status;
    Instant createdAt;

}
