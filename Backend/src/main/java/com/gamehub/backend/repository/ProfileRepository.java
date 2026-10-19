package com.gamehub.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gamehub.backend.entity.Profile;

public interface ProfileRepository extends JpaRepository<Profile, Long>{
    Optional<Profile> findByUserId(Long id);
}
