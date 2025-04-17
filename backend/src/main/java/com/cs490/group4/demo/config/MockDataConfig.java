package com.cs490.group4.demo.config;

import com.cs490.group4.demo.dao.Recipe;
import com.cs490.group4.demo.dto.IngredientRequestDTO;
import com.cs490.group4.demo.service.*;
import com.cs490.group4.demo.service.authentication.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


import java.util.ArrayList;
import java.util.Random;
@Configuration
@RequiredArgsConstructor
public class MockDataConfig {
    private final MockDoctor mockDoctor;
    private final MockPatient mockPatient;
    private final MockPharmacy mockPharmacy;
    private final MockRecipe mockRecipe;
    private final MockRecipeComment mockRecipeComment;
    private final MockIngredient mockIngredient;

    private final UserService userService;
    private final DoctorService doctorService;
    private final PatientService patientService;
    private final PharmacyService pharmacyService;
    private final RecipeService recipeService;
    private final IngredientService ingredientService;

    private final ArrayList<Recipe> recipes = new ArrayList<>();

    @Bean
    CommandLineRunner mockDataInitializer(RecipeCommentService recipeCommentService ) {
        return args -> {
            if (doctorService.isEmpty()) {
                mockDoctor.createMockDoctor(
                        "dumpling@clinic.com",
                        "Dump",
                        "Ling",
                        "1111111111",
                        "Weight Gain",
                        2L);
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

            if(ingredientService.isEmpty()){
                mockIngredient.createMockIngredient(
                        "Egg",
                        "A singular egg.",
                        60,
                        6,
                        0,
                        6
                );
                mockIngredient.createMockIngredient(
                        "Chicken Breast",
                        "Lean protein source.",
                        165,
                        3,
                        0,
                        31
                );

                mockIngredient.createMockIngredient(
                        "Rice",
                        "Cup of white rice.",
                        200,
                        1,
                        45,
                        3
                );

                mockIngredient.createMockIngredient(
                        "Broccoli",
                        "Steamed broccoli florets.",
                        55,
                        0,
                        11,
                        4
                );
            }

            if(recipeService.isEmpty() && !userService.getAllUsers().isEmpty()) {
                ArrayList<IngredientRequestDTO> ingredientRequestDTOS = new ArrayList<>();
                IngredientRequestDTO twoPieceChicken= new IngredientRequestDTO();
                twoPieceChicken.setIngredientId(2);
                twoPieceChicken.setQuantity(2);
                ingredientRequestDTOS.add(twoPieceChicken);

                IngredientRequestDTO cupOfRice= new IngredientRequestDTO();
                cupOfRice.setIngredientId(3);
                cupOfRice.setQuantity(1);
                ingredientRequestDTOS.add(cupOfRice);


                recipes.add(mockRecipe.createMockRecipe(
                        "Rice and Chicken",
                        "Rice and chicken",
                        "Cook rice in a pot, add chicken.",
                        ingredientRequestDTOS,
                        1
                ));
            }

            if(!userService.getAllUsers().isEmpty() && !recipeService.isEmpty()) {
                String[] comments = {
                        "This is amazing!",
                        "Good recipe",
                        "This is my favorite recipe it has changed my life"
                };
                for (Recipe recipe : recipes) {
                    Random random = new Random();
                    int commentIndex =  random.nextInt(comments.length);

                    mockRecipeComment.createMockRecipeComment(
                            recipe.getId(),
                            1,
                            comments[commentIndex]
                    );
                }
            }



        };
    }

}