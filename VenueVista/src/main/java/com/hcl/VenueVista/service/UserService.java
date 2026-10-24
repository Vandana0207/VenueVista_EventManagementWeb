package com.hcl.VenueVista.service;

import com.hcl.VenueVista.model.User;
import com.hcl.VenueVista.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User saveUser(User user) {

        if (user.getId() == 0) {

            if (userRepository.existsByEmail(user.getEmail())) {
                throw new RuntimeException("Email already registered");
            }

            user.setRole("USER");
        }

        if (user.getPassword() != null &&
                !user.getPassword().startsWith("$2a$") &&
                !user.getPassword().startsWith("$2b$") &&
                !user.getPassword().startsWith("$2y$")) {

            user.setPassword(
                    passwordEncoder.encode(user.getPassword())
            );
        }

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null) {
            return null;
        }

        String storedPassword = user.getPassword();

        if (storedPassword == null) {
            return null;
        }

        boolean passwordMatched;

        if (storedPassword.startsWith("$2a$") ||
                storedPassword.startsWith("$2b$") ||
                storedPassword.startsWith("$2y$")) {

            passwordMatched =
                    passwordEncoder.matches(
                            password,
                            storedPassword
                    );

        } else {

            passwordMatched =
                    storedPassword.equals(password);

            if (passwordMatched) {

                user.setPassword(
                        passwordEncoder.encode(password)
                );

                userRepository.save(user);
            }
        }

        if (!passwordMatched) {
            return null;
        }

        return user;
    }
}