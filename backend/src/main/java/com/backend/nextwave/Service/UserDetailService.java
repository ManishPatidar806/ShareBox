package com.backend.nextwave.Service;

import com.backend.nextwave.Exception.UserNotFoundException;
import com.backend.nextwave.Model.Entity.User;
import com.backend.nextwave.Repository.UserRepository;
import lombok.SneakyThrows;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @SneakyThrows
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User userEntity = userRepository.findByEmail(username).orElseThrow(UserNotFoundException::new);
        return new UserDetail(userEntity);
    }
}
