package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.Recipe;
import com.cs490.group4.demo.dao.RecipeComment;
import com.cs490.group4.demo.dao.RecipeCommentRepository;
import com.cs490.group4.demo.dao.RecipeRepository;
import com.cs490.group4.demo.security.User;
import com.cs490.group4.demo.security.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecipeCommentService {
    private final RecipeCommentRepository recipeCommentRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    @Transactional
    public List<RecipeCommentResponseDTO> getCommentsByRecipeId(Integer recipeId) {
        List<RecipeComment> recipeComments = recipeCommentRepository.findAllByRecipeId(recipeId);
        System.out.println(recipeComments);
        List<RecipeCommentResponseDTO> responseDTOs = new ArrayList<>();

        for (RecipeComment recipeComment : recipeComments) {
            RecipeCommentResponseDTO recipeCommentResponseDTO = new RecipeCommentResponseDTO();
            recipeCommentResponseDTO.setCommentId(recipeComment.getId());
            recipeCommentResponseDTO.setRecipeId(recipeId);
//            recipeCommentResponseDTO.setUserId(recipeComment.getAuthor().getUserId());
            recipeCommentResponseDTO.setCommenter(recipeComment.getAuthor().getFirstName() + " " + recipeComment.getAuthor().getLastName());
            recipeCommentResponseDTO.setComment(recipeComment.getComment());
            responseDTOs.add(recipeCommentResponseDTO);
        }
        return responseDTOs;
    }

    @Transactional
    public RecipeCommentResponseDTO createComment(Integer recipeId, Integer userId, String comment) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User with id " + userId + " not found"));
        Recipe recipe = recipeRepository.findById(recipeId).orElseThrow(()-> new EntityNotFoundException("Recipe with id " + recipeId + " not found"));

        RecipeComment recipeComment = new RecipeComment();

        recipeComment.setAuthor(user);
        recipeComment.setRecipe(recipe);
        recipeComment.setComment(comment);

        recipeCommentRepository.save(recipeComment);
        RecipeCommentResponseDTO responseDTO = new RecipeCommentResponseDTO();
        responseDTO.setCommentId(recipeComment.getId());
        responseDTO.setRecipeId(recipeId);
        responseDTO.setUserId(userId);
        responseDTO.setCommenter(user.getFirstName() + " " + user.getLastName());
        responseDTO.setComment(comment);
        return responseDTO;
    }


    public boolean isEmpty()
    {
        return recipeCommentRepository.count() == 0;
    }

    @Data
    public static class RecipeCommentResponseDTO {
        private Integer userId;
        private String commenter;

        private Integer commentId;
        private Integer recipeId;
        private String comment;
    }
}
