package com.gamehub.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gamehub.backend.entity.LibraryEntry;

public interface LibraryEntryRepository extends JpaRepository<LibraryEntry, Long>{
    List<LibraryEntry> findByUserId(Long id);
    Boolean existsByUserIdAndRawgId(Long userId, Integer rawgId);
} 
