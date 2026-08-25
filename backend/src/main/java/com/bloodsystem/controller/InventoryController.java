package com.bloodsystem.controller;

import com.bloodsystem.model.BloodInventory;
import com.bloodsystem.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/inventory")
public class InventoryController {


    @Autowired
    private InventoryService inventoryService;



    @GetMapping
    public List<BloodInventory> getAllInventory() {

        return inventoryService.getAllInventory();

    }



    @GetMapping("/{id}")
    public BloodInventory getInventoryById(
            @PathVariable Integer id
    ) {

        return inventoryService.getInventoryById(id);

    }



    @PostMapping
    public BloodInventory createInventory(
            @RequestBody BloodInventory item
    ) {

        return inventoryService.createInventory(item);

    }



    @PutMapping("/{id}")
    public BloodInventory updateInventory(
            @PathVariable Integer id,
            @RequestBody BloodInventory item
    ) {

        return inventoryService.updateInventory(id, item);

    }



    @DeleteMapping("/{id}")
    public void deleteInventory(
            @PathVariable Integer id
    ) {

        inventoryService.deleteInventory(id);

    }



    @PostMapping("/check-expired")
    public String checkExpired() {

        inventoryService.checkAndMarkExpired();

        return "Expired items checked and updated successfully.";

    }

}