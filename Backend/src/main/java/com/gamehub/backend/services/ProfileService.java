package com.gamehub.backend.services;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gamehub.backend.entity.Profile;
import com.gamehub.backend.entity.User;
import com.gamehub.backend.repository.ProfileRepository;
import com.gamehub.backend.repository.UserRepository;

@Service 
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository){
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    @Transactional 
    public Profile saveProfile(Long userId, String bio, String avatarUrl){
        User user = userRepository.findById(userId).
                                  orElseThrow(() -> new IllegalStateException("User not found"));

        return profileRepository.findByUserId(userId)
                                .map(existing -> {
                                    existing.setBio(bio);
                                    existing.setAvatarUrl(avatarUrl);
                                    return profileRepository.save(existing);
                                }).orElseGet(() -> {
                                    Profile profile = new Profile(user, bio ,avatarUrl);
                                    return profileRepository.save(profile);
                                });
    }

    public Optional<Profile> getProfileUserById(Long userId){
        return  profileRepository.findByUserId(userId);
    }
    
}
