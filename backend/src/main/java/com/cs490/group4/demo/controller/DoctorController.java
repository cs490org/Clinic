package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.service.DoctorService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping()
    private ResponseEntity<?> getDoctors(@RequestParam(required = false) Integer userId) {
        if (userId != null) {
            return ResponseEntity.ok(doctorService.getDoctorByUserId(userId));
        } else {
            return ResponseEntity.ok(doctorService.getAllDoctors());
        }
    }

    @PostMapping()
    private ResponseEntity<?> createDoctor(@RequestBody DoctorCreateRequest request) {
        try {
            return ResponseEntity.ok(doctorService.createDoctor(
                    request.getUserId(),
                    request.getPhone(),
                    request.getSpecialty(),
                    request.getLicenseNumber()
            ));
        } catch (DataIntegrityViolationException ex) {
            String msg = ex.getMessage();
            if(msg.contains("Duplicate entry")){
                return ResponseEntity.badRequest().body("A doctor with this license already exists.");
            }
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PatchMapping("/{id}/accepting-status")
    private ResponseEntity<?> updateAcceptingStatus(
            @PathVariable Integer id,
            @RequestBody UpdateAcceptingStatusRequest request
    ) {
        doctorService.updateAcceptingStatus(id, request.getAcceptingNewPatients());
        return ResponseEntity.ok().build();
    }
}

@Data
class DoctorCreateRequest {
    private Integer userId;
    private String phone;
    private String specialty;
    private Long licenseNumber;
}

@Data
class UpdateAcceptingStatusRequest {
    private Boolean acceptingNewPatients;
}