package com.gamehub.backend.dto;

public class ProfileRequest {

    private String bio;

    private String avatarUrl;

    public ProfileRequest(){}

    public ProfileRequest(String bio, String avatarUrl){
        this.bio = bio;
        this.avatarUrl = avatarUrl;
    }

    public void setBio(String bio){
        this.bio = bio;
    }

    public void setAvatarUrl(String avatarUrl){
        this.avatarUrl = avatarUrl;
    }

    public String getBio(){
        return bio;
    }

    public String getAvatarUrl(){
        return avatarUrl;
    }

}
