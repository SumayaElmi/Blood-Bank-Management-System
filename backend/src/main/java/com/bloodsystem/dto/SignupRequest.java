package com.bloodsystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 150, message = "Full name must be between 2 and 150 characters")
    @Pattern(
            regexp = "^[a-zA-Z ]+$",
            message = "Full name must contain only letters"
    )
    private String fullName;


    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 100, message = "Username must be between 3 and 100 characters")
    @Pattern(
            regexp = "^[a-zA-Z][a-zA-Z0-9_]*$",
            message = "Username must start with a letter and contain only letters, numbers and underscore"
    )
    private String username;


    @NotBlank(message = "Email is required")
    @Size(max = 150, message = "Email must not exceed 150 characters")
    @Email(message = "Invalid email format")
    private String email;


    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 40, message = "Password must be between 6 and 40 characters")
    @Pattern(
            regexp = ".*\\d.*",
            message = "Password must contain at least one number"
    )
    private String password;


    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[0-9]+$",
            message = "Phone must contain only numbers"
    )
    private String phone;


    @NotBlank(message = "Role is required")
    private String role;
}