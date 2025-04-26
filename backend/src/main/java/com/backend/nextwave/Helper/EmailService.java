package com.backend.nextwave.Helper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Random;

@Service
public class EmailService {


    @Autowired
    private JavaMailSender mailSender;

    public String generateOtp() {
        Random random = new Random();
        return String.valueOf(100000 + random.nextInt(900000)); // 6-digit OTP
    }

    public void sendOtpEmail(String to, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject("🚀 Verify Your Account - Your OTP Code Inside!");

            String emailContent = "<html><head>" +
                    "<meta charset='UTF-8' />" +
                    "<meta name='viewport' content='width=device-width, initial-scale=1.0' />" +
                    "<meta http-equiv='X-UA-Compatible' content='ie=edge' />" +
                    "<title>Email Template</title>" +
                    "<style>" +
                    "body { margin: 0; font-family: 'Poppins', sans-serif; background: #ffffff; font-size: 14px; }" +
                    ".email-container { max-width: 680px; margin: 0 auto; padding: 45px 30px 60px; background: #e6e9ef; background-image: url(https://t3.ftcdn.net/jpg/04/71/00/20/360_F_471002062_tCBbTqeeMhHgMfCW86mQhdgpETooy3ID.jpg); background-repeat: no-repeat; background-size: 800px 452px; background-position: top center; font-size: 14px; color: #434343; }" +
                    ".header-table { width: 100%; }" +
                    ".header-table td { padding: 0; vertical-align: middle; }" +
                    ".email-header img { height: 30px; }" +
                    ".email-header span { font-size: 16px; color: #ffffff; text-align: right; }" +
                    ".main-content { margin-top: 70px; padding: 92px 30px 115px; background: #f4f7ff; border-radius: 30px; text-align: center; }" +
                    ".main-content h1 { margin: 0; font-size: 24px; font-weight: 500; color: #1f1f1f; }" +
                    ".otp-code { margin-top: 60px; font-size: 40px; font-weight: 600; letter-spacing: 10px; color: #1b36ff; }" +
                    ".footer { width: 100%; max-width: 490px; margin: 20px auto 0; text-align: center; border-top: 1px solid #e6ebf1; }" +
                    ".footer p { margin: 0; font-size: 16px; font-weight: 600; color: #434343; }" +
                    ".footer a { color: #499fb6; text-decoration: none; }" +
                    "@media only screen and (max-width: 600px) {" +
                    ".email-container { padding: 30px 20px 40px; }" +
                    ".email-header img { height: 25px; }" +
                    ".main-content { padding: 40px 20px; }" +
                    ".main-content h1 { font-size: 20px; }" +
                    ".otp-code { font-size: 35px; letter-spacing: 8px; }" +
                    ".footer p { font-size: 14px; }" +
                    "}" +
                    "@media only screen and (max-width: 480px) {" +
                    ".email-container { padding: 25px 15px 35px; }" +
                    ".email-header img { height: 20px; }" +
                    ".main-content h1 { font-size: 18px; }" +
                    ".otp-code { font-size: 30px; letter-spacing: 6px; }" +
                    ".footer p { font-size: 12px; }" +
                    "}" +
                    "</style>" +
                    "</head><body>" +
                    "<div class='email-container'>" +
                    "<header>" +
                    "<table class='header-table'>" +
                    "<tbody>" +
                    "<tr>" +
                    "<td class='email-header'>" +
                    "<img alt='' src='https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1663574980688_114990/archisketch-logo' height='30px' />" +
                    "</td>" +
                    "<td style='text-align: right'>" +
                    "<span style='color:white;'>" + DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss").format( LocalDateTime.now())+ "</span>" +
                    "</td>" +
                    "</tr>" +
                    "</tbody>" +
                    "</table>" +
                    "</header>" +
                    "<main>" +
                    "<div class='main-content'>" +
                    "<div style='padding: 15px; color: #1e00ff; font-size: 24px; font-weight: bold; border-radius: 12px 12px 0 0; letter-spacing: 1px;'>" +
                    " Welcome to ShareBox!" +
                    "</div>" +
                    "<div style='width: 100%; max-width: 489px; margin: 0 auto'>" +
                    "<h1>" +
                    "You're just one step away from leveling up your experience! Use the OTP below to verify your email:" +
                    "</h1>" +
                    "<p style='margin: 0; margin-top: 17px; font-size: 16px; font-weight: 500;'>" +
                    "Hey GAMER," +
                    "</p>" +
                    "<p style='margin: 0; margin-top: 17px; font-weight: 500; letter-spacing: 0.56px;'>" +
                    "Use the following OTP to complete the procedure to verify your email address. OTP is valid for " +
                    "<span style='font-weight: 600; color: #1f1f1f'>5 minutes</span>. Do not share this code with others. OTP is:" +
                    "</p>" +
                    "<p class='otp-code'>" + otp + "</p>" +
                    "</div>" +
                    "</div>" +
                    "<p style='max-width: 400px; margin: 0 auto; margin-top: 90px; text-align: center; font-weight: 500; color: #8c8c8c;'>" +
                    "Need help? visit our <a href='' target='_blank'>Website</a>" +
                    "</p>" +
                    "</main>" +
                    "<hr />" +
                    "<footer class='footer'>" +
                    "<p>ShareBox</p>"+
                    "<p>Address 540, City, State.</p>" +
                    "<p>Copyright © 2025 Company. All rights reserved.</p>" +
                    "</footer>" +
                    "</div>" +
                    "</body></html>";

            helper.setText(emailContent, true);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}