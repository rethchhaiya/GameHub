package com.gamehub.backend.services;



import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.gamehub.backend.dto.PostRequest;
import com.gamehub.backend.dto.PostResponse;
import com.gamehub.backend.entity.Post;
import com.gamehub.backend.entity.User;
import com.gamehub.backend.exception.ResourceNotFoundException;
import com.gamehub.backend.exception.UnauthorizedPostDeletionException;
import com.gamehub.backend.repository.CommentRepository;
import com.gamehub.backend.repository.LikeRepository;
import com.gamehub.backend.repository.PostRepository;

@Service 
public class PostService {
    private final PostRepository postRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    
    public PostService(PostRepository postRepository, LikeRepository likeRepository, CommentRepository commentRepository){
        this.postRepository = postRepository;
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
    }

    public Page<PostResponse> getFeed(Pageable pageable, User currentUser){
        Page<Post> posts = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        return posts.map(post -> toResponse(post, currentUser));
    }

    public PostResponse createPost(PostRequest request, User currentUser){
        Post post = new Post();
        post.setUser(currentUser);
        post.setContent(request.getContent());
        post.setImageUrl(request.getImageUrl());

        Post saved = postRepository.save(post);

        return toResponse(saved, currentUser);
    }

    public void deletePost(Long postId, Long currentUserId){
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        

        if(!post.getUser().getId().equals(currentUserId)){
            throw new UnauthorizedPostDeletionException("You can ony delete your own posts");
        }

        postRepository.deleteById(postId);
    }


    private PostResponse toResponse(Post post, User currentUser){
        PostResponse response = new PostResponse();

        long commentCount = commentRepository.countByPost(post);
        long likeCount = likeRepository.countByPost(post);
        boolean likedByCurrentUser =(currentUser != null && likeRepository.existsByUserAndPost(currentUser, post));

        response.setId(post.getId());
        response.setUserId(post.getUser().getId());
        response.setUsername(post.getUser().getUsername());
        response.setContent(post.getContent());
        response.setImageUrl(post.getImageUrl());
        response.setCreatedAt(post.getCreatedAt());
        response.setLikedByCurrentUser(likedByCurrentUser);
        response.setLikeCount(likeCount);
        response.setCommentCount(commentCount);
        
        return response;
    }
}
