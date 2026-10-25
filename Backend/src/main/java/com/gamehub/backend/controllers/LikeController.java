package com.gamehub.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gamehub.backend.dto.LikeResponse;
import com.gamehub.backend.entity.User;
import com.gamehub.backend.services.LikeService;

@RestController 
@RequestMapping("/api/posts/{postId}/likes")
public class LikeController {
    
    private final LikeService likeService;

    public LikeController(LikeService likeService){
        this.likeService = likeService;
    }

    @PostMapping
    public ResponseEntity<LikeResponse> likePost(@PathVariable Long postId, @AuthenticationPrincipal User user){
        LikeResponse response = likeService.likePost(postId, user);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<Void> unlikePost(@PathVariable Long postId, @AuthenticationPrincipal User user){
        likeService.unlikePost(postId, user);
        return ResponseEntity.noContent().build();
    }
}
