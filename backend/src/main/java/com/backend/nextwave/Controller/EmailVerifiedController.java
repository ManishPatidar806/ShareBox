package com.backend.nextwave.Controller;

import com.backend.nextwave.Exception.UnAuthorizeException;
import com.backend.nextwave.Service.EmailVerifyService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/*
This controller is can be used when we want to varify email
 */

@Validated
@RestController
@RequestMapping("/api/email")
public class EmailVerifiedController {

    @Autowired
    private EmailVerifyService emailVerifyService;


    @PostMapping("/send")
    public String sendOtp(@RequestParam @NotBlank String email)  {
        emailVerifyService.generateAndSendOtp(email);
        return "OTP sent to " + email;
    }

    @PostMapping("/verify")
    public String verifyOtp(@RequestParam @NotBlank String email, @RequestParam @NotBlank String otp)  {
        return emailVerifyService.verifyOtp(email, otp);
    }



}