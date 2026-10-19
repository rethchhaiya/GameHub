package com.gamehub.backend.dto;

import java.time.LocalDateTime;

public class ProfileResponse {
    
    private Long id;
    private Long userId;
    
    private String bio;
    private String avatarUrl;

    private LocalDateTime createdAt;

    public ProfileResponse(){}

    public ProfileResponse(Long id, Long userId, String bio, String avatarUrl, LocalDateTime createdAt){
        this.id = id;
        this.userId = userId;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
        this.createdAt = createdAt;
    }

    public Long getId(){
        return id;
    }

    public Long getUserId(){
        return userId;
    }

    public String getBio(){
        return bio;
    }

    public String getAvatarUrl(){
        return avatarUrl;
    }

    public LocalDateTime getCreatedAt(){
        return createdAt;
    }

}
