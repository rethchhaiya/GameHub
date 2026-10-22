package com.gamehub.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gamehub.backend.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long>{
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Review> findByRawgIdOrderByCreatedAtDesc(Integer rawgId);
    boolean existsByUserIdAndRawgId(Long userId, Integer rawgId);
}
