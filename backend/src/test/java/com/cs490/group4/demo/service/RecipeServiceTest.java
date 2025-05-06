package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import com.cs490.group4.demo.dto.IngredientRequestDTO;
import com.cs490.group4.demo.security.User;
import com.cs490.group4.demo.security.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EntityNotFoundException;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RecipeServiceTest {

    @Mock private RecipeRepository recipeRepository;
    @Mock private UserRepository userRepository;
    @Mock private RecipeOwnerRepository recipeOwnerRepository;
    @Mock private IngredientRepository ingredientRepository;
    @Mock private RecipeIngredientRepository recipeIngredientRepository;
    @Mock private CloudStorageService cloudStorageService;
    @Mock private MultipartFile mockFile;

    @InjectMocks
    private RecipeService recipeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getRecipes_returnsMappedDTOs() {
        Recipe recipe = new Recipe();
        recipe.setId(1);
        recipe.setName("Test Recipe");
        recipe.setDescription("Desc");
        recipe.setInstructions("Cook it");
        recipe.setCreateTimestamp(LocalDateTime.now());

        User user = new User();
        user.setFirstName("John");
        user.setLastName("Doe");

        RecipeOwner owner = new RecipeOwner();
        owner.setRecipe(recipe);
        owner.setUser(user);

        when(recipeOwnerRepository.findAll()).thenReturn(List.of(owner));

        var result = recipeService.getRecipes();

        assertEquals(1, result.size());
        assertEquals("John Doe", result.get(0).getAuthor());
    }

    @Test
    void createRecipe_withImage_successfulUpload() {
        Integer userId = 1;
        String name = "Recipe";
        String desc = "desc";
        String instructions = "do it";
        List<IngredientRequestDTO> ingredients = new ArrayList<>();

        when(mockFile.isEmpty()).thenReturn(false);
        when(mockFile.getOriginalFilename()).thenReturn("test.jpg");
        when(cloudStorageService.uploadImage(anyString(), eq(mockFile)))
                .thenReturn(ResponseEntity.ok("http://image.url"));

        User user = new User();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        Recipe savedRecipe = new Recipe();
        savedRecipe.setId(1);
        when(recipeRepository.save(any())).thenReturn(savedRecipe);

        Ingredient ingredient = new Ingredient();
        ingredient.setId(1);
        IngredientRequestDTO dto = new IngredientRequestDTO();
        dto.setIngredientId(1);
        dto.setQuantity(2);

        ingredients.add(dto);
        when(ingredientRepository.findById(1)).thenReturn(Optional.of(ingredient));

        Recipe result = recipeService.createRecipe(userId, name, desc, ingredients, instructions, mockFile);

        assertNotNull(result);
        verify(cloudStorageService).uploadImage(anyString(), eq(mockFile));
        verify(recipeRepository).save(any(Recipe.class));
    }

    @Test
    void createRecipe_missingUser_throws() {
        when(userRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () ->
                recipeService.createRecipe(99, "name", "desc", List.of(), "steps", "url"));
    }

    @Test
    void deleteRecipe_validId_success() {
        Recipe recipe = new Recipe();
        recipe.setId(1);
        recipe.setImg_uri("http://img");

        when(recipeRepository.findById(1)).thenReturn(Optional.of(recipe));

        ResponseEntity<String> result = recipeService.deleteRecipe(1);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        verify(cloudStorageService).deleteImage("http://img");
        verify(recipeRepository).delete(recipe);
    }

    @Test
    void deleteRecipe_invalidId_throws() {
        when(recipeRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> recipeService.deleteRecipe(99));
    }

    @Test
    void isEmpty_returnsTrueOrFalse() {
        when(recipeRepository.count()).thenReturn(0L);
        assertTrue(recipeService.isEmpty());

        when(recipeRepository.count()).thenReturn(5L);
        assertFalse(recipeService.isEmpty());
    }
}
