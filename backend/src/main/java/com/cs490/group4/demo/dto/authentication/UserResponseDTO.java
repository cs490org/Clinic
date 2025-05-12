package com.cs490.group4.demo.dto.authentication;

import com.cs490.group4.demo.security.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private Integer id, creditBalance;
    private String firstName, lastName, email, imgUri, connectedAccountId;
    private Role role;
    private boolean mfaEnabled;
}
