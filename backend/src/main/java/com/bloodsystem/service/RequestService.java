package com.bloodsystem.service;

import com.bloodsystem.model.*;
import com.bloodsystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RequestService {

    @Autowired
    private BloodRequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BloodInventoryRepository inventoryRepository;

    public List<BloodRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    public BloodRequest getRequestById(Integer id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found with ID: " + id));
    }

    @Transactional
    public BloodRequest createRequest(BloodRequest request) {
        if(request.getItems() != null){
            for(BloodRequestItem item : request.getItems()){
                item.setBloodRequest(request);
                if(item.getIssuedUnits() == null) {
                    item.setIssuedUnits(BigDecimal.ZERO);
                }
            }
        }
        return requestRepository.save(request);
    }

    @Transactional
    public BloodRequest approveRequest(Integer requestId, Integer userId) {
        BloodRequest request = getRequestById(requestId);

        if(request.getStatus() != null && !"Pending".equalsIgnoreCase(request.getStatus())){
            throw new RuntimeException("Request is not in Pending status!");
        }

        User approver = null;
        try {
            if(userId != null && userRepository != null) {
                approver = userRepository.findById(userId).orElse(null);
            }
            if(approver == null && userRepository != null) {
                approver = userRepository.findAll().stream().findFirst().orElse(null);
            }
        } catch (Exception e) {
            // Ignore if user cannot be fetched
        }

        if(request.getItems() != null){
            for(BloodRequestItem item : request.getItems()){
                if(item.getRequestedUnits() != null && item.getBloodGroup() != null){
                    BigDecimal requestedUnits = item.getRequestedUnits();

                    List<BloodInventory> inventories = inventoryRepository.findByBloodGroupIdAndStatus(
                            item.getBloodGroup().getId(), "Available"
                    );

                    if (inventories == null || inventories.isEmpty()) {
                        throw new RuntimeException("No available inventory found for group: " + item.getBloodGroup().getGroupName());
                    }

                    BloodInventory inventory = inventories.get(0);

                    // Haddii getter-kaagu yahay getUnits() ama getQuantity(), ku bedel halkaan
                    if (inventory.getUnits().compareTo(requestedUnits) < 0) {
                        throw new RuntimeException("Not enough blood units available for group: " + item.getBloodGroup().getGroupName());
                    }

                    inventory.setUnits(inventory.getUnits().subtract(requestedUnits));
                    inventoryRepository.save(inventory);

                    item.setIssuedUnits(requestedUnits);
                }
            }
        }

        request.setStatus("Approved");
        if(approver != null) {
            request.setApprovedBy(approver);
        }
        request.setApprovedDate(LocalDateTime.now());

        return requestRepository.save(request);
    }

    @Transactional
    public BloodRequest rejectRequest(Integer requestId){
        BloodRequest request = getRequestById(requestId);
        request.setStatus("Rejected");
        return requestRepository.save(request);
    }

    @Transactional
    public void deleteRequest(Integer requestId) {
        BloodRequest request = getRequestById(requestId);
        requestRepository.delete(request);
    }
}