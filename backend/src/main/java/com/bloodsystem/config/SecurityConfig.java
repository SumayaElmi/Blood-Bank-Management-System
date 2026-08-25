package com.bloodsystem.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig
    ) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .authorizeHttpRequests(auth -> auth

                        // LOGIN
                        .requestMatchers("/api/auth/**").permitAll()

                        // USER MANAGEMENT
                        .requestMatchers("/api/users/**")
                        .hasAuthority("Administrator")

                        // ROLES
                        .requestMatchers("/api/roles/**")
                        .hasAuthority("Administrator")

                        // DONORS
                        .requestMatchers("/api/donors/**")
                        .hasAnyAuthority("Administrator", "Staff", "Lab Technician")

                        // DONATIONS
                        .requestMatchers("/api/donations/**")
                        .hasAnyAuthority("Administrator", "Lab Technician")

                        // BLOOD REQUESTS
                        .requestMatchers("/api/requests/**")
                        .hasAnyAuthority("Administrator", "Doctor", "Staff")

                        // INVENTORY
                        .requestMatchers("/api/inventory/**")
                        .hasAnyAuthority("Administrator", "Doctor", "Lab Technician")

                        // REPORTS
                        .requestMatchers("/api/reports/**")
                        .hasAuthority("Administrator")

                        // OTHER APIs
                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}