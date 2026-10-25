package com.gamehub.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.gamehub.backend.entity.Comment;
import com.gamehub.backend.entity.Post;

public interface CommentRepository extends JpaRepository <Comment, Long>{
    Page<Comment> findAllByPostOrderByCreatedAtAsc(Post post, Pageable pageable);
    long countByPost(Post post);
}
