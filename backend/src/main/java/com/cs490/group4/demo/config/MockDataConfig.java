package com.cs490.group4.demo.config;

import com.cs490.group4.demo.service.DoctorService;
import com.cs490.group4.demo.service.PatientService;
import com.cs490.group4.demo.service.PharmacyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MockDataConfig {
    @Autowired
    private MockDoctor mockDoctor;
    @Autowired
    private MockPatient mockPatient;
    @Autowired
    private MockPharmacy mockPharmacy;

    @Autowired
    private DoctorService doctorService;
    @Autowired
    private PatientService patientService;
    @Autowired
    private PharmacyService pharmacyService;

    @Bean
    CommandLineRunner mockDataInitializer() {
        return args -> {
            if (doctorService.isEmpty()) {
                mockDoctor.createMockDoctor(
                        "doctor@clinic.com",
                        "Mario",
                        "Mario",
                        "1234567890",
                        "Weight Loss",
                        1L);

            }
            if (patientService.isEmpty()) {
                mockPatient.createMockPatient(
                        "patient@clinic.com",
                        "Luigi",
                        "Mario",
                        "1234567890",
                        "somewhere");
            }
            if (pharmacyService.isEmpty()) {
                mockPharmacy.createMockPharmacy(
                        "pharmacy@clinic.com",
                        "200 Somewhere-ville",
                        "Lightning-Pharmacy",
                        "8675309999",
                        "07103"
                );
                mockPharmacy.createMockPharmacy(
                        "pharmacy1@clinic.com",
                        "201 Somewhere-ville",
                        "Kachow-Pharmacy",
                        "8675311234",
                        "07104"
                );
            }

        };
    }

}