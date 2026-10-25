package com.gamehub.backend.services;

import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.node.ObjectNode;
import tools.jackson.databind.node.StringNode;

@Service 
public class GameService {
    private final RestClient restClient;

    public GameService(){
        this.restClient = RestClient.create();
    }

    @Value("${rawg.api.key}")
    private String apiKey;

    private String buildGamesUrl(int page){
        return "https://api.rawg.io/api/games" + "?key=" + apiKey + "&page_size=10" + "&page=" + page;
    }

    private String buildGameUrlByName(String name){

        String encodeName = URLEncoder.encode(name, StandardCharsets.UTF_8);

        return "https://api.rawg.io/api/games" + "?key=" + apiKey + "&page_size=10" + "&search=" + encodeName;
    }

    private String buildGameUrlById(int id){

        return "https://api.rawg.io/api/games/" + id + "?key=" + apiKey;
    }

    private String buildGameScreenshotsUrl(int id){
        return "https://api.rawg.io/api/games/" + id + "/screenshots?key=" + apiKey;
    }

    private JsonNode stripRawgKeyFromLinks(JsonNode response) {
        if (response instanceof ObjectNode objectNode) {
            stripRawgKeyFromLink(objectNode, "next");
            stripRawgKeyFromLink(objectNode, "previous");
        }

        return response;
    }

    private void stripRawgKeyFromLink(ObjectNode response, String field) {
        if (!response.hasNonNull(field)) {
            return;
        }

        JsonNode link = response.get(field);

        if (link instanceof StringNode) {
            response.put(field, removeKeyParam(link.asText()));
        }
    }

    private String removeKeyParam(String url) {
        try {
            URI uri = new URI(url);
            String query = uri.getQuery();

            if (query == null) {
                return url;
            }

            String cleaned = Arrays.stream(query.split("&"))
                    .filter(part -> !part.startsWith("key="))
                    .collect(Collectors.joining("&"));

            return new URI(uri.getScheme(), uri.getAuthority(), uri.getPath(),
                    cleaned.isEmpty() ? null : cleaned, uri.getFragment())
                    .toString();
        } catch (URISyntaxException e) {
            return null;
        }
    }

    public JsonNode getGames(int page){
        JsonNode response = restClient.get()
                  .uri(buildGamesUrl(page))
                  .retrieve()
                  .body(JsonNode.class);
        return stripRawgKeyFromLinks(response);
    }

    public JsonNode getGameByName(String name){
        JsonNode response = restClient.get()
                         .uri(buildGameUrlByName(name))
                         .retrieve().body(JsonNode.class);

        return stripRawgKeyFromLinks(response);
    }

    public JsonNode getGameById(int id){
        JsonNode response = restClient.get()
                            .uri(buildGameUrlById(id))
                            .retrieve().body(JsonNode.class);
        return stripRawgKeyFromLinks(response);
    }

    public JsonNode getGameScreenshots(int id){
        JsonNode response = restClient.get()
                            .uri(buildGameScreenshotsUrl(id))
                            .retrieve()
                            .body(JsonNode.class);
        return stripRawgKeyFromLinks(response);
    }

}
