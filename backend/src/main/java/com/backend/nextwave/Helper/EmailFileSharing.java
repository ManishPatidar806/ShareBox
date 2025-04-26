package com.backend.nextwave.Helper;

import com.backend.nextwave.Model.Files;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Service
public class EmailFileSharing {

    @Autowired
    private JavaMailSender mailSender;


    public void sendLinkEmail(String to, String link , Files files) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject("Your File is Ready to Download!");

            String emailContent = "<!DOCTYPE html>" +
                    "<html>" +
                    "<head>" +
                    "<meta charset='utf-8' />" +
                    "<meta name='viewport' content='width=device-width, initial-scale=1.0' />" +
                    "<title>Your File is Ready to Download</title>" +
                    "<style>" +
                    "body { font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f7fa; }" +
                    ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                    ".header { text-align: center; padding: 20px 0; }" +
                    ".header img { width: 120px; height: auto; }" +
                    ".main-content { background: #ffffff; border-radius: 8px; padding: 30px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }" +
                    ".main-content h1 { color: #2563eb; margin-bottom: 20px; font-size: 24px; }" +
                    ".file-info { background: #f8fafc; border-radius: 6px; padding: 15px; margin: 20px 0; }" +
                    ".file-info p { margin: 0; color: #64748b; }" +
                    ".download-btn { display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #2563eb, #0ea5e9); color: white; text-decoration: none; border-radius: 6px; font-weight: 500; text-align: center; }" +
                    ".footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }" +
                    "</style>" +
                    "</head>" +
                    "<body>" +
                    "<div class='container'>" +
                    "<div class='header'>" +
                    "<img src='https://your-logo-url.com/logo.png' alt='Logo' />" +
                    "</div>" +
                    "<div class='main-content'>" +
                    "<h1>Your File is Ready to Download</h1>" +
                    "<p>Hello User,</p>" +
                    "<p>[Sender Name] ([Sender Email]) has shared a file with you via SecureFileX.</p>" +
                    "<div class='file-info'>" +
                    "<p><strong>File Name:</strong> "+files.getFileName() +"</p>" +
                    "<p><strong>Size:</strong> "+files.getFileSize() +"</p>" +
                    "<p><strong>Expires:</strong> "+files.getExpiryDate() +"</p>" +
                    "</div>" +
                    "<div style='text-align: center; margin: 30px 0;'>" +
                    "<a href='"+ link +"' class='download-btn'>Download File</a>" +
                    "</div>" +
                    "<p style='color: #64748b;'>Message from sender:<br>" +
                    "\"Download this file As soon as Possible\"" +
                    "</p>" +
                    "<p style='color: #64748b; font-size: 14px;'>For security reasons, this link will expire in 7 days. If you have any issues accessing the file, please contact the sender directly.</p>" +
                    "</div>" +
                    "<div class='footer'>" +
                    "<p>Sent via ShareBox - Secure File Sharing Platform</p>" +
                    "<p>© 2024 ShareBox. All rights reserved.</p>" +
                    "</div>" +
                    "</div>" +
                    "</body>" +
                    "</html>";


            helper.setText(emailContent, true);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
