package com.backend.nextwave.utils;

import com.backend.nextwave.Config.JwtConfig;
import com.backend.nextwave.Service.UserDetailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;

@Component
public class JwtFilter extends OncePerRequestFilter {


    private final JwtConfig jwtConfig;

    private final UserDetailService userDetailService;

    public JwtFilter(JwtConfig jwtConfig, UserDetailService userDetailService) {
        this.jwtConfig = jwtConfig;
        this.userDetailService = userDetailService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        try {
            String header = request.getHeader("Authorization");
            String token = null;
            String email = null;

            if (header != null && header.trim().startsWith("Bearer ")) {
                token = header.substring(7).trim();
                email = jwtConfig.extractEmail(token);
            }

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetail = userDetailService.loadUserByUsername(email);

                if (jwtConfig.validateToken(token, email)) {
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetail, userDetail.getPassword(), userDetail.getAuthorities());
                    usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                }


            }
            filterChain.doFilter(request, response);

        } catch (Exception e) {
            response.setStatus(401);
            response.setContentType("application/json");
            response.getWriter().write(
                    new ObjectMapper().writeValueAsString(
                            Map.of(
                                    "error", "Internal Server Error",
                                    "message", "Unauthorized Access",
                                    "serverMessage", e.getMessage()
                            )
                    )
            );
        }


    }
}
