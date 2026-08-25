package com.bloodsystem.model;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointment_id", updatable = false, nullable = false)
    private Integer id;

    @NotNull(message = "Donor is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    @NotNull(message = "Appointment date is required")
    @Column(name = "appointment_date", nullable = false)
    private LocalDate appointmentDate;

    @NotNull(message = "Appointment time is required")
    @Column(name = "appointment_time", nullable = false)
    private LocalTime appointmentTime;

    @Column(name = "status", length = 20, nullable = false)
    @Builder.Default
    private String status = "Scheduled";
    @NotBlank(message = "Please enter remarks")
    @Pattern(
            regexp = "^[a-zA-Z0-9 ,.-]*$",
            message = "Remarks must contain only letters, numbers, spaces, commas and dots"
    )
    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    // Hubinta inuu yahay String oo uusan ahayn nambar saafi ah
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

        // Hubi haddii uu yahay nambar saafi ah (tusaale: "333333")
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