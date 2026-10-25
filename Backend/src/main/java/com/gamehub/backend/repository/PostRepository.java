package com.gamehub.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.gamehub.backend.entity.Post;

public interface PostRepository extends JpaRepository<Post, Long>{
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
} 
