package com.gamehub.backend.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.gamehub.backend.dto.RegisterRequest;
import com.gamehub.backend.entity.User;
import com.gamehub.backend.repository.UserRepository;

@Service 
public class UserService {
    private final PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean emailExists(String email){
        return userRepository.existsByEmail(email);
    }

    public void checkEmailAvailable(String email){
        if(emailExists(email)){
            throw new IllegalArgumentException(
                "Email is already regiserted"
            );
        }
    }

    public User register(RegisterRequest request){
        checkEmailAvailable(request.getEmail());

        String passwordHash = passwordEncoder.encode(request.getPassword());

        User user = new User(
                request.getUsername(),
                request.getEmail(),
                passwordHash
        );

        return userRepository.save(user);
    }
}
