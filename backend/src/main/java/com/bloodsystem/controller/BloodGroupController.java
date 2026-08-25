package com.bloodsystem.controller;

import com.bloodsystem.model.BloodGroup;
import com.bloodsystem.repository.BloodGroupRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/blood-groups")
@CrossOrigin("*")
public class BloodGroupController {


    private final BloodGroupRepository bloodGroupRepository;


    public BloodGroupController(
            BloodGroupRepository bloodGroupRepository
    ){
        this.bloodGroupRepository = bloodGroupRepository;
    }



    @GetMapping
    public List<BloodGroup> getAllBloodGroups(){

        return bloodGroupRepository.findAll();

    }

}