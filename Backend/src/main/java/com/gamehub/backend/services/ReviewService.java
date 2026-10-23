package com.gamehub.backend.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gamehub.backend.dto.ReviewRequest;
import com.gamehub.backend.dto.ReviewResponse;
import com.gamehub.backend.dto.ReviewUpdateRequest;
import com.gamehub.backend.entity.Review;
import com.gamehub.backend.entity.User;
import com.gamehub.backend.exception.ResourceNotFoundException;
import com.gamehub.backend.exception.ReviewAlreadyExistsException;
import com.gamehub.backend.repository.ReviewRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional 
@RequiredArgsConstructor 
public class ReviewService {

    private final ReviewRepository reviewRepository;

    //CREATE
    public ReviewResponse createReview(User user,ReviewRequest request){
        if(reviewRepository.existsByUserIdAndRawgId(user.getId(), request.getRawgId())){
            throw new ReviewAlreadyExistsException("You already reviewed this game");
        }
        Review review = new Review();

        review.setUser(user);
        review.setRawgId(request.getRawgId());
        review.setRating(request.getRating());
        review.setContent(request.getContent());

        Review saved = reviewRepository.save(review);
        return toResponse(saved);
    }

    // GET ONE
    public ReviewResponse getReviewById(Long id){
        Review review = reviewRepository.findById(id).
            orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));

        return toResponse(review);
    }

    // GET ALL REVIEWS
    public List<ReviewResponse> getAllReviews(){
        return reviewRepository.findAll()
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    // GET BY USER
    public List<ReviewResponse> getReviewByUser(Long userId){
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    // GET BY RAWG ID
    public List<ReviewResponse> getReviewByRawgId(Integer rawgId){
        return reviewRepository.findByRawgIdOrderByCreatedAtDesc(rawgId)
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    // UPDATE REVIEW
    public ReviewResponse updateReview(Long id, User user, ReviewUpdateRequest request){
        Review review = getOwnedReview(id, user);
        
        review.setRating(request.getRating());
        review.setContent(request.getContent());

        Review updated = reviewRepository.save(review);

        return toResponse(updated);
    }

    //  DELETE
    public void deleteReview(Long id, User user){
        Review review = getOwnedReview(id, user);

        reviewRepository.delete(review);
    }

    private ReviewResponse toResponse(Review review){
        return new ReviewResponse(
            review.getId(),
            review.getUser().getId(),
            review.getUser().getUsername(),
            review.getRawgId(),
            review.getRating(),
            review.getContent(),
            review.getCreatedAt()
        );
    }

    private Review getOwnedReview(Long id, User user){
        Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if(!review.getUser().getId().equals(user.getId())){
            throw new ResourceNotFoundException("Review not found");
        }

        return review;
    }
    
}
