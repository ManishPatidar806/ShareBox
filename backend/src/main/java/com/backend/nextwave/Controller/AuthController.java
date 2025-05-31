package com.backend.nextwave.Controller;

import com.backend.nextwave.Config.JwtConfig;
import com.backend.nextwave.DTO.AuthResponse;
import com.backend.nextwave.DTO.ChangePasswordDto;
import com.backend.nextwave.DTO.CommonResponse;
import com.backend.nextwave.DTO.LoginRequest;
import com.backend.nextwave.Exception.UnAuthorizeException;
import com.backend.nextwave.Model.Entity.User;
import com.backend.nextwave.Service.AuthService;
import com.backend.nextwave.Service.EmailVerifyService;
import com.backend.nextwave.Service.UserDetail;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/api/auth")
public class AuthController {


    private final JwtConfig jwtConfig;

    private final AuthService authService;

    private final EmailVerifyService emailVerifyService;

    public AuthController(JwtConfig jwtConfig, AuthService authService, EmailVerifyService emailVerifyService) {
        this.jwtConfig = jwtConfig;
        this.authService = authService;
        this.emailVerifyService = emailVerifyService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody @Valid User user) throws Exception {
        User user1 = authService.signUpUser(user);
        String token  = jwtConfig.generateToken(user.getEmail());
        AuthResponse authResponse = new AuthResponse();
        authResponse.setMessage("User registered successfully.");
        authResponse.setStatus(true);
        authResponse.setToken(token);
        return new ResponseEntity<>(authResponse , HttpStatus.OK);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) throws Exception {
     String email = request.getEmail();
     String password = request.getPassword();
        User user1 = authService.loginUser(email,password);
        AuthResponse authResponse = new AuthResponse();
        if(user1.isTwoFactorEnabled()){
            emailVerifyService.generateAndSendOtp(user1.getEmail());
            authResponse.setMessage("Two-factor authentication is enabled. Please verify the OTP sent to your email.");
            return  new ResponseEntity<>(authResponse , HttpStatus.OK);
        }
        String token  = jwtConfig.generateToken(email);
        authResponse.setMessage("Login successful. Welcome back!");
        authResponse.setStatus(true);
        authResponse.setToken(token);
        return new ResponseEntity<>(authResponse , HttpStatus.OK);
    }

    @GetMapping("/enableTwoStepVerification")
    public ResponseEntity<CommonResponse> enableTwoStepVerification(@AuthenticationPrincipal UserDetail userDetail) throws Exception {

       String email =userDetail.getUsername();
        User user = authService.enableTwoStepVerification(email);
        CommonResponse commonResponse = new CommonResponse();
        if(user.isTwoFactorEnabled()){
            commonResponse.setMessage("Two-step enabled.");
        }else{
            commonResponse.setMessage("Two-step disabled.");
        }
        commonResponse.setStatus(true);
        return new ResponseEntity<>(commonResponse , HttpStatus.OK);
    }

    @PostMapping("/changepassword")
    public ResponseEntity<CommonResponse> enableTwoStepVerification(@AuthenticationPrincipal UserDetail userDetail, @RequestBody ChangePasswordDto changePasswordDto) throws Exception {

        String email = userDetail.getUsername();
        User user = authService.changePassword(email, changePasswordDto);

        CommonResponse commonResponse = new CommonResponse();
        commonResponse.setMessage("Password Change Successfully!");
        commonResponse.setStatus(true);
        return new ResponseEntity<>(commonResponse, HttpStatus.OK);
    }
}
