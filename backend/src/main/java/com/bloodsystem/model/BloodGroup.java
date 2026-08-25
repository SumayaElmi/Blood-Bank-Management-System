package com.bloodsystem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;


@Entity
@Table(name = "blood_groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodGroup {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "blood_group_id")
    private Integer id;



    @Column(
            name = "blood_group",
            nullable = false,
            unique = true,
            length = 5
    )
    private String groupName;



    @JsonIgnore
    @OneToMany(
            mappedBy = "bloodGroup",
            fetch = FetchType.LAZY
    )
    private List<Donor> donors;

}