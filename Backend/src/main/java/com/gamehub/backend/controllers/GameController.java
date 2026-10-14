package com.gamehub.backend.controllers;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gamehub.backend.services.GameService;

import tools.jackson.databind.JsonNode;

@RestController
public class GameController {
    
    private final GameService gameService;

    public GameController(GameService gameService){
        this.gameService = gameService;
    }   

    @GetMapping("/api/games")
    public JsonNode get(){

        // List<Game> games = new ArrayList<>();

        return gameService.getGames();
    }

    @GetMapping("/api/game-name")
    public JsonNode getByName(@RequestParam String name){

        return gameService.getGameByName(name);
    }
}
