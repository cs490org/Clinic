package com.cs490.group4.demo.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class RecipeCreateDTO{
    private Integer userId;
    private String name;
    private String description;
    private List<Integer> ingredientIds;
    private String instructions;

    // used only in file upload, will store as url in the object.
    private MultipartFile image;
}
