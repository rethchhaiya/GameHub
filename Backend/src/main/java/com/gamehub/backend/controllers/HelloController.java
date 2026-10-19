package com.gamehub.backend.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gamehub.backend.entity.User;

@RestController 
@CrossOrigin(origins = "http://localhost:5173")
public class HelloController {
    @GetMapping("/api/hello")
    public String hello(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        User user = (User) auth.getPrincipal();

        return "Wellcome, " + user.getUsername();
    }

    
    
    

}
