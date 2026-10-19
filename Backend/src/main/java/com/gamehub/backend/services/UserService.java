package com.gamehub.backend.services;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.gamehub.backend.dto.LoginRequest;
import com.gamehub.backend.dto.RegisterRequest;
import com.gamehub.backend.entity.User;
import com.gamehub.backend.exception.EmailAlreadyExistsException;
import com.gamehub.backend.exception.InvalidCredentialsException;
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

    public Optional <User> findById(Long id){
        return userRepository.findById(id);
    }

    public void checkEmailAvailable(String email){
        if(emailExists(email)){
            throw new EmailAlreadyExistsException(
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

    public User login(LoginRequest request){
        User user = userRepository.findByEmail(request.getEmail())
                                  .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if(!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())){
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return user;
    }
}
