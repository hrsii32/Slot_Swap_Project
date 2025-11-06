package com.example.slot_swap.repo;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.slot_swap.entity.User;

public interface UserRepo extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
