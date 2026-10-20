package com.gamehub.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class StatustUpdateRequest {
    @NotBlank(message = "Status is required")
    private String status;

    public StatustUpdateRequest(){}

    public StatustUpdateRequest(String status){
        this.status = status;
    }

    public void setStatus(String status){
        this.status = status;
    }

    public String getStatus(){
        return status;
    }
}
