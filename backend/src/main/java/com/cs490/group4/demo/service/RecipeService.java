package com.cs490.group4.demo.service;
import com.cs490.group4.demo.dao.*;
import com.cs490.group4.demo.dto.IngredientRequestDTO;
import com.cs490.group4.demo.security.User;
import com.cs490.group4.demo.security.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.cglib.core.Local;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final RecipeOwnerRepository recipeOwnerRepository;
    private final IngredientRepository ingredientRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;

    private final CloudStorageService cloudStorageService;

    public List<RecipeResponseDTO> getRecipes(){
        return recipeOwnerRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // recipes associated with users.
    // uses multipart
    @Transactional
    public Recipe createRecipe(Integer userId, String name, String description, List<IngredientRequestDTO> ingredientRequestDTOS, String instructions, MultipartFile image) {
        String imageUrl = null;
        if (image != null && !image.isEmpty()) {

//            String imageName = "recipe_" + temp.getId();
            String imageName = "recipe_" + LocalDateTime.now().toString().replaceAll("[:.]", "-");
            ResponseEntity<String> uploadResponse = cloudStorageService.uploadImage(imageName, image);

            if (uploadResponse.getStatusCode().is2xxSuccessful()) {
                imageUrl = uploadResponse.getBody();
            } else {
                throw new RuntimeException("Image upload failed: " + uploadResponse.getBody());
            }
        }
        return createRecipe(userId, name, description, ingredientRequestDTOS, instructions, imageUrl);
    }

    // uses img_uri
    @Transactional
    public Recipe createRecipe(Integer userId, String name, String description, List<IngredientRequestDTO> ingredientRequestDTOS, String instructions, String image_uri) {
        return persistRecipe(userId, name, description, ingredientRequestDTOS, instructions, image_uri);
    }

    private Recipe persistRecipe(Integer userId, String name, String description, List<IngredientRequestDTO> ingredientRequestDTOS, String instructions, String imageUrl) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new EntityNotFoundException("User not found with ID: " + userId));

        Recipe recipe = new Recipe();
        recipe.setName(name);
        recipe.setDescription(description);
        recipe.setInstructions(instructions);
        recipe.setCreateTimestamp(LocalDateTime.now());
        recipe.setImg_uri(imageUrl);

        recipeRepository.save(recipe);

        RecipeOwner recipeOwner = new RecipeOwner();
        recipeOwner.setUser(user);
        recipeOwner.setRecipe(recipe);
        recipeOwnerRepository.save(recipeOwner);

        for (IngredientRequestDTO dto : ingredientRequestDTOS) {
            Ingredient ingredient = ingredientRepository.findById(dto.getIngredientId())
                    .orElseThrow(() -> new EntityNotFoundException("Ingredient not found"));

            RecipeIngredient recipeIngredient = new RecipeIngredient();
            recipeIngredient.setRecipe(recipe);
            recipeIngredient.setIngredient(ingredient);
            recipeIngredient.setQuantity(dto.getQuantity());
            recipeIngredientRepository.save(recipeIngredient);
        }

        return recipe;
    }




    @Transactional
    public ResponseEntity<String> deleteRecipe(Integer recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId).orElseThrow(
                () -> new EntityNotFoundException("Recipe not found with ID: " + recipeId)
        );

        cloudStorageService.deleteImage(recipe.getImg_uri());

        recipeIngredientRepository.deleteAllByRecipeId(recipeId);
        recipeOwnerRepository.deleteAllByRecipeId(recipeId);
        recipeRepository.delete(recipe);

        return ResponseEntity.ok("Recipe deleted successfully");
    }





    public boolean isEmpty(){
        return recipeRepository.count() == 0;
    }
    private RecipeResponseDTO convertToDTO(RecipeOwner recipeOwner) {
        RecipeResponseDTO recipeResponseDTO = new RecipeResponseDTO();
        recipeResponseDTO.setId(recipeOwner.getRecipe().getId());

        User author = recipeOwner.getUser();
        Recipe recipe = recipeOwner.getRecipe();

        recipeResponseDTO.setAuthor(author.getFirstName() + " " + author.getLastName());
        recipeResponseDTO.setName(recipe.getName());
        recipeResponseDTO.setDescription(recipe.getDescription());
        recipeResponseDTO.setInstructions(recipe.getInstructions());
        recipeResponseDTO.setCreateTimestamp(recipe.getCreateTimestamp());
        recipeResponseDTO.setImg_uri(recipe.getImg_uri());

        return recipeResponseDTO;
    }
    @Data
    class RecipeResponseDTO{
        private Integer id;
        private String author;
        private String name;
        private List<Integer> ingredientIds;
        private String description;
        private String instructions;
        private LocalDateTime createTimestamp;
        private String img_uri;
    }


}


