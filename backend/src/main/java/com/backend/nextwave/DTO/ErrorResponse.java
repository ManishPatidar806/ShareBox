package com.backend.nextwave.DTO;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class ErrorResponse {
private String message;
private boolean status;

}
