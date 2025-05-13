package com.cs490.group4.demo.dto.authentication;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CredentialsCheckResponseDTO {

    private Boolean validCredentials;
    private UserResponseDTO userResponseDTO;

}
