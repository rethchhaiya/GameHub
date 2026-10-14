package com.gamehub.backend.services;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import tools.jackson.databind.JsonNode;

@Service 
public class GameService {
    private final RestClient restClient;

    public GameService(){
        this.restClient = RestClient.create();
    }

    @Value("${rawg.api.key}")
    private String apiKey;

    private String buildGamesUrl(){
        return "https://api.rawg.io/api/games" + "?key=" + apiKey + "&page_size=10";
    }

    private String buildGameUrlByName(String name){

        String encodeName = URLEncoder.encode(name, StandardCharsets.UTF_8);

        return "https://api.rawg.io/api/games" + "?key=" + apiKey + "&page_size=10" + "&search=" + encodeName;
    }

    public JsonNode getGames(){
        return restClient.get()
                  .uri(buildGamesUrl())
                  .retrieve()
                  .body(JsonNode.class);
    }

    public JsonNode getGameByName(String name){
        return restClient.get()
                         .uri(buildGameUrlByName(name))
                         .retrieve().body(JsonNode.class);

    }
}
