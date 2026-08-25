package com.bloodsystem.service;

import com.bloodsystem.model.BloodInventory;
import com.bloodsystem.model.Donation;
import com.bloodsystem.repository.AppointmentRepository;
import com.bloodsystem.repository.BloodInventoryRepository;
import com.bloodsystem.repository.DonationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class DonationService {

    private final DonationRepository donationRepository;
    private final BloodInventoryRepository bloodInventoryRepository;
    private final AppointmentRepository appointmentRepository;

    public DonationService(
            DonationRepository donationRepository,
            BloodInventoryRepository bloodInventoryRepository,
            AppointmentRepository appointmentRepository
    ) {
        this.donationRepository = donationRepository;
        this.bloodInventoryRepository = bloodInventoryRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    public Donation getDonationById(Integer id) {
        return donationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Donation not found"));
    }

    public List<Donation> getDonationsByDonor(Integer donorId) {
        return donationRepository.findByDonorId(donorId);
    }

    @Transactional
    public Donation createDonation(Donation donation) {

        Integer donorId = donation.getDonor().getId();

        // Shuruudda ah in appointment-ka uu Completed yahay waa la ilaaliyay
        boolean hasAppointment =
                appointmentRepository.existsByDonor_IdAndStatus(
                        donorId,
                        "Completed"
                );

        if (!hasAppointment) {
            throw new RuntimeException(
                    "This donor has no completed appointment. Please complete their appointment first."
            );
        }

        Donation savedDonation = donationRepository.save(donation);

        BloodInventory inventory = BloodInventory.builder()
                .donation(savedDonation)
                .bloodGroup(savedDonation.getDonor().getBloodGroup())
                .bloodBagNumber("BAG-" + System.currentTimeMillis())
                .collectionDate(LocalDate.now())
                .expiryDate(LocalDate.now().plusDays(35))
                .units(savedDonation.getUnits())
                .status("Available")
                .build();

        bloodInventoryRepository.save(inventory);

        return savedDonation;
    }
}