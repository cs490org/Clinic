package com.cs490.group4.demo.controller;

import com.cs490.group4.demo.service.RecipeCommentService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/recipes/comments")
@RequiredArgsConstructor
public class RecipeCommentController {

    private final RecipeCommentService recipeCommentService;

    @GetMapping
    private ResponseEntity<?> getComments(@RequestParam(required = true) Integer recipeId) {
        return ResponseEntity.ok(recipeCommentService.findByRecipeId(recipeId));
    }

    @PostMapping
    private ResponseEntity<?> addComment(@RequestBody RecipeCommentDTO comment) {

        return ResponseEntity.ok(recipeCommentService.createComment(
               comment.getRecipeId(),
               comment.getUserId(),
               comment.getComment()
        ));
    }

}
@Data
class RecipeCommentDTO {
    private Integer recipeId;
    private Integer userId;
    private String comment;
}
