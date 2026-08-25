package com.bloodsystem.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;


import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;


@Component
public class JwtUtils {


    private static final Logger logger =
            LoggerFactory.getLogger(JwtUtils.class);



    @Value("${bloodsystem.jwt.secret}")
    private String jwtSecret;



    @Value("${bloodsystem.jwt.expirationMs}")
    private int jwtExpirationMs;





    private Key key(){

        return Keys.hmacShaKeyFor(
                jwtSecret.getBytes(StandardCharsets.UTF_8)
        );

    }





    public String generateJwtToken(
            Authentication authentication
    ){

        UserDetails userPrincipal =
                (UserDetails) authentication.getPrincipal();



        return Jwts.builder()

                .setSubject(
                        userPrincipal.getUsername()
                )

                .setIssuedAt(
                        new Date()
                )

                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + jwtExpirationMs
                        )
                )

                .signWith(
                        key(),
                        SignatureAlgorithm.HS256
                )

                .compact();

    }





    public String getUsernameFromJwtToken(
            String token
    ){

        return Jwts.parserBuilder()

                .setSigningKey(key())

                .build()

                .parseClaimsJws(token)

                .getBody()

                .getSubject();

    }





    public boolean validateJwtToken(
            String token
    ){

        try {


            Jwts.parserBuilder()

                    .setSigningKey(key())

                    .build()

                    .parseClaimsJws(token);



            return true;


        }

        catch (MalformedJwtException e){

            logger.error(
                    "Invalid JWT token: {}",
                    e.getMessage()
            );

        }

        catch (ExpiredJwtException e){

            logger.error(
                    "JWT expired: {}",
                    e.getMessage()
            );

        }

        catch (UnsupportedJwtException e){

            logger.error(
                    "Unsupported JWT: {}",
                    e.getMessage()
            );

        }

        catch (SecurityException e){

            logger.error(
                    "JWT signature error: {}",
                    e.getMessage()
            );

        }

        catch (IllegalArgumentException e){

            logger.error(
                    "JWT claims empty: {}",
                    e.getMessage()
            );

        }


        return false;

    }

}