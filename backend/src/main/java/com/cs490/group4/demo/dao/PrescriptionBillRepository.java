package com.cs490.group4.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PrescriptionBillRepository extends JpaRepository<PrescriptionBill, Integer> {

}
