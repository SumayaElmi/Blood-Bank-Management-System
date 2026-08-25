package com.bloodsystem.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "donation_id", updatable = false, nullable = false)
    private Integer id;

    @NotNull(message = "Donor is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    @NotNull(message = "Donation date is required")
    @Column(name = "donation_date", nullable = false)
    private LocalDate donationDate;

    @NotNull(message = "Units are required")
    @Positive(message = "Units must be greater than zero")
    @Column(name = "units", nullable = false, precision = 5, scale = 2)
    private BigDecimal units;

    @NotBlank(message = "Doctor name is required")
    @Pattern(
            regexp = "^[a-zA-Z .]+$",
            message = "Doctor name must contain only letters, spaces and dots"
    )
    @Column(name = "doctor_name", length = 150)
    private String doctorName;

    @NotBlank(message = "Please enter remarks")
    @Pattern(
            regexp = "^[a-zA-Z0-9 ,.-]*$",
            message = "Remarks must contain only letters, numbers, spaces, commas and dots"
    )
    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @JsonSetter("remarks")
    @JsonProperty("remarks")
    public void setRemarks(Object remarks) {
        if (remarks == null) {
            this.remarks = null;
            return;
        }

        if (!(remarks instanceof String)) {
            throw new IllegalArgumentException("Remarks must be a valid text string.");
        }

        String textVal = ((String) remarks).trim();

        if (textVal.isEmpty()) {
            throw new IllegalArgumentException("Remarks cannot be empty or blank spaces. Please enter text.");
        }

        if (textVal.matches("^\\d+$")) {
            throw new IllegalArgumentException("Remarks cannot be only numbers. Please enter text.");
        }

        this.remarks = textVal;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}