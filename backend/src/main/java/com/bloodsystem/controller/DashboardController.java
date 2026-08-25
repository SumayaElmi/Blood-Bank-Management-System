package com.bloodsystem.controller;

import com.bloodsystem.model.Appointment;
import com.bloodsystem.model.BloodInventory;
import com.bloodsystem.model.BloodRequest;
import com.bloodsystem.model.Donation;
import com.bloodsystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private static final List<String> BLOOD_GROUPS = List.of("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-");
    private static final BigDecimal LOW_STOCK_THRESHOLD = new BigDecimal("5.0");

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private BloodInventoryRepository inventoryRepository;

    @Autowired
    private BloodRequestRepository requestRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DonationRepository donationRepository;

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalDonors = donorRepository.count();
        long totalHospitals = hospitalRepository.count();
        long totalRequests = requestRepository.count();
        long totalDonations = donationRepository.count();
        long pendingRequests = requestRepository.findByStatus("Pending").size();

        List<BloodInventory> availableStock = inventoryRepository.findByStatus("Available");
        BigDecimal totalAvailableUnits = availableStock.stream()
                .map(item -> item.getUnits() != null ? item.getUnits() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> groupDistribution = new HashMap<>();
        for (String group : BLOOD_GROUPS) {
            groupDistribution.put(group, BigDecimal.ZERO);
        }
        for (BloodInventory item : availableStock) {
            if (item.getBloodGroup() == null) continue;
            String groupName = item.getBloodGroup().getGroupName();
            BigDecimal units = item.getUnits() != null ? item.getUnits() : BigDecimal.ZERO;
            groupDistribution.put(groupName, groupDistribution.getOrDefault(groupName, BigDecimal.ZERO).add(units));
        }

        List<String> lowStockGroups = groupDistribution.entrySet().stream()
                .filter(e -> e.getValue().compareTo(LOW_STOCK_THRESHOLD) < 0)
                .map(Map.Entry::getKey)
                .sorted()
                .collect(Collectors.toList());

        LocalDate today = LocalDate.now();
        LocalDate sevenDaysLater = today.plusDays(7);
        long expiringBags = availableStock.stream()
                .filter(item -> item.getExpiryDate() != null &&
                        !item.getExpiryDate().isBefore(today) &&
                        !item.getExpiryDate().isAfter(sevenDaysLater))
                .count();

        long expiredBags = inventoryRepository.findByStatus("Expired").size();
        long issuedBags = inventoryRepository.findByStatus("Issued").size();

        List<Appointment> todayAppointments = appointmentRepository.findByAppointmentDate(today);
        List<BloodRequest> pendingRequestList = requestRepository.findByStatus("Pending").stream()
                .sorted(Comparator.comparing(BloodRequest::getRequestDate).reversed())
                .limit(5)
                .collect(Collectors.toList());
        List<Donation> recentDonations = donationRepository.findTop5ByOrderByDonationDateDescCreatedAtDesc();

        int healthyGroups = (int) groupDistribution.values().stream()
                .filter(v -> v.compareTo(LOW_STOCK_THRESHOLD) >= 0)
                .count();
        int inventoryHealthPercent = BLOOD_GROUPS.isEmpty() ? 0
                : (int) Math.round((healthyGroups * 100.0) / BLOOD_GROUPS.size());

        stats.put("totalDonors", totalDonors);
        stats.put("totalHospitals", totalHospitals);
        stats.put("totalRequests", totalRequests);
        stats.put("totalDonations", totalDonations);
        stats.put("pendingRequests", pendingRequests);
        stats.put("totalAvailableUnits", totalAvailableUnits.setScale(2, RoundingMode.HALF_UP));
        stats.put("groupDistribution", groupDistribution);
        stats.put("lowStockGroups", lowStockGroups);
        stats.put("todayAppointmentsCount", todayAppointments.size());
        stats.put("todayAppointments", todayAppointments);
        stats.put("expiringUnitsCount", expiringBags);
        stats.put("expiredUnitsCount", expiredBags);
        stats.put("issuedUnitsCount", issuedBags);
        stats.put("inventoryHealthPercent", inventoryHealthPercent);
        stats.put("pendingRequestList", pendingRequestList);
        stats.put("recentDonations", recentDonations);

        return stats;
    }
}
