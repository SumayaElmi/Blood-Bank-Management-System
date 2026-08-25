package com.bloodsystem.repository;

import com.bloodsystem.model.BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, Integer> {

    List<BloodRequest> findByStatus(String status);

    List<BloodRequest> findByHospitalId(Integer hospitalId);

}