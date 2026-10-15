package com.gamehub.backend.services;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.node.ObjectNode;

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

    private String builGameUrlById(int id){

        return "https://api.rawg.io/api/games/" + id + "?key=" + apiKey;
    }

    private String buildGameScreenshotsUrl(int id){
        return "https://api.rawg.io/api/games/" + id + "/screenshots?key=" + apiKey;
    }

    private JsonNode removeRawgKeyLinks(JsonNode response){
        if(response instanceof ObjectNode objectNode){
            objectNode.remove("next");
            objectNode.remove("previous");
        }
        
        return response;
    }

    public JsonNode getGames(){
        JsonNode response = restClient.get()
                  .uri(buildGamesUrl())
                  .retrieve()
                  .body(JsonNode.class);
        return removeRawgKeyLinks(response);
    }

    public JsonNode getGameByName(String name){
        JsonNode response = restClient.get()
                         .uri(buildGameUrlByName(name))
                         .retrieve().body(JsonNode.class);

        return removeRawgKeyLinks(response);
    }

    public JsonNode getGameById(int id){
        JsonNode response = restClient.get()
                            .uri(builGameUrlById(id))
                            .retrieve().body(JsonNode.class);
        return removeRawgKeyLinks(response);
    }

    public JsonNode getGameScreenshots(int id){
        JsonNode response = restClient.get()
                            .uri(buildGameScreenshotsUrl(id))
                            .retrieve()
                            .body(JsonNode.class);
        return removeRawgKeyLinks(response);
    }

}
