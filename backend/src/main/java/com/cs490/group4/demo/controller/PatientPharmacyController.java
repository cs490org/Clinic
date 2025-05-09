package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dao.PatientPharmacy;
import com.cs490.group4.demo.dao.Pharmacy;
import com.cs490.group4.demo.service.PatientPharmacyService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class PatientPharmacyController {
   private final PatientPharmacyService patientPharmacyService;

   public PatientPharmacyController(PatientPharmacyService patientPharmacyService) {
      this.patientPharmacyService = patientPharmacyService;
   }


   @GetMapping("/patient/pharmacy")
   public ResponseEntity<Pharmacy> getPreferredPharmacy(@RequestParam Integer patientId) {
         return ResponseEntity.ok(patientPharmacyService.getByPatientId(patientId));
   }

}

