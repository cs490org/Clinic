package com.cs490.group4.demo.config;

import com.cs490.group4.demo.security.User;
import com.cs490.group4.demo.service.DoctorService;
import com.cs490.group4.demo.service.PatientService;
import com.cs490.group4.demo.service.PharmacyService;
import com.cs490.group4.demo.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;

@Configuration
@RequiredArgsConstructor
public class MockDataConfig {
    private final MockDoctor mockDoctor;
    private final MockPatient mockPatient;
    private final MockPharmacy mockPharmacy;
    private final MockRecipe mockRecipe;

    private final DoctorService doctorService;
    private final PatientService patientService;
    private final PharmacyService pharmacyService;
    private final RecipeService recipeService;

    private final ArrayList<User> users = new ArrayList<>();

    @Bean
    CommandLineRunner mockDataInitializer() {
        return args -> {
            if (doctorService.isEmpty()) {
                users.add(mockDoctor.createMockDoctor(
                        "dumpling@clinic.com",
                        "Dump",
                        "Ling",
                        "1111111111",
                        "Weight Gain",
                        2L));
                users.add(mockDoctor.createMockDoctor(
                        "doctor@clinic.com",
                        "Mario",
                        "Mario",
                        "1234567890",
                        "Weight Loss",
                        1L));

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

            if(recipeService.isEmpty() && !doctorService.isEmpty()) {
                // for some reason there is key error when having multiple recipes with the same user id...
                mockRecipe.createMockRecipe(
                        "Honey Garlic Chicken",
                        "Delicious honey garlic chicken with lower calories",
                        users.get(0)
                );
                mockRecipe.createMockRecipe(
                        "Apple",
                        "An apple a day keeps the doctor away.",
                        users.get(1)
                );
            }
        };
    }

}