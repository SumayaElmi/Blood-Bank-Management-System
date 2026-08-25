package com.bloodsystem.controller;

import com.bloodsystem.model.BloodRequest;
import com.bloodsystem.service.RequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;


    @GetMapping
    public List<BloodRequest> getAllRequests() {

        return requestService.getAllRequests();

    }



    @GetMapping("/{id}")
    public BloodRequest getRequestById(
            @PathVariable Integer id) {

        return requestService.getRequestById(id);

    }



    @PostMapping
    public BloodRequest createRequest(
            @Valid @RequestBody BloodRequest request) {

        return requestService.createRequest(request);

    }



    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveRequest(
            @PathVariable Integer id) {

        try {

            BloodRequest request =
                    requestService.approveRequest(id, null);

            return ResponseEntity.ok(request);


        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));

        }

    }



    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectRequest(
            @PathVariable Integer id) {

        try {

            BloodRequest request =
                    requestService.rejectRequest(id);

            return ResponseEntity.ok(request);


        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));

        }

    }

}