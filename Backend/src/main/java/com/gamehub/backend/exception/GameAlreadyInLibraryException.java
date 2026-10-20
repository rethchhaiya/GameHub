package com.gamehub.backend.exception;

public class GameAlreadyInLibraryException extends RuntimeException{
    public GameAlreadyInLibraryException(String message){
        super(message);
    }
}
