package com.cs490.group4.demo.config;

import com.cs490.group4.demo.security.Role;
import com.cs490.group4.demo.security.User;
import com.cs490.group4.demo.security.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class MockUser {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    public User createMockUser(
            String email,
            String password,
            String firstName,
            String lastName) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(Role.USER);
        userRepository.save(user);
        return user;
    }
}
