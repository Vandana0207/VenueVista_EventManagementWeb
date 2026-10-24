package com.hcl.VenueVista.controller;

import com.hcl.VenueVista.dto.LoginResponseDTO;
import com.hcl.VenueVista.dto.UserResponseDTO;
import com.hcl.VenueVista.model.User;
import com.hcl.VenueVista.service.JwtService;
import com.hcl.VenueVista.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(
            UserService userService,
            JwtService jwtService) {

        this.userService = userService;
        this.jwtService = jwtService;
    }

    // Register user
    @PostMapping
    public UserResponseDTO saveUser(
            @Valid @RequestBody User user) {

        User savedUser = userService.saveUser(user);

        return new UserResponseDTO(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }

    // Get all users
    @GetMapping
    public List<UserResponseDTO> getAllUsers() {

        return userService.getAllUsers()
                .stream()
                .map(user -> new UserResponseDTO(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                ))
                .toList();
    }

    // Get user by ID
    @GetMapping("/{id}")
    public UserResponseDTO getUserById(
            @PathVariable Long id) {

        User user = userService.getUserById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    // Login
    @PostMapping("/login")
    public LoginResponseDTO login(
            @RequestBody User user) {

        User loggedInUser = userService.login(
                user.getEmail(),
                user.getPassword()
        );

        if (loggedInUser == null) {
            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        String token =
                jwtService.generateToken(loggedInUser);

        UserResponseDTO userDTO =
                new UserResponseDTO(
                        loggedInUser.getId(),
                        loggedInUser.getName(),
                        loggedInUser.getEmail(),
                        loggedInUser.getRole()
                );

        return new LoginResponseDTO(
                token,
                userDTO
        );
    }

    // Update user
    @PutMapping("/{id}")
    public UserResponseDTO updateUser(
            @PathVariable Long id,
            @Valid @RequestBody User user) {

        User existingUser =
                userService.getUserById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));

        existingUser.setName(user.getName());
        existingUser.setPassword(user.getPassword());
        existingUser.setEmail(user.getEmail());

        // Keep existing role
        if (existingUser.getRole() == null) {
            existingUser.setRole("USER");
        }

        User updatedUser =
                userService.saveUser(existingUser);

        return new UserResponseDTO(
                updatedUser.getId(),
                updatedUser.getName(),
                updatedUser.getEmail(),
                updatedUser.getRole()
        );
    }

    // Delete user
    @DeleteMapping("/{id}")
    public String deleteUser(
            @PathVariable Long id) {

        userService.getUserById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"));

        userService.deleteUser(id);

        return "User deleted successfully";
    }
}