package com.bloodsystem.controller;


import com.bloodsystem.config.JwtUtils;
import com.bloodsystem.dto.JwtResponse;
import com.bloodsystem.dto.LoginRequest;
import com.bloodsystem.dto.MessageResponse;
import com.bloodsystem.dto.SignupRequest;
import com.bloodsystem.model.User;
import com.bloodsystem.repository.UserRepository;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.web.bind.annotation.*;


import java.util.List;



@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins="*")
public class AuthController {



    @Autowired
    private AuthenticationManager authenticationManager;



    @Autowired
    private UserRepository userRepository;



    @Autowired
    private JwtUtils jwtUtils;







    @PostMapping("/signin")
    public ResponseEntity<?> login(

            @Valid @RequestBody LoginRequest request

    ){



        Authentication authentication =

                authenticationManager.authenticate(

                        new UsernamePasswordAuthenticationToken(

                                request.getUsername(),

                                request.getPassword()

                        )

                );




        SecurityContextHolder

                .getContext()

                .setAuthentication(authentication);




        String token=

                jwtUtils.generateJwtToken(authentication);





        UserDetails userDetails=

                (UserDetails)

                        authentication.getPrincipal();





        User user=

                userRepository

                        .findByUsername(userDetails.getUsername())

                        .orElseThrow();



        String role = user.getRole().getName();



        if(role.equals("System Administrator")){

            role="ADMIN";

        }

        else if(role.equals("Blood Bank Staff")){

            role="STAFF";

        }

        else if(role.equals("Medical Officer")){

            role="DOCTOR";

        }

        else if(role.equals("Laboratory Staff")){

            role="TECHNICIAN";

        }





        List<String> roles=

                List.of(

                        "ROLE_"+role

                );





        return ResponseEntity.ok(

                new JwtResponse(

                        token,

                        user.getUsername(),

                        user.getFullName(),

                        user.getEmail(),

                        user.getPhone(),

                        roles

                )

        );


    }







    @PostMapping("/signup")

    public ResponseEntity<?> signup(

            @Valid @RequestBody SignupRequest request

    ){


        return ResponseEntity

                .status(HttpStatus.FORBIDDEN)

                .body(

                        new MessageResponse(

                                "Registration disabled"

                        )

                );


    }



}