package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.Patient;
import com.cs490.group4.demo.dao.PatientAppointmentData;
import com.cs490.group4.demo.dao.PatientAppointmentDataRepository;
import com.cs490.group4.demo.dao.PatientRepository;
import com.cs490.group4.demo.dto.PatientAppointmentDataCreateDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PatientAppointmentDataService {

    private final PatientAppointmentDataRepository patientAppointmentDataRepository;
    private final PatientRepository patientRepository;

    public List<PatientAppointmentData> getPatientAppointmentData(Integer patientId) {
        return patientAppointmentDataRepository.findByPatient_Id(patientId);
    }
    public Optional<PatientAppointmentData> getByPatientAndAppointment(Integer patientId, Integer appointmentId) {
//        return patientAppointmentDataRepository.findByPatientIdAndAppointmentId(patientId, appointmentId);
        return patientAppointmentDataRepository.findByPatient_IdAndAppointmentId(patientId, appointmentId);
    }

    public PatientAppointmentData addPatientAppointmentData(PatientAppointmentDataCreateDTO dto) {
        Patient patient = patientRepository.findById(dto.getPatientId()).orElseThrow(()-> new EntityNotFoundException("Could not find patient"));
        PatientAppointmentData patientAppointmentData = new PatientAppointmentData();

        patientAppointmentData.setAppointmentId(dto.getAppointmentId());
        patientAppointmentData.setPatient(patient);
        patientAppointmentData.setDate(dto.getDate());
//        patientAppointmentData.setWeight(dto.getWeight());
        patientAppointmentData.setBloodPressure(dto.getBloodPressure());
        patientAppointmentData.setWaterIntake(dto.getWaterIntake());
        patientAppointmentData.setHeight(dto.getHeight());

        return patientAppointmentDataRepository.save(patientAppointmentData);
    }
}
