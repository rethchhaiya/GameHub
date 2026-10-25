package com.gamehub.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@NoArgsConstructor 
@AllArgsConstructor 
public class CommentResponse {
    
    private Long id;
    private Long userId;

    private String username;
    private String content;
    private LocalDateTime createdAt;

}
