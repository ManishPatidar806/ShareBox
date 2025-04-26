package com.backend.nextwave.Service;

import com.backend.nextwave.Config.JwtConfig;
import com.backend.nextwave.Helper.EmailService;
import com.backend.nextwave.Model.OTP;
import com.backend.nextwave.Model.User;
import com.backend.nextwave.Repository.EmailVerifyRepository;
import com.backend.nextwave.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Security;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class EmailVerifyServiceImpl implements EmailVerifyService{

    @Autowired
    private EmailVerifyRepository emailVerifyRepository;

    @Autowired
    private EmailService emailService;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtConfig jwtConfig;

    public void generateAndSendOtp(String email) {
        String otp = emailService.generateOtp();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(2);

        // Save OTP to the database
        OTP otpEntity = new OTP();
        otpEntity.setEmail(email);
        otpEntity.setOtp(otp);
        otpEntity.setExpiryTime(expiryTime);
        emailVerifyRepository.save(otpEntity);

        // Send OTP via email
        emailService.sendOtpEmail(email, otp);
    }

    public String verifyOtp(String email, String otp) {
        OTP storedOtp   = emailVerifyRepository.findByEmail(email);
       System.out.println(storedOtp);
        if (storedOtp!=null&& !storedOtp.getOtp().isEmpty() && storedOtp.getOtp().equals(otp)) {
            if (storedOtp.getExpiryTime().isAfter(LocalDateTime.now())) {
                System.out.println(storedOtp);
                Optional<User> user = userRepository.findByEmail(email);
                String token =   jwtConfig.generateToken(email,user.get().getPassword());
                emailVerifyRepository.delete(storedOtp); // Remove OTP after successful verification
                return token;
            }
        }
        return null;
    }

    // Cleanup expired OTPs periodically
    public void cleanupExpiredOtps() {

        emailVerifyRepository.deleteByExpiryTimeBefore(LocalDateTime.now());
    }



}