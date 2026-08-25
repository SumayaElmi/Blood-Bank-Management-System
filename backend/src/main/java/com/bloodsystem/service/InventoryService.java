package com.bloodsystem.service;


import com.bloodsystem.model.BloodInventory;
import com.bloodsystem.repository.BloodInventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDate;
import java.util.List;


@Service
public class InventoryService {


    @Autowired
    private BloodInventoryRepository inventoryRepository;



    public List<BloodInventory> getAllInventory() {

        return inventoryRepository.findAll();

    }



    public BloodInventory getInventoryById(Integer id) {

        return inventoryRepository.findById(id)

                .orElseThrow(() ->
                        new RuntimeException(
                                "Inventory item not found with ID: " + id
                        ));

    }



    public BloodInventory createInventory(BloodInventory item) {

        return inventoryRepository.save(item);

    }



    public BloodInventory updateInventory(
            Integer id,
            BloodInventory details
    ) {


        BloodInventory item = getInventoryById(id);


        item.setBloodBagNumber(details.getBloodBagNumber());

        item.setExpiryDate(details.getExpiryDate());

        item.setUnits(details.getUnits());

        item.setLocation(details.getLocation());

        item.setStatus(details.getStatus());


        return inventoryRepository.save(item);

    }



    public void deleteInventory(Integer id) {


        BloodInventory item = getInventoryById(id);


        inventoryRepository.delete(item);

    }




    @Transactional
    public void checkAndMarkExpired() {


        List<BloodInventory> availableStock =
                inventoryRepository.findByStatus("Available");


        LocalDate today = LocalDate.now();



        for (BloodInventory item : availableStock) {


            if(item.getExpiryDate() != null &&
                    item.getExpiryDate().isBefore(today)) {


                item.setStatus("Expired");


                inventoryRepository.save(item);

            }

        }

    }

}