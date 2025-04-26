package com.backend.nextwave.DTO;

import lombok.Data;

@Data
public class AuthResponse {
    private String message;
    private String token;
    private boolean status;
}
