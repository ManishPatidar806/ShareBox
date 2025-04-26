package com.backend.nextwave.Controller;

import com.backend.nextwave.Config.JwtConfig;
import com.backend.nextwave.DTO.AuthResponse;
import com.backend.nextwave.DTO.ChangePasswordDto;
import com.backend.nextwave.DTO.CommonResponse;
import com.backend.nextwave.Exception.UnAuthorizeException;
import com.backend.nextwave.Model.User;
import com.backend.nextwave.Service.AuthService;
import com.backend.nextwave.Service.EmailVerifyService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtConfig jwtConfig;

    @Autowired
    private AuthService authService;

    @Autowired
    private EmailVerifyService emailVerifyService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody @Valid User user) throws Exception {
        User user1 = authService.signUpUser(user);
        String token  = jwtConfig.generateToken(user.getUsername(), user.getEmail());
        AuthResponse authResponse = new AuthResponse();
        authResponse.setMessage("User registered successfully.");
        authResponse.setStatus(true);
        authResponse.setToken(token);
        return new ResponseEntity<>(authResponse , HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestParam @NotBlank String email , @RequestParam @NotBlank String password) throws Exception {
        User user1 = authService.loginUser(email,password);
        AuthResponse authResponse = new AuthResponse();
        if(user1.isTwoFactorEnabled()){
            emailVerifyService.generateAndSendOtp(user1.getEmail());
            authResponse.setMessage("Two-factor authentication is enabled. Please verify the OTP sent to your email.");
            return  new ResponseEntity<>(authResponse , HttpStatus.OK);
        }
        String token  = jwtConfig.generateToken(email,password);
        authResponse.setMessage("Login successful. Welcome back!");
        authResponse.setStatus(true);
        authResponse.setToken(token);
        return new ResponseEntity<>(authResponse , HttpStatus.OK);
    }

    @GetMapping("/enableTwoStepVerification")
    public ResponseEntity<CommonResponse> enableTwoStepVerification(@RequestHeader("Authorization") String token) throws Exception {
        if (!jwtConfig.validateToken(token)){
            throw new UnAuthorizeException();
        }
       String email =jwtConfig.extractEmail(token);
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
    public ResponseEntity<CommonResponse> enableTwoStepVerification(@RequestHeader("Authorization") String token, @RequestBody ChangePasswordDto changePasswordDto) throws Exception {
        if (!jwtConfig.validateToken(token)) {
            throw new UnAuthorizeException();
        }
        String email = jwtConfig.extractEmail(token);
        User user = authService.changePassword(email, changePasswordDto);

        CommonResponse commonResponse = new CommonResponse();
        commonResponse.setMessage("Password Change Successfully!");
        commonResponse.setStatus(true);
        return new ResponseEntity<>(commonResponse, HttpStatus.OK);
    }
}
