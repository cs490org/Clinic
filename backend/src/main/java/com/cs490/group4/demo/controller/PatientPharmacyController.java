package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dao.PatientPharmacy;
import com.cs490.group4.demo.dao.Pharmacy;
import com.cs490.group4.demo.dao.Patient;
import com.cs490.group4.demo.service.PatientPharmacyService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Controller
public class PatientPharmacyController {
   private final PatientPharmacyService patientPharmacyService;

   public PatientPharmacyController(PatientPharmacyService patientPharmacyService) {
      this.patientPharmacyService = patientPharmacyService;
   }


   @GetMapping("/patient/{patientId}/pharmacy")
   public ResponseEntity<Pharmacy> getPreferredPharmacy(@PathVariable Integer patientId) {
         return ResponseEntity.ok(patientPharmacyService.getByPatientId(patientId));
   }

   @GetMapping("/patient/pharmacy")
      public ResponseEntity<PatientPharmacy> getPatientsByPharmacyId(@RequestParam Integer pharmacyId) {
            return ResponseEntity.ok(patientPharmacyService.patientsByPharmacyId(pharmacyId));
      }

   @PutMapping("/patient/{patientId}/pharmacy/{pharmacyId}")
   public ResponseEntity<PatientPharmacy> updatePreferredPharmacy(@PathVariable Integer patientId, @PathVariable Integer pharmacyId) {
      return ResponseEntity.ok(patientPharmacyService.setPreferredPharmacy(patientId,pharmacyId));
   }


}

