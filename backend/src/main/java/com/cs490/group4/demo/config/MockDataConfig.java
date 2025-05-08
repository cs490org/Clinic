package com.cs490.group4.demo.config;

import com.cs490.group4.demo.dao.Recipe;
import com.cs490.group4.demo.dto.IngredientRequestDTO;
import com.cs490.group4.demo.service.*;
import com.cs490.group4.demo.service.authentication.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
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

    // loads mock data if the corresponding tables are initially empty.
    /*
        mock accounts
        all accounts have password123 as password

        doctor@clinic.com
        patient@clinic.com
        pharmacy@clinic.com
     */

    @Bean
    CommandLineRunner mockDataInitializer(RecipeCommentService recipeCommentService, DailySurveyService dailySurveyService, MockDailySurvey mockDailySurvey, WeeklySurveyService weeklySurveyService, MockWeeklySurvey mockWeeklySurvey, PrescriptionService prescriptionService, MockPrescription mockPrescription, DrugService drugService, MockDrug mockDrug, MockPatientPharmacy mockPatientPharmacy) {
        return args -> {
            if (doctorService.isEmpty()) {
                mockDoctor.createMockDoctor(
                        "samanthasalomon@clinic.com",
                        "Samantha",
                        "Salomon",
                        "9732014283",
                        "Dietitian",
                        "MD-230213",
                        "https://storage.googleapis.com/cs490-media/samantha%20salomon.png");
                mockDoctor.createMockDoctor(
                        "valentineobi@clinic.com",
                        "Valentine",
                        "Obi",
                        "9734319430",
                        "Cardiologist",
                        "MD-351571",
                        "https://storage.googleapis.com/cs490-media/valentine%20obi.png");
                mockDoctor.createMockDoctor(
                        "doctor1@clinic.com",
                        "Sidra",
                        "Sohail",
                        "9733103090",
                        "Endocrinologist",
                        "MD-145A33",
                        "https://storage.googleapis.com/cs490-media/sidra%20sohail.png");

            }
            if (patientService.isEmpty()) {
                mockPatient.createMockPatient(
                        "patient@clinic.com",
                        "Test",
                        "Patient",
                        "1234567890",
                        "somewhere",
                        "https://storage.googleapis.com/cs490-media/patient.webp");
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

            if (!patientService.isEmpty() && !pharmacyService.isEmpty()) {
                mockPatientPharmacy.createPatientPharmacy(1,1);
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
                mockIngredient.createMockIngredient(
                        "Bread slice",
                        "A slice of bread.",
                        250,
                        10,
                        40,
                        5
                );
                mockIngredient.createMockIngredient(
                        "Avocado",
                        "An entire avocado.",
                        200,
                        20,
                        20,
                        4
                );

                mockIngredient.createMockIngredient(
                        "Salmon fillet",
                        "Salmon fillet.",
                        350,
                        20,
                        0,
                        35
                );
                mockIngredient.createMockIngredient(
                        "Tbsp olive oil",
                        "A tablespoon of olive oil.",
                        100,
                        15,
                        0,
                       0
                );
                mockIngredient.createMockIngredient(
                        "Garlic clove",
                        "A garlic clove.",
                        4,
                        0,
                        1,
                       0
                );
                mockIngredient.createMockIngredient(
                        "tbsp lemon juice",
                        "A tablespoon of lemon juice.",
                        4,
                        0,
                        1,
                       0
                );
                mockIngredient.createMockIngredient(
                        "Sweet potato",
                        "A sweet potato.",
                        100,
                        0,
                        20,
                        2
                );
                mockIngredient.createMockIngredient(
                        "Green beans",
                        "Green beans",
                        20,
                        0,
                        5,
                        1
                );

            }

            if(!ingredientService.isEmpty() && recipeService.isEmpty() && !userService.getAllUsers().isEmpty()) {
                // TODO: find ingredient by name instead of ids.
                // ingredient names should probably be unique.
                // could also transitively calculate calories based off of fats,carbs,and protein but probably not important right now.
                ArrayList<IngredientRequestDTO> riceAndChickenIngredients = new ArrayList<>();
                IngredientRequestDTO twoPieceChicken= new IngredientRequestDTO();
                twoPieceChicken.setIngredientId(2);
                twoPieceChicken.setQuantity(2);
                riceAndChickenIngredients.add(twoPieceChicken);
                IngredientRequestDTO cupOfRice= new IngredientRequestDTO();
                cupOfRice.setIngredientId(3);
                cupOfRice.setQuantity(1);
                riceAndChickenIngredients.add(cupOfRice);

                ArrayList<IngredientRequestDTO> avocadoToastIngredients= new ArrayList<>();
                IngredientRequestDTO avocado = new IngredientRequestDTO();
                avocado.setIngredientId(6);
                avocado.setQuantity(1);
                avocadoToastIngredients.add(avocado);
                IngredientRequestDTO bread = new IngredientRequestDTO();
                bread.setIngredientId(5);
                bread.setQuantity(2);
                avocadoToastIngredients.add(bread);
                IngredientRequestDTO egg = new IngredientRequestDTO();
                egg.setIngredientId(1);
                egg.setQuantity(2);
                avocadoToastIngredients.add(egg);

                ArrayList<IngredientRequestDTO> lemonGarlicBakedSalmon = new ArrayList<>();
                IngredientRequestDTO salmonFillet = new IngredientRequestDTO();
                salmonFillet.setIngredientId(7);
                salmonFillet.setQuantity(1);
                lemonGarlicBakedSalmon.add(salmonFillet);
                IngredientRequestDTO oliveOil= new IngredientRequestDTO();
                oliveOil.setIngredientId(8);
                oliveOil.setQuantity(1);
                lemonGarlicBakedSalmon.add(oliveOil);
                IngredientRequestDTO garlicClove= new IngredientRequestDTO();
                garlicClove.setIngredientId(9);
                garlicClove.setQuantity(1);
                lemonGarlicBakedSalmon.add(garlicClove);
                IngredientRequestDTO lemonJuice= new IngredientRequestDTO();
                lemonJuice.setIngredientId(10);
                lemonJuice.setQuantity(1);
                lemonGarlicBakedSalmon.add(lemonJuice);
                IngredientRequestDTO sweetPotato= new IngredientRequestDTO();
                sweetPotato.setIngredientId(11);
                sweetPotato.setQuantity(1);
                lemonGarlicBakedSalmon.add(sweetPotato);
                IngredientRequestDTO greenBeans= new IngredientRequestDTO();
                greenBeans.setIngredientId(12);
                greenBeans.setQuantity(1);
                lemonGarlicBakedSalmon.add(greenBeans);

                recipes.add(mockRecipe.createMockRecipe(
                        "Rice and Chicken",
                        "",
                        "Cook 1 cup of rice, sear 2 chicken breasts in olive oil over medium heat for 5–6 minutes per side until cooked through. serve over the rice.",
                        riceAndChickenIngredients,
                        1,
                        "https://storage.googleapis.com/cs490-media/rice_and_chicken.jpg"
                ));
                recipes.add(mockRecipe.createMockRecipe(
                        "Avocado Egg Toast",
                        "",
                        "Toast a slice of bread, mash half an avocado on top, and season with salt. Fry or poach an egg, place it over the avocado, and finish with pepper or chili flakes.",
                        avocadoToastIngredients,
                        1,
                        "https://storage.googleapis.com/cs490-media/avocado_egg_toast.jpg"
                ));
                recipes.add(mockRecipe.createMockRecipe(
                        "Lemon Garlic Baked Salmon with Veggies",
                        "",
                        "Preheat oven to 400°F. Place salmon on a baking sheet, drizzle with olive oil, lemon juice, minced garlic, salt, and pepper. Bake for 15–20 minutes. Roast sweet potatoes and green beans for about 25 minutes. Serve together.",
                        lemonGarlicBakedSalmon,
                        1,
                        "https://storage.googleapis.com/cs490-media/lemon_garlic_baked_salmon.jpg"
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

            if(!patientService.isEmpty() && dailySurveyService.isEmpty()) {
                Random random = new Random();

                mockDailySurvey.createMockDailySurvey(1,random.nextInt(1800,2500),random.nextInt(6,11), LocalDate.now().minusDays(1));
                mockDailySurvey.createMockDailySurvey(1,random.nextInt(1800,2500),random.nextInt(6,11), LocalDate.now().minusDays(2));
                mockDailySurvey.createMockDailySurvey(1,random.nextInt(1800,2500),random.nextInt(6,11), LocalDate.now().minusDays(3));
                mockDailySurvey.createMockDailySurvey(1,random.nextInt(1800,2500),random.nextInt(6,11), LocalDate.now().minusDays(4));
                mockDailySurvey.createMockDailySurvey(1,random.nextInt(1800,2500),random.nextInt(6,11), LocalDate.now().minusDays(6));
                mockDailySurvey.createMockDailySurvey(1,random.nextInt(1800,2500),random.nextInt(6,11), LocalDate.now().minusDays(7));
                mockDailySurvey.createMockDailySurvey(1,random.nextInt(1800,2500),random.nextInt(6,11), LocalDate.now().minusDays(8));
                mockDailySurvey.createMockDailySurvey(1,random.nextInt(1800,2500),random.nextInt(6,11), LocalDate.now().minusDays(11));
                mockDailySurvey.createMockDailySurvey(1,random.nextInt(1800,2500),random.nextInt(6,11), LocalDate.now().minusDays(13));
                mockDailySurvey.createMockDailySurvey(1,random.nextInt(1800,2500),random.nextInt(6,11), LocalDate.now().minusDays(16));
                mockDailySurvey.createMockDailySurvey(1,random.nextInt(1800,2500),random.nextInt(6,11), LocalDate.now().minusDays(19));
                mockDailySurvey.createMockDailySurvey(1,random.nextInt(1800,2500),random.nextInt(6,11), LocalDate.now().minusDays(20));
                mockDailySurvey.createMockDailySurvey(1,random.nextInt(1800,2500),random.nextInt(6,11), LocalDate.now().minusDays(21));
                mockDailySurvey.createMockDailySurvey(1,random.nextInt(1800,2500),random.nextInt(6,11), LocalDate.now().minusDays(22));
            }
            if(!patientService.isEmpty() && weeklySurveyService.isEmpty()) {
                Random random = new Random();

                mockWeeklySurvey.createMockWeeklySurvey(1,random.nextFloat(140,150),LocalDate.now().minusDays(7));
                mockWeeklySurvey.createMockWeeklySurvey(1,random.nextFloat(140,150),LocalDate.now().minusDays(14));
                mockWeeklySurvey.createMockWeeklySurvey(1,random.nextFloat(140,150),LocalDate.now().minusDays(21));
            }


            if(drugService.isEmpty()){
                mockDrug.createMockDrug("Ibuprofen", "Pain reliever", "200mg", new BigDecimal("5.99"));
                mockDrug.createMockDrug("Lisinopril", "Blood pressure", "10mg", new BigDecimal("4.25"));
            }

            mockPharmacy.createDrugInventoryInPharmacy(1,1,5);
            mockPharmacy.createDrugInventoryInPharmacy(2,1,5);

            if(prescriptionService.isEmpty()) {
                mockPrescription.createMockPrescription(1,1,1, LocalDateTime.now().plusDays(7));
                mockPrescription.createMockPrescription(1,1,2, LocalDateTime.now().plusDays(7));
            }

        };
    }

}