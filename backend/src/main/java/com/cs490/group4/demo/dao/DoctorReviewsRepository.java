package com.cs490.group4.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DoctorReviewsRepository extends JpaRepository<DoctorReviews, Integer> {

    @Query("from DoctorReviews where doctor.id = :doctorId")
    List<DoctorReviews> findByDoctorId(Integer doctorId);

}