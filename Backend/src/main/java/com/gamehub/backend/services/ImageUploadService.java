package com.gamehub.backend.services;

import java.io.IOException;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.gamehub.backend.exception.EmptyFileException;
import com.gamehub.backend.exception.FileTooLargeException;
import com.gamehub.backend.exception.InvalidFileTypeException;

@Service 
public class ImageUploadService {
    
    private final Cloudinary cloudinary;

    public ImageUploadService(Cloudinary cloudinary){
        this.cloudinary = cloudinary;
    }

    //upload image to cloudinary
    public String uploadProfilePicture(MultipartFile image) throws IOException {
        validateImage(image);

        Map<?, ?> result = cloudinary.uploader().upload(
            image.getBytes(),
            ObjectUtils.asMap(
                "folder", "gamehub/profile",
                "resource_type", "image"
            )
        );
        //return the url's image that get from cloudinary
        return result.get("secure_url").toString();
    }

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    private static final Set<String> ALLOWED_TYPE = Set.of(
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp"
    );
    //medthod for checking image before allow to upload
    private void validateImage(MultipartFile image){
        if(image == null || image.isEmpty()){
            throw new EmptyFileException("Please select an image.");
        }
        //check image size
        if(image.getSize() > MAX_FILE_SIZE){
            throw new FileTooLargeException("Image must be smaller than 5 MB");
        }

        //check if image type 
        if(!ALLOWED_TYPE.contains(image.getContentType())){
            throw new InvalidFileTypeException("Only JPEG, PNG, JPG, and WebP images are allowed.");
        }

    }

}
