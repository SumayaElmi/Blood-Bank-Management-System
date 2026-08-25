package com.bloodsystem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "blood_request_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodRequestItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id", updatable = false, nullable = false)
    private Integer id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private BloodRequest bloodRequest;


    @NotNull(message = "Blood group is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "blood_group_id")
    private BloodGroup bloodGroup;


    @NotNull(message = "Requested units are required")
    @PositiveOrZero(message = "Requested units must be zero or greater")
    @Column(name = "requested_units", nullable = false, precision = 5, scale = 2)
    private BigDecimal requestedUnits;


    @PositiveOrZero(message = "Issued units must be zero or greater")
    @Column(name = "issued_units", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal issuedUnits = BigDecimal.ZERO;
}