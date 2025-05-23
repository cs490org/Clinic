package com.cs490.group4.demo.dto.authentication;

import com.cs490.group4.demo.security.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {
    private Integer id;
    private String firstName, lastName, email, imgUri, phone, address;
    private Role role;
}
