package com.gamehub.backend.services;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gamehub.backend.dto.LibraryRequest;
import com.gamehub.backend.entity.LibraryEntry;
import com.gamehub.backend.entity.User;
import com.gamehub.backend.exception.GameAlreadyInLibraryException;
import com.gamehub.backend.exception.ResourceNotFoundException;
import com.gamehub.backend.repository.LibraryEntryRepository;

@Service 
public class LibraryService {

    private static final Set<String> ALLOWED_STATUSES = Set.of(
            "PLAYING", "COMPLETED", "PLAN_TO_PLAY", "DROPPED");
    private final LibraryEntryRepository libraryRepository;

    public LibraryService(LibraryEntryRepository libraryRepository){
        this.libraryRepository = libraryRepository;
    }

    @Transactional
    public LibraryEntry addToLibrary(User user, LibraryRequest request){
        validateStatus(request.getStatus());
        //check if the game already in library
        if(libraryRepository.existsByUserIdAndRawgId(user.getId(), request.getRawgId())){
            throw new GameAlreadyInLibraryException("This game is already in your library");
        }

        LibraryEntry entry = new LibraryEntry(user, request.getRawgId(), request.getGameName(), request.getGameImage(), request.getStatus());

        return libraryRepository.save(entry);
    }
    
    //get user library
    public List<LibraryEntry> getLibrary(Long userId){
        //user by id
        return libraryRepository.findByUserId(userId);
    }

    //update
    @Transactional 
    public LibraryEntry updateStatus(Long entryId, User user, String status){
        validateStatus(status);
        //get library
        LibraryEntry entry = getOwnedEntry(entryId, user);

        entry.setStatus(status);
        //save after update
        return libraryRepository.save(entry);
        
    }

    //check status
    private void validateStatus(String status){
        if(!ALLOWED_STATUSES.contains(status)){
            throw new IllegalArgumentException("Invalid status:" + status);
        }
    }

    //get library entry 
    private LibraryEntry getOwnedEntry(Long entryId, User user){
        LibraryEntry entry = libraryRepository.findById(entryId)
            .orElseThrow(() -> new ResourceNotFoundException("Library entry not found"));
            //check entry
            if(!entry.getUser().getId().equals(user.getId())){
                throw new ResourceNotFoundException("Library entry not found");
            }
        return entry;
    }

    //detele from library
    @Transactional 
    public void deleteEntry(Long entryId, User user){
        LibraryEntry entry = getOwnedEntry(entryId, user);
        //delete using repository
        libraryRepository.delete(entry);
    }

}
