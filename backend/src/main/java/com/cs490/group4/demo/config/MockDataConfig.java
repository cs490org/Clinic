package com.cs490.group4.demo.config;

import com.cs490.group4.demo.dao.Recipe;
import com.cs490.group4.demo.dao.SymptomType;
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
    private final MockDailySurvey mockDailySurvey;
    private final MockWeeklySurvey mockWeeklySurvey;
    private final MockSymptom mockSymptom;
    private final MockPrescription mockPrescription;
    private final MockMealPlan mockMealPlan;
    private final MockDrug mockDrug;
    private final MockPatientPharmacy mockPatientPharmacy;
    private final MockCreditCard mockCreditCard;

    private final UserService userService;
    private final DoctorService doctorService;
    private final PatientService patientService;
    private final PharmacyService pharmacyService;
    private final RecipeService recipeService;
    private final IngredientService ingredientService;
    private final DailySurveyService dailySurveyService;
    private final WeeklySurveyService weeklySurveyService;
    private final SymptomService symptomService;
    private final PrescriptionService prescriptionService;
    private final DrugService drugService;
    private final CreditCardService creditCardService;

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
    CommandLineRunner mockDataInitializer(MockDoctorReview mockDoctorReview) {
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
                mockPatient.createMockPatient("olivia.smith@clinic.com", "Olivia", "Smith", "9735551001", "123 Maple Street", "https://storage.googleapis.com/cs490-media/patient1.webp");
                mockPatient.createMockPatient("liam.johnson@clinic.com", "Liam", "Johnson", "9735551002", "456 Oak Avenue", "https://storage.googleapis.com/cs490-media/patient2.webp");
                mockPatient.createMockPatient("emma.williams@clinic.com", "Emma", "Williams", "9735551003", "789 Pine Lane", "https://storage.googleapis.com/cs490-media/patient3.webp");
                mockPatient.createMockPatient("noah.brown@clinic.com", "Noah", "Brown", "9735551004", "321 Cedar Blvd", "https://storage.googleapis.com/cs490-media/patient4.webp");
                mockPatient.createMockPatient("ava.jones@clinic.com", "Ava", "Jones", "9735551005", "654 Birch Road", "https://storage.googleapis.com/cs490-media/patient5.webp");
                mockPatient.createMockPatient("william.miller@clinic.com", "William", "Miller", "9735551006", "987 Walnut Drive", "https://storage.googleapis.com/cs490-media/patient6.webp");
                mockPatient.createMockPatient("sophia.davis@clinic.com", "Sophia", "Davis", "9735551007", "159 Elm Street", "https://storage.googleapis.com/cs490-media/patient7.webp");
                mockPatient.createMockPatient("james.garcia@clinic.com", "James", "Garcia", "9735551008", "753 Chestnut Ave", "https://storage.googleapis.com/cs490-media/patient8.webp");
                mockPatient.createMockPatient("isabella.martinez@clinic.com", "Isabella", "Martinez", "9735551009", "852 Poplar Court", "https://storage.googleapis.com/cs490-media/patient9.webp");
                mockPatient.createMockPatient("benjamin.rodriguez@clinic.com", "Benjamin", "Rodriguez", "9735551010", "951 Hickory Way", "https://storage.googleapis.com/cs490-media/patient10.webp");
                mockPatient.createMockPatient(
                        "patient@clinic.com",
                        "Michael",
                        "Smith",
                        "8561992475",
                        "123 Main Street, Newark, NJ, 07103",
                        "https://storage.googleapis.com/cs490-media/patient.webp");
                mockPatient.createMockPatient(
                        "patient2@clinic.com",
                        "Andrew",
                        "Williams",
                        "9185834196",
                        "518 Somewhere, New Jersey, NJ, 83134",
                        "https://storage.googleapis.com/cs490-media/patient2.webp");
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
                mockPharmacy.createMockPharmacy(
                        "pharmacy2@clinic.com",
                        "123 Main street",
                        "Snail-Pharmacy",
                        "1926135093",
                        "10002"
                );
            }

            if(!doctorService.isEmpty() && !doctorService.reviewsExist()){
                mockDoctorReview.createMockDoctorReview(1,1,5,"Would recommend","10/10 would recommend");
                mockDoctorReview.createMockDoctorReview(2,2,5,"Helped achieved my weightloss goals","Through Obi's help, I was able to achieve my weightloss goals");
                mockDoctorReview.createMockDoctorReview(2, 2, 5, "Excellent guidance and support", "Provided clear steps and consistent support that made my weight loss journey successful.");
                mockDoctorReview.createMockDoctorReview(2, 2, 4, "Great motivator!", "Thanks to Dr. Obi’s motivation and dietary advice, I saw real progress in just a few months.");
                mockDoctorReview.createMockDoctorReview(2, 1, 5, "Transformed my lifestyle", "Helped me build sustainable habits that completely transformed how I approach fitness and nutrition.");
            }

            if (!patientService.isEmpty() && !pharmacyService.isEmpty()) {
                mockPatientPharmacy.createPatientPharmacy(1,1);
            }

            if (!patientService.isEmpty() && creditCardService.isEmpty()) {
                mockCreditCard.createMockCreditCard(1,"Test patient","1234123412341234","03/27","123 somewhere, Newark, NJ, 07103");
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
                        "A simple and hearty dish featuring tender seared chicken served over fluffy white rice.",
                        "Cook 1 cup of rice, sear 2 chicken breasts in olive oil over medium heat for 5–6 minutes per side until cooked through. serve over the rice.",
                        riceAndChickenIngredients,
                        1,
                        "https://storage.googleapis.com/cs490-media/rice_and_chicken.jpg"
                ));
                recipes.add(mockRecipe.createMockRecipe(
                        "Avocado Egg Toast",
                        "A nutritious breakfast toast topped with creamy avocado and a perfectly cooked egg.",
                        "Toast a slice of bread, mash half an avocado on top, and season with salt. Fry or poach an egg, place it over the avocado, and finish with pepper or chili flakes.",
                        avocadoToastIngredients,
                        1,
                        "https://storage.googleapis.com/cs490-media/avocado_egg_toast.jpg"
                ));
                recipes.add(mockRecipe.createMockRecipe(
                        "Lemon Garlic Baked Salmon with Veggies",
                        "A flavorful salmon bake with roasted sweet potatoes and green beans, infused with lemon and garlic.",
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


            if(!recipeService.isEmpty() && recipeService.count() >= 3 && !userService.getAllUsers().isEmpty()) {
                mockMealPlan.createMockMealPlan("Example plan",1,1,2,3);
                mockMealPlan.createMockMealPlan("Just rice and chicken",1,1,1,1);
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


            if (drugService.isEmpty()) {
                mockDrug.createMockDrug(
                    "Ibuprofen",
                    "Pain reliever",
                    "200mg",
                    new BigDecimal("5.99"),
                    "https://storage.googleapis.com/cs490-media/Ibuprofen1.png"
                );
            
                mockDrug.createMockDrug(
                    "Lisinopril",
                    "Blood pressure control",
                    "10mg",
                    new BigDecimal("4.25"),
                    "https://storage.googleapis.com/cs490-media/Resized_Pill_2.png"
                );
                mockDrug.createMockDrug(
                "Metformin",
                "Blood sugar control",
                "500mg",
                new BigDecimal("6.49"),
                "https://storage.googleapis.com/cs490-media/Resized_Pill_3.png"
                );

                mockDrug.createMockDrug(
                "Amoxicillin",
                "Antibiotic for bacterial infections",
                "250mg",
                new BigDecimal("7.99"),
                "https://storage.googleapis.com/cs490-media/Resized_Pill_4.png"
                );

                mockDrug.createMockDrug(
                "Atorvastatin",
                "Cholesterol-lowering",
                "20mg",
                new BigDecimal("9.99"),
                "https://storage.googleapis.com/cs490-media/Resized_Yellow_In_Amber_Bottle.png"
                );

            }
            
                mockPharmacy.createDrugInventoryInPharmacy(1,1,5, false);
                mockPharmacy.createDrugInventoryInPharmacy(2,1,5, false);
            // Pharmacy 1 
                mockPharmacy.createDrugInventoryInPharmacy(1, 3, 10, false); // Metformin
                mockPharmacy.createDrugInventoryInPharmacy(1, 4, 7, true);  // Amoxicillin
                mockPharmacy.createDrugInventoryInPharmacy(1, 5, 5, false);  // Atorvastatin
                mockPharmacy.createDrugInventoryInPharmacy(1, 2, 10, false);

                // Pharmacy 2
                mockPharmacy.createDrugInventoryInPharmacy(2, 3, 8, false);
                mockPharmacy.createDrugInventoryInPharmacy(2, 4, 4, false);
                mockPharmacy.createDrugInventoryInPharmacy(2, 5, 6, true);
                mockPharmacy.createDrugInventoryInPharmacy(1, 2, 10, false);



            if(prescriptionService.isEmpty()) {
                mockPrescription.createMockPrescription(1,1,1, LocalDateTime.now().plusDays(7));
                mockPrescription.createMockPrescription(1,1,2, LocalDateTime.now().plusDays(7));
            }

            if (symptomService.isEmpty()) {
                // PHYSICAL
                mockSymptom.createSymptom("Fatigue", SymptomType.PHYSICAL);
                mockSymptom.createSymptom("Muscle ache", SymptomType.PHYSICAL);
                mockSymptom.createSymptom("Joint pain", SymptomType.PHYSICAL);
                mockSymptom.createSymptom("Dizziness", SymptomType.PHYSICAL);
                mockSymptom.createSymptom("Sweating", SymptomType.PHYSICAL);
                mockSymptom.createSymptom("Weight loss", SymptomType.PHYSICAL);

                // MENTAL
                mockSymptom.createSymptom("Anxiety", SymptomType.MENTAL);
                mockSymptom.createSymptom("Depression", SymptomType.MENTAL);
                mockSymptom.createSymptom("Irritability", SymptomType.MENTAL);
                mockSymptom.createSymptom("Mood swings", SymptomType.MENTAL);
                mockSymptom.createSymptom("Insomnia", SymptomType.MENTAL);

                // NEUROLOGICAL
                mockSymptom.createSymptom("Headache", SymptomType.NEUROLOGICAL);
                mockSymptom.createSymptom("Numbness", SymptomType.NEUROLOGICAL);
                mockSymptom.createSymptom("Tingling", SymptomType.NEUROLOGICAL);
                mockSymptom.createSymptom("Seizures", SymptomType.NEUROLOGICAL);
                mockSymptom.createSymptom("Memory loss", SymptomType.NEUROLOGICAL);

                // GASTROINTESTINAL
                mockSymptom.createSymptom("Nausea", SymptomType.GASTROINTESTINAL);
                mockSymptom.createSymptom("Vomiting", SymptomType.GASTROINTESTINAL);
                mockSymptom.createSymptom("Diarrhea", SymptomType.GASTROINTESTINAL);
                mockSymptom.createSymptom("Constipation", SymptomType.GASTROINTESTINAL);
                mockSymptom.createSymptom("Abdominal pain", SymptomType.GASTROINTESTINAL);

                // RESPIRATORY
                mockSymptom.createSymptom("Cough", SymptomType.RESPIRATORY);
                mockSymptom.createSymptom("Shortness of breath", SymptomType.RESPIRATORY);
                mockSymptom.createSymptom("Wheezing", SymptomType.RESPIRATORY);
                mockSymptom.createSymptom("Chest tightness", SymptomType.RESPIRATORY);
                mockSymptom.createSymptom("Runny nose", SymptomType.RESPIRATORY);

                // OTHER
                mockSymptom.createSymptom("Fever", SymptomType.OTHER);
                mockSymptom.createSymptom("Chills", SymptomType.OTHER);
                mockSymptom.createSymptom("Swelling", SymptomType.OTHER);
                mockSymptom.createSymptom("Rash", SymptomType.OTHER);
                mockSymptom.createSymptom("Blurred vision", SymptomType.OTHER);
            }

        };
    }

}