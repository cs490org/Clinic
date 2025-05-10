package com.cs490.group4.demo.config;

import com.cs490.group4.demo.dao.Doctor;
import com.cs490.group4.demo.dao.DoctorRepository;
import com.cs490.group4.demo.dao.DoctorReviews;
import com.cs490.group4.demo.dto.DoctorReviewDTO;
import com.cs490.group4.demo.security.Role;
import com.cs490.group4.demo.security.User;
import com.cs490.group4.demo.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MockDoctorReview {

    @Autowired
    private MockUser mockUser;
    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private DoctorService doctorService;

    public DoctorReviews createMockDoctorReview(Integer doctorId, Integer patientId, Integer rating, String title, String review) {
        DoctorReviewDTO dto = new DoctorReviewDTO();
        dto.setDoctorId(doctorId);
        dto.setPatientId(patientId);
        dto.setRating(rating);
        dto.setTitle(title);
        dto.setReview(review);

        return doctorService.submitReview(dto);
    }
}
