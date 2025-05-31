package com.backend.nextwave.Config;

import com.backend.nextwave.utils.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final CorsConfig corsConfig;

    public SecurityConfig(JwtFilter jwtFilter, CorsConfig corsConfig) {
        this.jwtFilter = jwtFilter;
        this.corsConfig = corsConfig;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity.csrf(AbstractHttpConfigurer::disable).
                cors(cors->cors.configurationSource(corsConfig.configurationSource())).
                authorizeHttpRequests(auth ->
                        auth.requestMatchers("/api/auth/signup", "/api/auth/signin").permitAll()
                                .anyRequest()
                        .authenticated()).addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();


    }

}
