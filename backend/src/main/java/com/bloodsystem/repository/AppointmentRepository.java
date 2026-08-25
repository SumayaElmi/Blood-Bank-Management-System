package com.bloodsystem.repository;

import com.bloodsystem.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

    List<Appointment> findByAppointmentDate(LocalDate appointmentDate);

    boolean existsByDonor_IdAndStatus(Integer donorId, String status);

}