package com.gamehub.backend.dto;

public class RegisterResponse {
    
    private Long id;
    private String username;
    private String email;

    public RegisterResponse(Long id, String username, String email){
        this.id = id;
        this.username = username;
        this.email = email;
    }

    public Long getid(){
        return id;
    }

    public String getUserName(){
        return username;
    }

    public String getEmail(){
        return email;
    }
}
