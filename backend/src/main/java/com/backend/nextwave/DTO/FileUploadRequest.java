package com.backend.nextwave.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FileUploadRequest {
    @NotBlank
    private String password;
    private boolean oneTimeAccess;
    private LocalDate expiryDate;

}
