package com.gamehub.backend.exception;

public class FileTooLargeException extends RuntimeException{
    public FileTooLargeException(String message){
        super(message);
    }
}