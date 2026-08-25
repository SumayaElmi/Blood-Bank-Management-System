package com.bloodsystem.controller;

import com.bloodsystem.model.Donor;
import com.bloodsystem.service.DonorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donors")
@CrossOrigin("*")
public class DonorController {

    private final DonorService donorService;

    public DonorController(DonorService donorService) {
        this.donorService = donorService;
    }

    @GetMapping
    public ResponseEntity<List<Donor>> getAllDonors(){
        return ResponseEntity.ok(
                donorService.getAllDonors()
        );
    }

    @PostMapping
    public ResponseEntity<?> createDonor(
            @RequestBody Donor donor
    ){
        try{
            Donor saved = donorService.createDonor(donor);
            return ResponseEntity.ok(saved);
        }catch(Exception e){
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDonor(
            @PathVariable Integer id,
            @RequestBody Donor donor
    ){
        try{
            return ResponseEntity.ok(
                    donorService.updateDonor(id, donor)
            );
        }catch(Exception e){
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDonor(
            @PathVariable Integer id
    ){
        donorService.deleteDonor(id);
        return ResponseEntity.ok(
                "Donor deleted successfully"
        );
    }

    @GetMapping("/search")
    public ResponseEntity<List<Donor>> search(
            @RequestParam String name
    ){
        return ResponseEntity.ok(
                donorService.searchDonorsByName(name)
        );
    }
}