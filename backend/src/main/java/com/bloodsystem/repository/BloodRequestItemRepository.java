package com.bloodsystem.repository;

import com.bloodsystem.model.BloodRequestItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BloodRequestItemRepository extends JpaRepository<BloodRequestItem, Integer> {

}