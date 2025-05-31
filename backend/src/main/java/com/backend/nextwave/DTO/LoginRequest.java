package com.backend.nextwave.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Enter valid email")
    @Email
private String email;
    @NotBlank(message = "Enter valid password")
private String password;


}
