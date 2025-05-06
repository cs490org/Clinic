package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.Recipe;
import com.cs490.group4.demo.dao.RecipeComment;
import com.cs490.group4.demo.dao.RecipeCommentRepository;
import com.cs490.group4.demo.dao.RecipeRepository;
import com.cs490.group4.demo.security.User;
import com.cs490.group4.demo.security.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecipeCommentServiceTest {

    @Mock
    private RecipeCommentRepository recipeCommentRepository;

    @Mock
    private RecipeRepository recipeRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private RecipeCommentService recipeCommentService;

    @Test
    void getCommentsByRecipeId_returnsAllComments() {
        Recipe recipe = new Recipe();
        recipe.setId(1);
        User user = new User();
        user.setUserId(1);
        user.setFirstName("John");
        user.setLastName("Doe");

        RecipeComment comment1 = new RecipeComment();
        comment1.setId(1);
        comment1.setRecipe(recipe);
        comment1.setAuthor(user);
        comment1.setComment("Great recipe!");

        RecipeComment comment2 = new RecipeComment();
        comment2.setId(2);
        comment2.setRecipe(recipe);
        comment2.setAuthor(user);
        comment2.setComment("Delicious!");

        List<RecipeComment> expectedComments = Arrays.asList(comment1, comment2);
        when(recipeCommentRepository.findAllByRecipeId(1)).thenReturn(expectedComments);

        List<RecipeCommentService.RecipeCommentResponseDTO> result = recipeCommentService.getCommentsByRecipeId(1);

        assertEquals(2, result.size());
        assertEquals(1, result.get(0).getCommentId());
        assertEquals(1, result.get(0).getRecipeId());
        assertEquals("John Doe", result.get(0).getCommenter());
        assertEquals("Great recipe!", result.get(0).getComment());
        verify(recipeCommentRepository).findAllByRecipeId(1);
    }

    @Test
    void createComment_successfullyCreatesComment() {
        Recipe recipe = new Recipe();
        recipe.setId(1);
        User user = new User();
        user.setUserId(1);
        user.setFirstName("John");
        user.setLastName("Doe");

        when(recipeRepository.findById(1)).thenReturn(Optional.of(recipe));
        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        RecipeComment savedComment = new RecipeComment();
        savedComment.setId(1);
        savedComment.setRecipe(recipe);
        savedComment.setAuthor(user);
        savedComment.setComment("Great recipe!");

        // set comment id to 1 so test can pass.
        when(recipeCommentRepository.save(any(RecipeComment.class))).thenAnswer(invocation -> {
            RecipeComment comment = invocation.getArgument(0);
            comment.setId(1);
            return comment;
        });

        RecipeCommentService.RecipeCommentResponseDTO result = recipeCommentService.createComment(1, 1, "Great recipe!");

        assertEquals(1, result.getCommentId());
        assertEquals(1, result.getRecipeId());
        assertEquals("John Doe", result.getCommenter());
        assertEquals("Great recipe!", result.getComment());
        verify(recipeRepository).findById(1);
        verify(userRepository).findById(1);
        verify(recipeCommentRepository).save(any(RecipeComment.class));
    }

    @Test
    void createComment_throwsIfUserNotFound() {
        when(userRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            recipeCommentService.createComment(1, 99, "Great recipe!");
        });

        verify(userRepository).findById(99);
        verify(recipeCommentRepository, never()).save(any(RecipeComment.class));
    }

    @Test
    void createComment_throwsIfRecipeNotFound() {
        User user = new User();
        user.setUserId(1);
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(recipeRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            recipeCommentService.createComment(99, 1, "Great recipe!");
        });

        verify(userRepository).findById(1);
        verify(recipeRepository).findById(99);
        verify(recipeCommentRepository, never()).save(any(RecipeComment.class));
    }

    @Test
    void isEmpty_returnsTrue() {
        when(recipeCommentRepository.count()).thenReturn(0L);
        assertTrue(recipeCommentService.isEmpty());
        verify(recipeCommentRepository).count();
    }

    @Test
    void isEmpty_returnsFalse() {
        when(recipeCommentRepository.count()).thenReturn(1L);
        assertFalse(recipeCommentService.isEmpty());
        verify(recipeCommentRepository).count();
    }
} 