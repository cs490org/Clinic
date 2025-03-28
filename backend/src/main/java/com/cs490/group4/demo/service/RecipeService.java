package com.cs490.group4.demo.service;
import com.cs490.group4.demo.dao.Recipe;
import com.cs490.group4.demo.dao.RecipeOwner;
import com.cs490.group4.demo.dao.RecipeOwnerRepository;
import com.cs490.group4.demo.dao.RecipeRepository;
import com.cs490.group4.demo.security.User;
import com.cs490.group4.demo.security.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final RecipeOwnerRepository recipeOwnerRepository;

    public List<RecipeResponseDTO> getRecipes(){
        return recipeOwnerRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // recipes associated with users.
    @Transactional
    public Recipe createRecipe(Integer userId, String name, String description){
        User user = userRepository.findById(userId).orElseThrow(
                ()-> new EntityNotFoundException("User not found with ID: " + userId)
        );

        Recipe recipe = new Recipe();
        recipe.setName(name);
        recipe.setDescription(description);
        recipe.setCreateTimestamp(LocalDateTime.now());

        RecipeOwner recipeOwner = new RecipeOwner();

        recipeOwner.setUser(user);
        recipeOwner.setRecipe(recipe);

        recipeRepository.save(recipe);
        recipeOwnerRepository.save(recipeOwner);

        return recipe;
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
        recipeResponseDTO.setCreateTimestamp(recipe.getCreateTimestamp());

        return recipeResponseDTO;
    }
    @Data
    class RecipeResponseDTO{
        private Integer id;
        private String author;
        private String name;
        private String description;
        private LocalDateTime createTimestamp;
    }


}


