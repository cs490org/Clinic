package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dao.PrescriptionBill;
import com.cs490.group4.demo.dao.PrescriptionBillRepository;
import com.cs490.group4.demo.dto.InventoryDTO;
import com.cs490.group4.demo.dto.PharmacyCreateDTO;
import com.cs490.group4.demo.dto.PrescriptionBillDTO;
import com.cs490.group4.demo.service.PharmacyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pharmacies")
@RequiredArgsConstructor
public class PharmacyController {

    private final PharmacyService pharmacyService;

    @GetMapping()
    private ResponseEntity<?> getPharmacies(@RequestParam(required = false) Integer userId) {
        if (userId != null) {
            return ResponseEntity.ok(pharmacyService.getPharmacyByUserId(userId));
        } else {
            return ResponseEntity.ok(pharmacyService.getPharmacies());
        }
    }

    @PostMapping
    private ResponseEntity<?> createPharmacy(@RequestBody PharmacyCreateDTO pharmacyCreateDTO) {
        return ResponseEntity.ok(pharmacyService.createPharmacy(pharmacyCreateDTO));
    }

    @GetMapping("/drugs")
    private ResponseEntity<?> getDrugs(@RequestParam Integer pharmacyId) {
        return ResponseEntity.ok(pharmacyService.getDrugsByPharmacy(pharmacyId));
    }

    @PatchMapping("/drugs/inventory")
    private ResponseEntity<?> updateInventory(@RequestBody InventoryDTO dto) {
        pharmacyService.updateDrugInventory(dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/bill")
    private ResponseEntity<PrescriptionBill> createBill(@RequestBody PrescriptionBillDTO dto){
        return ResponseEntity.ok(pharmacyService.createPrescriptionBill(dto));
    }

    @GetMapping("/bills")
    private ResponseEntity<List<PrescriptionBill>> getBillsForPatient(@RequestParam Integer patientId){
        return ResponseEntity.ok(pharmacyService.getBillsByPatientId(patientId));
    }

    @PatchMapping("/bill")
    private ResponseEntity<PrescriptionBill> payBill(@RequestParam Integer billId) {
        return ResponseEntity.ok(pharmacyService.payBill(billId));
    }

}
