package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import com.cs490.group4.demo.dto.DoctorReviewDTO;
import com.cs490.group4.demo.dto.TopDoctorsResponseDTO;
import com.cs490.group4.demo.security.User;
import com.cs490.group4.demo.security.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.print.Doc;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorReviewsRepository doctorReviewsRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor getDoctorByUserId(Integer userId) {
        Doctor doctor = doctorRepository.findByUserId(userId);
        if (doctor == null) {
            throw new EntityNotFoundException("Doctor not found");
        }
        return doctor;
    }

    public List<TopDoctorsResponseDTO> getTopDoctors(){
        List<DoctorReviews> res = doctorReviewsRepository.findTopDoctors();

        List<TopDoctorsResponseDTO> doctors = new ArrayList<>();
        Set<Integer> seenDoctorIds = new HashSet<>();
        
        res.forEach(review -> {
            Integer doctorId = review.getDoctor().getId();
            if (!seenDoctorIds.contains(doctorId)) {
                seenDoctorIds.add(doctorId);
                doctors.add(TopDoctorsResponseDTO.builder()
                        .doctor(review.getDoctor())
                        .build());
            }
        });

        doctors.forEach(doctor -> {
            doctor.setRating(getAverageRating(doctor.getDoctor().getId()));
        });

        return doctors;
    }

    public Doctor createDoctor(Integer userId, String phone, String specialty, String licenseNumber) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setPhone(phone);
        doctor.setFirstName(user.getFirstName());
        doctor.setLastName(user.getLastName());
        doctor.setEmail(user.getEmail());
        doctor.setSpecialty(specialty);
        doctor.setLicenseNumber(licenseNumber);

        return doctorRepository.save(doctor);
    }

    public void updateAcceptingStatus(Integer doctorId, Boolean acceptingNewPatients) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with ID: " + doctorId));
        doctor.setAcceptingNewPatients(acceptingNewPatients);
        doctorRepository.save(doctor);
    }

    public DoctorReviews submitReview(DoctorReviewDTO dto) {
        DoctorReviews doctorReviews = new DoctorReviews();
        doctorReviews.setDoctor(Doctor.builder().id(dto.getDoctorId()).build());
        doctorReviews.setPatient(Patient.builder().id(dto.getPatientId()).build());
        doctorReviews.setRating(dto.getRating());
        doctorReviews.setTitle(dto.getTitle());
        doctorReviews.setReview(dto.getReview());
        doctorReviews.setCreateTimestamp(LocalDateTime.now());
        doctorReviews.setUpdateTimestamp(LocalDateTime.now());

        return doctorReviewsRepository.save(doctorReviews);
    }

    public boolean isEmpty() {
        return doctorRepository.count() == 0;
    }

    public Double getAverageRating(Integer doctorId) {
        return doctorReviewsRepository.findByDoctorId(doctorId)
                .stream()
                .mapToInt(DoctorReviews::getRating)
                .average()
                .orElse(0.0);
    }

    public List<DoctorReviews> getDoctorReviews(Integer doctorId) {
        return doctorReviewsRepository.findByDoctorId(doctorId);
    }

    public List<DoctorReviews> getAllDoctorReviews() {
        return doctorReviewsRepository.findAll();
    }

    public boolean reviewsExist(){
        return doctorReviewsRepository.count() > 0;
    }

}
