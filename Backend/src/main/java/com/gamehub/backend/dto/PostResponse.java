package com.gamehub.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@NoArgsConstructor 
@AllArgsConstructor 
public class PostResponse {

    private Long id;
    private Long userId;

    private String username;
    private String userAvatarUrl;
    private String content;
    private String imageUrl;

    private long likeCount;
    private long commentCount;
    
    private boolean likedByCurrentUser;
    private LocalDateTime createdAt;

}
