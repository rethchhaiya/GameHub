package com.gamehub.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.gamehub.backend.dto.LoginRequest;
import com.gamehub.backend.dto.RegisterRequest;
import com.gamehub.backend.dto.RegisterResponse;
import com.gamehub.backend.entity.User;
import com.gamehub.backend.services.UserService;

import jakarta.validation.Valid;

@RestController 
@RequestMapping ("/api/auth")
public class AuthController {
    
    private final UserService userService;

    public AuthController(UserService userService){
        this.userService = userService;
    }

    @PostMapping ("/register")
    @ResponseStatus (HttpStatus.CREATED)
    public RegisterResponse register(@Valid @RequestBody RegisterRequest request){

        User user = userService.register(request);

        return new RegisterResponse(user.getId(),
                                    user.getUsername(),
                                    user.getEmail()
        );
    }

    @PostMapping("/login")
    public RegisterResponse login(@Valid @RequestBody LoginRequest request){
        User user = userService.login(request);

        return new RegisterResponse(user.getId(),
                                    user.getUsername(),
                                    user.getEmail());
    }

}
