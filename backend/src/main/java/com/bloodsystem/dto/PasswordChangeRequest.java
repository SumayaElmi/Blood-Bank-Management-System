package com.bloodsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PasswordChangeRequest {

    @NotBlank(message = "Current password is required")
    private String currentPassword;


    @NotBlank(message = "New password is required")
    @Size(min = 6, max = 40, message = "New password must be between 6 and 40 characters")
    @Pattern(
            regexp = ".*\\d.*",
            message = "New password must contain at least one number"
    )
    private String newPassword;
}