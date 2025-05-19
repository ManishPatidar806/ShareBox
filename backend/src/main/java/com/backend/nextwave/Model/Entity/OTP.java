package com.backend.nextwave.Model.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class OTP {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private long id;

    private String email;

    private String otp;

    private LocalDateTime expiryTime;

}