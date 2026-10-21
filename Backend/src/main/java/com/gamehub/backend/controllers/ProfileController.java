package com.gamehub.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gamehub.backend.dto.ProfileRequest;
import com.gamehub.backend.dto.ProfileResponse;
import com.gamehub.backend.entity.Profile;
import com.gamehub.backend.entity.User;
import com.gamehub.backend.services.ProfileService;

import jakarta.validation.Valid;

@RestController 
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService){
        this.profileService = profileService;
    } 

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getProfile(){
        //Get logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        //Get profile 
        return profileService.getProfileUserById(user.getId()).
                            map(profile -> ResponseEntity.ok(new ProfileResponse(
                                profile.getId(),
                                profile.getUser().getId(),
                                profile.getBio(),
                                profile.getAvatarUrl(),
                                profile.getCreatedAt()
                             ))).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<ProfileResponse> updateProfile(@Valid @RequestBody ProfileRequest request){
        //Get logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        //Call service
        Profile profile = profileService.saveProfile(user.getId(), request.getBio(), request.getAvatarUrl());

        //Create new profile response
        ProfileResponse response = new ProfileResponse(
            profile.getId(),
            profile.getUser().getId(),
            profile.getBio(),
            profile.getAvatarUrl(),
            profile.getCreatedAt()
        );

        return ResponseEntity.ok(response);
    }
}
