package com.gamehub.backend.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor 
@AllArgsConstructor 
public class PostRequest {

    @NotBlank (message = "Content can not be empty")
    @Size(max = 2000, message = "Content cannot exceed 2000 characters")
    private String content;

    private String imageUrl;
    
}
