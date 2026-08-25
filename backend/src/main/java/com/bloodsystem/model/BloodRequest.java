package com.bloodsystem.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "blood_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id", updatable = false, nullable = false)
    private Integer id;


    @NotNull(message = "Hospital is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;


    @Column(name = "request_date", nullable = false)
    @Builder.Default
    private LocalDate requestDate = LocalDate.now();


    @NotBlank(message = "Priority is required")
    @Column(name = "priority", length = 20)
    private String priority;


    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "Pending";


    @NotBlank(message = "Requested by is required")
    @Column(name = "requested_by", length = 120)
    private String requestedBy;


    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "approved_by")
    private User approvedBy;


    @Column(name = "approved_date")
    private LocalDateTime approvedDate;


    @NotEmpty(message = "Request items cannot be empty")
    @OneToMany(
            mappedBy = "bloodRequest",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER
    )
    @Builder.Default
    private List<BloodRequestItem> items = new ArrayList<>();

}