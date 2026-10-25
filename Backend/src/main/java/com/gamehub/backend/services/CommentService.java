package com.gamehub.backend.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.gamehub.backend.dto.CommentRequest;
import com.gamehub.backend.dto.CommentResponse;
import com.gamehub.backend.entity.Comment;
import com.gamehub.backend.entity.Post;
import com.gamehub.backend.entity.User;
import com.gamehub.backend.exception.ResourceNotFoundException;
import com.gamehub.backend.exception.UnauthorizedCommentDeletionException;
import com.gamehub.backend.repository.CommentRepository;
import com.gamehub.backend.repository.PostRepository;

@Service 
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository){
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
    }

    public Page<CommentResponse> getCommentsForPost(Long postId, Pageable pageable){
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Page<Comment> comments = commentRepository.findAllByPostOrderByCreatedAtAsc(post, pageable);
        return comments.map(this::toresponse);
    }

    public CommentResponse addComment(Long postId, CommentRequest request, User currentUser){
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        
        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(currentUser);
        comment.setContent(request.getContent());

        Comment saved = commentRepository.save(comment);

        return toresponse(saved);
    }

    public void deleteComment(Long commentId, Long currentUserId){
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        boolean isCommentAuthor = comment.getUser().getId().equals(currentUserId);
        boolean isPostOwner = comment.getPost().getUser().getId().equals(currentUserId);

        if(!isCommentAuthor && !isPostOwner){
            throw new UnauthorizedCommentDeletionException("You can delete only your own comment");
        }

        commentRepository.deleteById(commentId);
    }

    private CommentResponse toresponse(Comment comment){
        CommentResponse response = new CommentResponse();

        response.setId((comment.getId()));
        response.setUserId(comment.getUser().getId());
        response.setUsername(comment.getUser().getUsername());
        response.setContent(comment.getContent());
        response.setCreatedAt(comment.getCreatedAt());

        return response;
    }

}
