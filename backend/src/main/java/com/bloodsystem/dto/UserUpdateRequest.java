package com.bloodsystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateRequest {

    @NotBlank(message = "Full name is required")
    @Size(
            min = 2,
            max = 150,
            message = "Full name must be between 2 and 150 characters"
    )
    @Pattern(
            regexp = "^[a-zA-Z ]+$",
            message = "Full name must contain only letters and spaces"
    )
    private String fullName;


    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(
            max = 150,
            message = "Email must not exceed 150 characters"
    )
    private String email;


    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[0-9]{7,15}$",
            message = "Phone number must contain only digits and be between 7 and 15 numbers"
    )
    private String phone;


    @NotBlank(message = "Role is required")
    @Pattern(
            regexp = "^(ADMIN|USER|STAFF|LAB_TECHNICIAN)$",
            message = "Invalid role"
    )
    private String role;


    private Boolean status;
}