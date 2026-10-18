package com.gamehub.backend.dto;

public class AuthResponse {

    private String token;
    private RegisterResponse user;

    public AuthResponse(String token, RegisterResponse user){
        this.token = token;
        this.user = user;
    }

    public String getToken(){
        return token;
    }

    public RegisterResponse getUser(){
        return user;
    }
    
}
