package com.bloodsystem.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name="donors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="donor_id")
    private Integer id;

    @Column(name="donor_code", unique=true, nullable=false)
    private String donorCode;

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 150, message = "Full name must be between 2 and 150 characters")
    @Pattern(regexp = "^[a-zA-Z ]+$", message = "Full name must contain only letters and spaces")
    @Column(name="full_name", nullable=false)
    private String fullName;

    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "^(Male|Female)$", message = "Gender must be Male or Female")
    private String gender;

    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 65, message = "Age must not exceed 65")
    private Integer age;

    @NotNull(message = "Blood group is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="blood_group_id", nullable=false)
    @JsonIgnoreProperties({"donors"})
    private BloodGroup bloodGroup;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{7,15}$", message = "Phone number must contain only digits and be between 7 and 15 digits")
    private String phone;

    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^[a-zA-Z ]+$", message = "Address must contain only letters and spaces")
    @Column(columnDefinition="TEXT")
    private String address;

    @Column(columnDefinition="TEXT")
    private String photo;

    private LocalDate lastDonationDate;

    @Builder.Default
    private Integer totalDonations = 0;

    @Builder.Default
    private String status = "Active";

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}