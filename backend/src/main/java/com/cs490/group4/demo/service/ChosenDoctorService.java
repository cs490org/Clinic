package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.ChosenDoctor;
import com.cs490.group4.demo.dao.ChosenDoctorRepository;
import com.cs490.group4.demo.dao.Doctor;
import com.cs490.group4.demo.dao.Patient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ChosenDoctorService {

    @Autowired
    private ChosenDoctorRepository chosenDoctorRepository;

    public List<Patient> getPatientsByDoctor(Integer doctorId) {
        List<Patient> res = new ArrayList<>();
        List<ChosenDoctor> patientsDoctors = chosenDoctorRepository.findAll();

        patientsDoctors.forEach(cd -> {
            if(cd.getDoctor().getId().equals(doctorId)){
                res.add(cd.getPatient());
            }
        });

        return res;
    }

    /**
     * creates a new entry if no previous patient has a doctor,
     * replaces existing entry if patient already had a doctor
     *
     * @param patientId
     * @param doctorId
     * @return the chosen doctor relationship
     */
    public ChosenDoctor assignPatientToDoctor(Integer patientId, Integer doctorId) {
        Optional<ChosenDoctor> existingDoctor = chosenDoctorRepository.findByPatientId(patientId);

        ChosenDoctor chosenDoctor;

        if (existingDoctor.isPresent()) {
            chosenDoctor = ChosenDoctor.builder()
                    .id(existingDoctor.get().getId())
                    .patient(Patient.builder().id(patientId).build())
                    .doctor(Doctor.builder().id(doctorId).build())
                    .updateTimestamp(LocalDateTime.now())
                    .build();

        } else {
            chosenDoctor = ChosenDoctor.builder()
                    .patient(Patient.builder().id(patientId).build())
                    .doctor(Doctor.builder().id(doctorId).build())
                    .createTimestamp(LocalDateTime.now())
                    .build();
        }

        return chosenDoctorRepository.save(chosenDoctor);
    }

    public void deletePatientDoctor(Integer patientId) {
        chosenDoctorRepository.deleteByPatientId(patientId);
    }

}
