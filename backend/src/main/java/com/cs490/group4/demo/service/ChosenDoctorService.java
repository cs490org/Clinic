package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.ChosenDoctor;
import com.cs490.group4.demo.dao.ChosenDoctorRepository;
import com.cs490.group4.demo.dao.Doctor;
import com.cs490.group4.demo.dao.Patient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ChosenDoctorService {

    @Autowired
    private ChosenDoctorRepository chosenDoctorRepository;

    /**
     * creates a new entry if no previous patient has a doctor,
     * replaces existing entry if patient already had a doctor
     *
     * @param patientId
     * @param doctorId
     * @return the chosen doctor relationship
     */
    public ChosenDoctor assignPatientToDoctor(Integer patientId, Integer doctorId){
        Optional<ChosenDoctor> existingDoctor = chosenDoctorRepository.findByPatientId(patientId);

        ChosenDoctor chosenDoctor = ChosenDoctor.builder()
                .id(existingDoctor.map(ChosenDoctor::getId).orElse(null))
                .patient(Patient.builder().id(patientId).build())
                .doctor(Doctor.builder().id(doctorId).build())
                .createTimestamp(LocalDateTime.now())
                .build();

        return chosenDoctorRepository.save(chosenDoctor);
    }

    public void deletePatientDoctor(Integer patientId) {
        chosenDoctorRepository.deleteByPatientId(patientId);
    }

}
