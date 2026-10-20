package com.gamehub.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class LibraryRequest {

    @NotNull 
    private Integer rawgId;

    @NotBlank 
    private String gameName;

    private String gameImage;

    @NotBlank
    private String status;

    public LibraryRequest(){}

    public LibraryRequest(Integer rawgId, String gameName, String gameImage, String status){
        this.rawgId = rawgId;
        this.gameName = gameName;
        this.gameImage = gameImage;
        this.status = status;
    }

    //setter
    public void setRawgId(Integer rawgId){
        this.rawgId = rawgId;
    }

    public void setGameName(String gameName){
        this.gameName = gameName;
    }

    public void setGameImage(String gameImage){
        this.gameImage = gameImage;
    }

    public void setStatus(String status){
        this.status = status;
    }
   
    //getter
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

}
