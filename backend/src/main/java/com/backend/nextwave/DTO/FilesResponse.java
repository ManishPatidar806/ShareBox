package com.backend.nextwave.DTO;

import com.backend.nextwave.Model.Entity.Files;
import lombok.Data;

@Data
public class FilesResponse {
    private String message;
    private boolean status;
    private Files file;
}
