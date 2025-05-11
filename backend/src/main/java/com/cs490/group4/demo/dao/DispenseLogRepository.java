package com.cs490.group4.demo.dao;

import com.cs490.group4.demo.dao.DispenseLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DispenseLogRepository extends JpaRepository<DispenseLog, Integer> {
    List<DispenseLog> findByPharmacyIdAndDrugId(Integer pharmacyId, Integer drugId);
}