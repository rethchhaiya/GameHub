package com.gamehub.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gamehub.backend.dto.LikeResponse;
import com.gamehub.backend.entity.Like;
import com.gamehub.backend.entity.Post;
import com.gamehub.backend.entity.User;
import com.gamehub.backend.exception.ResourceNotFoundException;
import com.gamehub.backend.repository.LikeRepository;
import com.gamehub.backend.repository.PostRepository;

@Service 
public class LikeService {
    private final LikeRepository likeRepository;
    private final PostRepository postRepository;

    public LikeService(LikeRepository likeRepository, PostRepository postRepository){
        this.likeRepository = likeRepository;
        this.postRepository = postRepository;
    }

    public LikeResponse likePost(Long postId, User currentUser){
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        boolean alreadyLiked = likeRepository.existsByUserAndPost(currentUser, post);

        if(!alreadyLiked){
            Like like = new Like();
            like.setUser(currentUser);
            like.setPost(post);
            likeRepository.save(like);
        }
        return buildResponse(post, currentUser);
    }

    @Transactional 
    public LikeResponse unlikePost(Long PostId, User currentUser){
        Post post = postRepository.findById(PostId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        likeRepository.deleteByUserAndPost(currentUser, post);

        return buildResponse(post, currentUser);
    }

    private LikeResponse buildResponse(Post post, User currentUser){
        long likeCount = likeRepository.countByPost(post);
        boolean likeByCurrentUser = likeRepository.existsByUserAndPost(currentUser, post);

        LikeResponse response = new LikeResponse();
        response.setLikeCount(likeCount);
        response.setLikedByCurrentUser(likeByCurrentUser);
        return response;
    }
}
