package com.gamehub.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gamehub.backend.entity.User;
import com.gamehub.backend.services.CommentService;

@RestController 
@RequestMapping("/api/comments")
public class CommentDeleteController {
    private final CommentService commentService;

    public CommentDeleteController(CommentService commentService){
        this.commentService = commentService;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id, @AuthenticationPrincipal User user){
        commentService.deleteComment(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
