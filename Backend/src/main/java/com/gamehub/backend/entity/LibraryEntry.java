package com.gamehub.backend.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity 
@Table(name = "library_entries")
public class LibraryEntry {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne 
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "rawg_id", nullable = false)
    private Integer rawgId;

    @Column(name = "game_name")
    private String gameName;

    @Column(name = "game_image")
    private String gameImage;

    @Column(name = "status", nullable = false)
    private String status;

    @CreationTimestamp 
    @Column(name = "added_at", nullable = false)
    private LocalDateTime addedAt;

    public LibraryEntry(){}
    
    
    public LibraryEntry(User user, Integer rawgId, String gameName, String gameImage, String status){
        this.user = user;
        this.rawgId = rawgId;
        this.gameName = gameName;
        this.gameImage = gameImage;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Integer getRawgId() {
        return rawgId;
    }

    public String getGameName() {
        return gameName;
    }

    public String getGameImage() {
        return gameImage;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    //setter
    public void setUser(User user) {
        this.user = user;
    }

    public void setRawgId(Integer rawgId) {
        this.rawgId = rawgId;
    }

    public void setGameName(String gameName) {
        this.gameName = gameName;
    }

    public void setGameImage(String gameImage) {
        this.gameImage = gameImage;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
