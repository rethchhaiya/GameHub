package com.gamehub.backend.models;

public class Game {

    private  String name;
    private double rating;
    private String backgroundImage;

    public Game(String name, double rating, String backgroundImage){
        this.name = name;
        this.rating = rating;
        this.backgroundImage = backgroundImage;
    }   

    public String getName(){
        return name;
    }
    public double getRating(){
        return rating;
    }
    public String getBackgroundImage(){
        return backgroundImage;
    }
}
