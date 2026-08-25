package com.bloodsystem.repository;

import com.bloodsystem.model.BloodInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodInventoryRepository extends JpaRepository<BloodInventory, Integer> {

    List<BloodInventory> findByStatus(String status);

    List<BloodInventory> findByBloodGroupIdAndStatus(Integer bloodGroupId, String status);

    List<BloodInventory> findByBloodGroupIdAndStatusOrderByExpiryDateAsc(Integer bloodGroupId, String status);

    // Explicit JPQL Query si toos ugu xirmaysa magaca groupName
    @Query("SELECT b FROM BloodInventory b JOIN b.bloodGroup g WHERE g.groupName = :groupName AND b.status = :status ORDER BY b.expiryDate ASC")
    List<BloodInventory> findAvailableByGroupNameExplicit(@Param("groupName") String groupName, @Param("status") String status);

}