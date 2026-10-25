package com.gamehub.backend.controllers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gamehub.backend.dto.PostRequest;
import com.gamehub.backend.dto.PostResponse;
import com.gamehub.backend.entity.User;
import com.gamehub.backend.services.PostService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    
    private final PostService postService;

    public PostController(PostService postService){
        this.postService = postService;
    }

    @GetMapping
    public ResponseEntity<Page<PostResponse>> getFeed(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @AuthenticationPrincipal User currentUser){

        Pageable pageable = PageRequest.of(page, size);

        Page<PostResponse> feed = postService.getFeed(pageable, currentUser);

        return ResponseEntity.ok(feed);
    }

    @PostMapping 
    public ResponseEntity<PostResponse> createPost(
        @Valid @RequestBody PostRequest request,
        @AuthenticationPrincipal User currentUser){

        PostResponse created = postService.createPost(request, currentUser);

        return ResponseEntity.ok(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
        @PathVariable Long id,
        @AuthenticationPrincipal User currentUser){

        postService.deletePost(id, currentUser.getId());

        return ResponseEntity.noContent().build();
    }
}
