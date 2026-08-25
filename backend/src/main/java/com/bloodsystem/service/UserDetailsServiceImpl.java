package com.bloodsystem.service;

import com.bloodsystem.model.User;
import com.bloodsystem.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(
            String username
    ) throws UsernameNotFoundException {

        User user =
                userRepository.findByUsername(username)
                        .orElseThrow(
                                () -> new UsernameNotFoundException(
                                        "User not found"
                                )
                        );

        // Role ka yimaada database-ka (tusaale: Administrator)
        String role = user.getRole().getName();

        System.out.println("DATABASE ROLE: " + role);

        return org.springframework.security.core.userdetails.User
                .withUsername(
                        user.getUsername()
                )
                .password(
                        user.getPassword()
                )
                .authorities(
                        List.of(
                                new SimpleGrantedAuthority(
                                        role // Magaca saafi ah oo aan wadan "ROLE_"
                                )
                        )
                )
                .disabled(
                        user.getStatus() != null
                                &&
                                !user.getStatus()
                )
                .build();
    }
}