package com.bloodsystem.repository;


import com.bloodsystem.model.BloodGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface BloodGroupRepository
        extends JpaRepository<BloodGroup,Integer>{

}