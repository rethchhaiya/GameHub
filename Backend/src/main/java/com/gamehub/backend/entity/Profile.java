package com.gamehub.backend.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity 
@Table(name = "profiles")
public class Profile {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;
    
    @JoinColumn(name = "user_id")
    @OneToOne 
    private User user;

    @Column(name = "bio")
    private String bio;

    @Column (name = "avatar_url")
    private String avatarUrl;

    @CreationTimestamp 
    @Column (nullable = false, name = "created_at")
    private LocalDateTime createdAt;

    public Profile(){}

    public Profile(User user, String bio, String avatarUrl){
        this.user = user;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
    }

    public void setUser(User user){
        this.user = user;
    }

    public void setBio(String bio){
        this.bio = bio;
    }

    public void setAvatarUrl(String avatarUrl){
        this.avatarUrl = avatarUrl;
    }

    public Long getId(){
        return id;
    }

    public User getUser(){
        return user;
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
