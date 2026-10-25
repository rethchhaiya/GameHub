package com.gamehub.backend.exception;

public class UnauthorizedPostDeletionException extends RuntimeException{
    public UnauthorizedPostDeletionException(String message){
        super(message);
    }
}
