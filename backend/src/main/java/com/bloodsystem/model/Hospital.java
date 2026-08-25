package com.bloodsystem.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "hospitals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hospital_id", updatable = false, nullable = false)
    private Integer id;


    // System ayaa sameyn kara
    @Column(name = "hospital_code", unique = true, length = 20)
    private String hospitalCode;



    @NotBlank(message = "Hospital name is required")
    @Size(
            min = 2,
            max = 150,
            message = "Hospital name must be between 2 and 150 characters"
    )
    @Column(name = "hospital_name", nullable = false, length = 150)
    private String hospitalName;



    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[0-9]{7,15}$",
            message = "Phone number must contain only digits and be between 7 and 15 digits"
    )
    @Column(name = "phone", length = 20)
    private String phone;



    @Email(message = "Invalid email format")
    @Column(name = "email", length = 120)
    private String email;



    @Column(name = "address", columnDefinition = "TEXT")
    private String address;



    @Pattern(
            regexp = "^[a-zA-Z ]+$",
            message = "Contact person must contain only letters and spaces"
    )
    @Column(name = "contact_person", length = 120)
    private String contactPerson;



    @Builder.Default
    @Column(name = "status")
    private Boolean status = true;



    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}