package com.cs490.group4.demo.config;

import com.cs490.group4.demo.dao.Recipe;
import com.cs490.group4.demo.security.User;
import com.cs490.group4.demo.service.*;
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
    private final MockRecipeComment mockRecipeComment;

    private final DoctorService doctorService;
    private final PatientService patientService;
    private final PharmacyService pharmacyService;
    private final RecipeService recipeService;

    private final ArrayList<User> users = new ArrayList<>();
    private final ArrayList<Recipe> recipes = new ArrayList<>();

    @Bean
    CommandLineRunner mockDataInitializer(RecipeCommentService recipeCommentService) {
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
                recipes.add(mockRecipe.createMockRecipe(
                        "Honey Garlic Chicken",
                        "Delicious honey garlic chicken with lower calories",
                        users.get(0)
                ));
                recipes.add(mockRecipe.createMockRecipe(
                        "A Singular Apple",
                        "An apple a day keeps the doctor away.",
                        users.get(1)
                ));
            }

            if(!doctorService.isEmpty() && !recipeService.isEmpty()) {
                mockRecipeComment.createMockRecipeComment(
                        2,
                        1,
                        "I made this and it sucks"
                );
            }
        };
    }

}