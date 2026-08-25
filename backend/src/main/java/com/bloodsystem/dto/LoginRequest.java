package com.bloodsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 100, message = "Username must be between 3 and 100 characters")
    @Pattern( // ugu yaraan 1 staring
            regexp = "^(?=.*[a-zA-Z])[a-zA-Z0-9_]+$",
            message = "Username must contain letters and can only contain numbers and underscore"
    )
    private String username;


    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 40, message = "Password must be between 6 and 40 characters")
    @Pattern(/// ugu yaraan 1 integer
            regexp = ".*\\d.*",
            message = "Password must contain at least one number"
    )
    private String password;
}