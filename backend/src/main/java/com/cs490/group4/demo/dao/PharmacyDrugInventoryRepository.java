package com.cs490.group4.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PharmacyDrugInventoryRepository extends JpaRepository<PharmacyDrugInventory, Integer> {

    @Query("from PharmacyDrugInventory a where a.pharmacy.pharmacy_id = :pharmacyId")
    List<PharmacyDrugInventory> findAllByPharmacyId(Integer pharmacyId);

    @Query("from PharmacyDrugInventory a where a.pharmacy.pharmacy_id = :pharmacyId and a.drug.drug_id = :drugId")
    PharmacyDrugInventory findByDrugIdAndPharmacyId(Integer pharmacyId, Integer drugId);

}
