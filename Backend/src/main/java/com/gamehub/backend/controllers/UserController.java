package com.gamehub.backend.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gamehub.backend.dto.RegisterResponse;
import com.gamehub.backend.entity.User;

@RestController 
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping("/me")
    public RegisterResponse getUser(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User user = (User) auth.getPrincipal();

        return new RegisterResponse(user.getId(), user.getUsername(), user.getEmail());
    }
}
