package com.gamehub.backend.controllers;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gamehub.backend.dto.CommentRequest;
import com.gamehub.backend.dto.CommentResponse;
import com.gamehub.backend.entity.User;
import com.gamehub.backend.services.CommentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService){
        this.commentService = commentService;
    }

    @GetMapping
    public ResponseEntity <Page<CommentResponse>> getComments(
            @PathVariable Long postId, 
            @RequestParam(defaultValue = "0")int page, 
            @RequestParam(defaultValue = "20") int size){

        Pageable pageable = PageRequest.of(page, size);
        Page<CommentResponse> comments = commentService.getCommentsForPost(postId, pageable);
        return ResponseEntity.ok(comments);
    }

    @PostMapping
    public ResponseEntity<CommentResponse> addComment(@PathVariable Long postId, @Valid @RequestBody CommentRequest request, @AuthenticationPrincipal User user){
        CommentResponse created = commentService.addComment(postId, request, user);

        return ResponseEntity.ok(created);
    }
}
