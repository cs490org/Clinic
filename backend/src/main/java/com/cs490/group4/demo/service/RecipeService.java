package com.cs490.group4.demo.service;
import com.cs490.group4.demo.dao.Recipe;
import com.cs490.group4.demo.dao.RecipeRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeService{

    private final RecipeRepository recipeRepository;

    public List<RecipeResponseDTO> getRecipes(){
        return recipeRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public boolean isEmpty(){
        return recipeRepository.count() == 0;
    }
    private RecipeResponseDTO convertToDTO(Recipe recipe) {
        RecipeResponseDTO recipeResponseDTO = new RecipeResponseDTO();
        recipeResponseDTO.setId(recipe.getId());
        recipeResponseDTO.setAuthor(recipe.getAuthor().getFirstName() + " " + recipe.getAuthor().getLastName());
        recipeResponseDTO.setName(recipe.getName());
        recipeResponseDTO.setDescription(recipe.getDescription());

        return recipeResponseDTO;
    }
    @Data
    class RecipeResponseDTO{

        private Integer id;
        private String author;
        private String name;
        private String description;


    }

}


