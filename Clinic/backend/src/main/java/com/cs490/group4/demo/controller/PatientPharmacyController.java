package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.dao.PatientPharmacy;
import com.cs490.group4.demo.dao.Pharmacy;
import com.cs490.group4.demo.dto.authentication.UserResponseDTO;
import com.cs490.group4.demo.service.PatientPharmacyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
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
   public ResponseEntity<List<UserResponseDTO>> getPatientsByPharmacyId(@RequestParam Integer pharmacyId) {
       List<PatientPharmacy> links = patientPharmacyService.patientsByPharmacyId(pharmacyId);
   
       List<UserResponseDTO> response = links.stream().map(link -> {
           com.cs490.group4.demo.security.User user = link.getPatient().getUser();
           return new UserResponseDTO(
                   user.getUserId(),
                   user.getFirstName(),
                   user.getLastName(),
                   user.getEmail(),
                   user.getImgUri(),
                   user.getRole()
           );
       }).toList();
   
       return ResponseEntity.ok(response);
   }
   

   @PutMapping("/patient/{patientId}/pharmacy/{pharmacyId}")
   public ResponseEntity<PatientPharmacy> updatePreferredPharmacy(@PathVariable Integer patientId, @PathVariable Integer pharmacyId) {
      return ResponseEntity.ok(patientPharmacyService.setPreferredPharmacy(patientId, pharmacyId));
   }
}
