package com.bloodsystem.service;

import com.bloodsystem.model.BloodGroup;
import com.bloodsystem.model.Donor;
import com.bloodsystem.repository.BloodGroupRepository;
import com.bloodsystem.repository.DonorRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DonorService {

    private final DonorRepository donorRepository;
    private final BloodGroupRepository bloodGroupRepository;

    public DonorService(DonorRepository donorRepository, BloodGroupRepository bloodGroupRepository) {
        this.donorRepository = donorRepository;
        this.bloodGroupRepository = bloodGroupRepository;
    }

    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    public Donor createDonor(Donor donor) {
        if (donor.getDonorCode() == null) {
            donor.setDonorCode("DNR-" + System.currentTimeMillis());
        }

        Integer bloodId = donor.getBloodGroup().getId();
        BloodGroup bloodGroup = bloodGroupRepository.findById(bloodId)
                .orElseThrow(() -> new RuntimeException("Blood Group not found"));

        donor.setBloodGroup(bloodGroup);
        return donorRepository.save(donor);
    }

    public Donor updateDonor(Integer id, Donor data) {
        Donor donor = donorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        donor.setFullName(data.getFullName());
        donor.setGender(data.getGender());
        donor.setAge(data.getAge());
        donor.setPhone(data.getPhone());
        donor.setEmail(data.getEmail());
        donor.setAddress(data.getAddress());
        donor.setPhoto(data.getPhoto());
        donor.setStatus(data.getStatus());

        if (data.getBloodGroup() != null) {
            BloodGroup bg = bloodGroupRepository.findById(data.getBloodGroup().getId())
                    .orElseThrow(() -> new RuntimeException("Blood Group not found"));
            donor.setBloodGroup(bg);
        }

        return donorRepository.save(donor);
    }

    public void deleteDonor(Integer id) {
        donorRepository.deleteById(id);
    }

    public List<Donor> searchDonorsByName(String name) {
        return donorRepository.findByFullNameContainingIgnoreCase(name);
    }
}