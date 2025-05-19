package com.backend.nextwave.Service;

import com.backend.nextwave.Config.JwtConfig;
import com.backend.nextwave.DTO.ChangePasswordDto;
import com.backend.nextwave.Exception.CommanException;
import com.backend.nextwave.Exception.UserNotFoundException;
import com.backend.nextwave.Model.Entity.User;
import com.backend.nextwave.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtConfig jwtConfig;

    public User signUpUser(User user) throws UserNotFoundException {
        Optional<User> user1 = userRepository.findByEmail(user.getEmail());
        if (user1.isPresent()) {
            throw new UserNotFoundException();
        }
        return userRepository.save(user);

    }
    public User loginUser(String email , String password) throws CommanException, UserNotFoundException {
        Optional<User> user1 = userRepository.findByEmail(email);
        if (user1.isPresent()) {
            if(user1.get().getPassword().equals(password)){
                return user1.get();
            }else {
                throw new UserNotFoundException();
            }
        }else{
            throw new CommanException("User does not Exist");
        }
    }


    public User enableTwoStepVerification(String email) throws Exception {
        Optional<User> user = userRepository.findByEmail(email);
        if(user.isPresent()){
            User user1 = user.get();
            user1.setTwoFactorEnabled(!user1.isTwoFactorEnabled());
            userRepository.save(user1);
            return user1;
        }else {
            throw new UserNotFoundException();
        }
    }


    public User changePassword(String email, ChangePasswordDto changePasswordDto)
            throws UserNotFoundException, CommanException {

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            throw new UserNotFoundException();
        }

        User user = userOptional.get();

        if (!user.getPassword().equals(changePasswordDto.getOldPassword())) {
            throw new CommanException("Entered password is wrong!");
        }

        user.setPassword(changePasswordDto.getNewPassword());
        return userRepository.save(user);
    }




}
