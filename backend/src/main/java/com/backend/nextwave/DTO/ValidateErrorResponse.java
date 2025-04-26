package com.backend.nextwave.DTO;

import lombok.Data;

import java.util.Map;

@Data
public class ValidateErrorResponse {
    private Map<String ,String> message;
    private boolean status ;

}
