package com.bloodsystem.repository;


import com.bloodsystem.model.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;



@Repository
public interface DonorRepository
        extends JpaRepository<Donor,Integer>{



    List<Donor> findByFullNameContainingIgnoreCase(
            String fullName
    );



    List<Donor> findByBloodGroupId(
            Integer bloodGroupId
    );


}