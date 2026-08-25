package com.bloodsystem.service;

import com.bloodsystem.model.Appointment;
import com.bloodsystem.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;


    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }


    public Appointment getAppointmentById(Integer id) {

        return appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Appointment not found with ID: " + id)
                );
    }


    public Appointment createAppointment(Appointment appointment) {
        // Hubinta Service-ka si nambar saafi ah uusan marnaba u gudbin
        if (appointment.getRemarks() != null && appointment.getRemarks().matches("^\\d+$")) {
            throw new IllegalArgumentException("Remarks cannot be only numbers. Please enter text.");
        }

        return appointmentRepository.save(appointment);
    }


    public Appointment updateAppointment(Integer id, Appointment details) {
        // Hubinta Service-ka intaan la keydin
        if (details.getRemarks() != null && details.getRemarks().matches("^\\d+$")) {
            throw new IllegalArgumentException("Remarks cannot be only numbers. Please enter text.");
        }

        Appointment app = getAppointmentById(id);

        app.setAppointmentDate(details.getAppointmentDate());
        app.setAppointmentTime(details.getAppointmentTime());
        app.setStatus(details.getStatus());
        app.setRemarks(details.getRemarks());

        return appointmentRepository.save(app);
    }


    public void deleteAppointment(Integer id) {

        Appointment app = getAppointmentById(id);

        appointmentRepository.delete(app);
    }


    public List<Appointment> getAppointmentsForDate(LocalDate date) {

        return appointmentRepository.findByAppointmentDate(date);
    }
}