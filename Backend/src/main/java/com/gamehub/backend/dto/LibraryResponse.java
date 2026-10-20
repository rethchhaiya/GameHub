package com.gamehub.backend.dto;

import java.time.LocalDateTime;



public class LibraryResponse {
    
    private Long id;
    private Long userId;
    private Integer rawgId;
    
    private String gameName;
    private String gameImage;
    private String status;

    private LocalDateTime addedAt;

    public LibraryResponse(){}

    public LibraryResponse(Long id,Long userId, Integer rawgId, String gameName, String gameImage, String status, LocalDateTime addedAt){
        this.id = id;
        this.userId = userId;
        this.rawgId = rawgId;
        this.gameName = gameName;
        this.gameImage = gameImage;
        this.status = status;
        this.addedAt = addedAt;
    }

    public Long getUserId(){
        return userId;
    }

    public Integer getRawgId(){
        return rawgId;
    }

    public String getGameName(){
        return gameName;
    }

    public String getGameImage(){
        return gameImage;
    }

    public String getStatus(){
        return status;
    }

    public LocalDateTime getAddedAt(){
        return addedAt;
    }

    public Long getId(){
        return id;
    }
}

