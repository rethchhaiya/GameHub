package com.gamehub.backend.security;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.gamehub.backend.entity.User;
import com.gamehub.backend.services.JwtService;
import com.gamehub.backend.services.UserService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component 
public class JwtAuthenticationFilter extends OncePerRequestFilter{
    private final JwtService jwtService;
    private final UserService userService;

    JwtAuthenticationFilter(JwtService jwtService,
                            UserService userService){
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
    throws ServletException, IOException{
        String authHeader = request.getHeader("Authorization");

        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request, response);
            return ;
        }

        String token = authHeader.substring(7);

        try{
            Claims claims = jwtService.parseToken(token);
            
            Optional<User> found = userService.findById(Long.valueOf(claims.getSubject()));
            if(found.isPresent()){
                User user = found.get();

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(user, null, List.of());

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

        }catch(JwtException error){
            System.out.println("Invalid token: " + token);
        }
        filterChain.doFilter(request, response);
    }
}
