package com.gamehub.backend.controllers;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.gamehub.backend.services.ImageUploadService;

@RestController 
@RequestMapping("/api/images")
public class ImageUploadController {

    private final ImageUploadService imageUploadService;

    public ImageUploadController(ImageUploadService imageUploadService){
        this.imageUploadService = imageUploadService;
    }

    @PostMapping("/profile")
    public ResponseEntity<Map<String, String>> uploadProfilePicture(
        @RequestParam("image") 
        MultipartFile image) throws IOException{

        String imageUrl = imageUploadService.uploadProfilePicture(image);

        return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
    }
}