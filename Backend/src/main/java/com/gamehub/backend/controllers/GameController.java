package com.gamehub.backend.controllers;


import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gamehub.backend.services.GameService;

import tools.jackson.databind.JsonNode;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class GameController {
    
    private final GameService gameService;

    public GameController(GameService gameService){
        this.gameService = gameService;
    }   

    @GetMapping("/api/games")
    public JsonNode get(@RequestParam(defaultValue = "1")int page){

        return gameService.getGames(page);
    }

    @GetMapping("/api/games-name")
    public JsonNode getByName(@RequestParam String name){

        return gameService.getGameByName(name);
    }

    @GetMapping("/api/games/{id}")
    public JsonNode getById(@PathVariable int id){

        return gameService.getGameById(id);
    }

    @GetMapping("/api/games/{id}/screenshots")
    public JsonNode getScreenshots(@PathVariable int id){
        
        return  gameService.getGameScreenshots(id);
    }
}
