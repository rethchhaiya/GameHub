package com.gamehub.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gamehub.backend.entity.Like;
import com.gamehub.backend.entity.Post;
import com.gamehub.backend.entity.User;

public interface LikeRepository extends JpaRepository<Like, Long>{
    
    boolean existsByUserAndPost(User user, Post post);
    long countByPost(Post post);
    void deleteByUserAndPost(User user, Post post);
}