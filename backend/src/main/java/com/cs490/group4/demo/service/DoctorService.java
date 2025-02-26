package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.Doctor;
import com.cs490.group4.demo.dao.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/*
process and validate data before storing / retrieving
talks to databas through the Repository
*/
@Service
public class DoctorService {

    // inject DoctorRepo here
    @Autowired
    private DoctorRepository doctorRepository;

    // public List<Doctor> getAllDoctors(){
    //     return doctorRepository.findAll();
    // }

}
