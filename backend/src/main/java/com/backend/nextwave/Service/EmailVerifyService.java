package com.backend.nextwave.Service;

import org.springframework.stereotype.Service;

@Service
public interface EmailVerifyService {
    public void generateAndSendOtp(String email);
    public String verifyOtp(String email, String otp);


    public void cleanupExpiredOtps();

}