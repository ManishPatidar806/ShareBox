package com.backend.nextwave.Service;

import com.backend.nextwave.DTO.ChangePasswordDto;
import com.backend.nextwave.Exception.CommanException;
import com.backend.nextwave.Exception.UserNotFoundException;
import com.backend.nextwave.Model.Entity.User;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {

    public User signUpUser(User user) throws UserNotFoundException;

    public User loginUser(String email, String password) throws CommanException, UserNotFoundException;


    public User enableTwoStepVerification(String email) throws Exception;

    public User changePassword(String email, ChangePasswordDto changePasswordDto) throws UserNotFoundException, CommanException;
}