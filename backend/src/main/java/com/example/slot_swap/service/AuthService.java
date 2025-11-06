package com.example.slot_swap.service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.slot_swap.dto.*;
import com.example.slot_swap.entity.User;
import com.example.slot_swap.repo.UserRepo;
import com.example.slot_swap.security.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public ResponseEntity<UserResponse> signup(SignUpRequest request) {
        if (userRepo.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new UserResponse(null, null, request.getEmail(), "Email already in use"));
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepo.save(user);

        return ResponseEntity.ok(new UserResponse(user.getId(), user.getName(), user.getEmail(), "User registered successfully"));
    }

    public ResponseEntity<LoginResponse> login(LoginRequest request) {
        Optional<User> userOpt = userRepo.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401)
                    .body(new LoginResponse(null, new UserResponse(null, null, request.getEmail(), "Invalid email or password")));
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401)
                    .body(new LoginResponse(null, new UserResponse(user.getId(), user.getName(), user.getEmail(), "Invalid email or password")));
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return ResponseEntity.ok(new LoginResponse(token, new UserResponse(user.getId(), user.getName(), user.getEmail(), "Login successful")));
    }
}
