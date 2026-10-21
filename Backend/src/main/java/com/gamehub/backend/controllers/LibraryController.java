package com.gamehub.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gamehub.backend.dto.LibraryRequest;
import com.gamehub.backend.dto.LibraryResponse;
import com.gamehub.backend.dto.StatusUpdateRequest;
import com.gamehub.backend.entity.LibraryEntry;
import com.gamehub.backend.entity.User;
import com.gamehub.backend.services.LibraryService;

import jakarta.validation.Valid;

@RestController 
@RequestMapping("/api/library")
public class LibraryController {

    private final LibraryService libraryService;

    
    public LibraryController(LibraryService libraryService){
        this.libraryService = libraryService;
    }

    @GetMapping
    public ResponseEntity <List<LibraryResponse>> getLibrary(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User user = (User) auth.getPrincipal();
        
        List<LibraryResponse> responses = libraryService.getLibrary(user.getId())
                    .stream()
                    .map(this::toResponse)
                    .toList();

        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public ResponseEntity<LibraryResponse> addToLibrary(@AuthenticationPrincipal User user,
        @Valid @RequestBody LibraryRequest request){
        
        LibraryEntry entry = libraryService.addToLibrary(user, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(entry));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LibraryResponse> updateLibrary(@AuthenticationPrincipal User user,
        @PathVariable Long id,@Valid @RequestBody StatusUpdateRequest request){
        
        LibraryEntry entry = libraryService.updateStatus(id, user, request.getStatus());
        
        return ResponseEntity.ok(toResponse(entry));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFromLibrary(@AuthenticationPrincipal User user, 
        @PathVariable Long id){
        libraryService.deleteEntry(id, user);

        return ResponseEntity.noContent().build();
    }

    private LibraryResponse toResponse(LibraryEntry entry){
        return new LibraryResponse(entry.getId(),
            entry.getUser().getId(),
            entry.getRawgId(),
            entry.getGameName(),
            entry.getGameImage(), 
            entry.getStatus(), 
            entry.getAddedAt());
    }
}
