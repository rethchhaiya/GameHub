package com.gamehub.backend.services;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service 
public class ImageUploadService {
    
    private final Cloudinary cloudinary;

    public ImageUploadService(Cloudinary cloudinary){
        this.cloudinary = cloudinary;
    }

    public String uploadProfilePicture(MultipartFile image) throws IOException {
        Map<?, ?> result = cloudinary.uploader().upload(
            image.getBytes(),
            ObjectUtils.asMap(
                "folder", "gamehub/profile",
                "resource_type", "image"
            )
        );

        return result.get("source_url").toString();
    }

}
