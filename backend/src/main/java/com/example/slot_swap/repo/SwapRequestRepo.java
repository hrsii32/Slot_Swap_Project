package com.example.slot_swap.repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.slot_swap.entity.SwapRequest;

public interface SwapRequestRepo extends JpaRepository<SwapRequest, Long> {

    @Query("select s from SwapRequest s where s.fromUser.id = :id or s.toUser.id = :id")
    List<SwapRequest> findForUser(@Param("id") Long id);
}
