package com.gamehub.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gamehub.backend.dto.ReviewRequest;
import com.gamehub.backend.dto.ReviewResponse;
import com.gamehub.backend.entity.User;
import com.gamehub.backend.services.ReviewService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController 
@RequestMapping("/api/review")
@RequiredArgsConstructor  
public class ReviewController {

    private final ReviewService reviewService;
    
    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@AuthenticationPrincipal User user,@Valid @RequestBody ReviewRequest request){
        ReviewResponse created = reviewService.createReview(user, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> getReviewById(@PathVariable Long id){
        return ResponseEntity.ok(reviewService.getReviewById(id));
    }

    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getReview(
        @RequestParam(required = false) Long userId,
        @RequestParam(required = false) Integer rawgId){

        if(userId != null){
            return ResponseEntity.ok(reviewService.getReviewByUser(userId));
        }
        if(rawgId != null){
            return ResponseEntity.ok(reviewService.getReviewByRawgId(rawgId));
        }

        return ResponseEntity.ok(reviewService.getAllReviews());
    } 

    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponse> updateReview(
        @AuthenticationPrincipal User user,
        @PathVariable Long id,
        @Valid @RequestBody ReviewRequest request){
        return ResponseEntity.ok((reviewService.updateReview(id, user, request)));
    }

    @DeleteMapping("/{id}") 
    public ResponseEntity<Void> deleteReview(
        @AuthenticationPrincipal User user,
        @PathVariable Long id){
        reviewService.deleteReview(id, user);
        return ResponseEntity.noContent().build();
    }
}
