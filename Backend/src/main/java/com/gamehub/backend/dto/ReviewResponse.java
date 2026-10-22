package com.gamehub.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor 
@AllArgsConstructor 
public class ReviewResponse {
    private Long id;
    private Long userId;
    private String userName;
    private Integer rawgId;
    private Integer rating;
    private String content;   
    private LocalDateTime createdAt;
}
