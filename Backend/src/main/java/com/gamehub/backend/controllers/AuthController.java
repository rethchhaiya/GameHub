package com.gamehub.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.gamehub.backend.dto.AuthResponse;
import com.gamehub.backend.dto.LoginRequest;
import com.gamehub.backend.dto.RegisterRequest;
import com.gamehub.backend.dto.RegisterResponse;
import com.gamehub.backend.entity.User;
import com.gamehub.backend.services.JwtService;
import com.gamehub.backend.services.UserService;

import jakarta.validation.Valid;

@RestController 
@RequestMapping ("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    
    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService){
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping ("/register")
    @ResponseStatus (HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request){

        User user = userService.register(request);

        String token = jwtService.generateToken(user);
        
        return new AuthResponse(token, new RegisterResponse(user.getId(), user.getUsername(), user.getEmail()));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request){
        User user = userService.login(request);

        String token = jwtService.generateToken(user);

        return new AuthResponse(token, new RegisterResponse(user.getId(), user.getUsername(), user.getEmail()));    
    }

}
