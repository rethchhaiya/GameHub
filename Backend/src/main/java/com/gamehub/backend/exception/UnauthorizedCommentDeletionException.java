package com.gamehub.backend.exception;

public class UnauthorizedCommentDeletionException extends RuntimeException{
    public UnauthorizedCommentDeletionException(String message){
        super(message);
    }
}
