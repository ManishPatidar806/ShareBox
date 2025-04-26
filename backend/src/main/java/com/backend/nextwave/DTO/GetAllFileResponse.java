package com.backend.nextwave.DTO;

import com.backend.nextwave.Model.Files;
import lombok.Data;

import java.util.List;

@Data
public class GetAllFileResponse {
    private String message;
    private boolean status;
    private List<Files> filesList;

}
