package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.Doctor;
import com.cs490.group4.demo.dao.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public boolean isEmpty() {
        return doctorRepository.count() == 0;
    }

}
