package com.cs490.group4.demo.service.authentication;

import com.cs490.group4.demo.dto.authentication.*;
import com.cs490.group4.demo.security.*;
import com.cs490.group4.demo.security.config.JWTService;
import com.cs490.group4.demo.security.config.token.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthenticationServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JWTService jwtService;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private TokenRepository tokenRepository;

    @InjectMocks private AuthenticationService authenticationService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockUser = User.builder()
                .userId(1)
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .password("encodedPassword")
                .role(Role.PATIENT)
                .build();
    }

//    @Test
    void resetPassword_userExists_passwordUpdated() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.encode("newPass")).thenReturn("encodedNew");
        when(userRepository.save(mockUser)).thenReturn(mockUser);

        User result = authenticationService.resetPassword("test@example.com", "newPass");

        assertEquals("encodedNew", result.getPassword());
    }

//    @Test
    void register_success() {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setEmail("john@example.com");
        request.setPassword("123");
        request.setRole(Role.PATIENT);

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("123")).thenReturn("encoded123");

        User savedUser = User.builder()
                .userId(42)
                .email("john@example.com")
                .firstName("John")
                .lastName("Doe")
                .password("encoded123")
                .role(Role.PATIENT)
                .build();

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        Map<String, String> tokenMap = Map.of("access_token", "access123", "refresh_token", "refresh123");
        when(jwtService.generateTokens(any())).thenReturn(tokenMap);

        AuthenticationResponseDTO response = authenticationService.register(request);

        assertNotNull(response);
        assertEquals("access123", response.getAccessToken());
        assertEquals("refresh123", response.getRefreshToken());
    }

//    @Test
    void register_emailAlreadyExists_returnsNull() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));

        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setEmail("test@example.com");

        AuthenticationResponseDTO result = authenticationService.register(request);
        assertNull(result);
    }

//    @Test
    void authenticate_success() throws Exception {
        AuthenticationRequestDTO request = new AuthenticationRequestDTO();
        request.setEmail("test@example.com");
        request.setPassword("pw");

//        doNothing().when(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mock(org.springframework.security.core.Authentication.class));



        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(jwtService.generateTokens(mockUser)).thenReturn(Map.of(
                "access_token", "token",
                "refresh_token", "refresh"
        ));

        AuthenticationResponseDTO result = authenticationService.authenticate(request);

        assertEquals("token", result.getAccessToken());
        assertEquals("refresh", result.getRefreshToken());
    }

//    @Test
    void authenticate_failure_throws() {
        AuthenticationRequestDTO request = new AuthenticationRequestDTO();
        request.setEmail("bad@example.com");
        request.setPassword("pw");

        doThrow(new RuntimeException()).when(authenticationManager)
                .authenticate(any(UsernamePasswordAuthenticationToken.class));

        assertThrows(Exception.class, () -> authenticationService.authenticate(request));
    }

//    @Test
    void checkCredentials_valid() {
        AuthenticationRequestDTO request = new AuthenticationRequestDTO();
        request.setEmail("test@example.com");
        request.setPassword("pw");

        when(authenticationManager.authenticate(any())).thenReturn(null);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));

        CredentialsCheckResponseDTO result = authenticationService.checkCredentials(request);

        assertTrue(result.getValidCredentials());
        assertNotNull(result.getUserResponseDTO());
        assertEquals("Test", result.getUserResponseDTO().getFirstName());
    }

//    @Test
    void checkCredentials_invalid() {
        AuthenticationRequestDTO request = new AuthenticationRequestDTO();
        request.setEmail("bad@example.com");
        request.setPassword("pw");

        doThrow(new RuntimeException()).when(authenticationManager).authenticate(any());

        CredentialsCheckResponseDTO result = authenticationService.checkCredentials(request);

        assertFalse(result.getValidCredentials());
        assertNull(result.getUserResponseDTO());
    }

//    @Test
    void refreshAccessToken_valid_returnsNewTokens() {
        String refresh = "refresh123";

        when(jwtService.extractUsername(refresh)).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));

        Token token = Token.builder().token(refresh).expired(false).revoked(false).build();
        when(tokenRepository.findByToken(refresh)).thenReturn(Optional.of(token));

        when(jwtService.generateTokens(mockUser)).thenReturn(Map.of(
                "access_token", "newAccess",
                "refresh_token", "newRefresh"
        ));

        AuthenticationResponseDTO result = authenticationService.refreshAccessToken(refresh);

        assertEquals("newAccess", result.getAccessToken());
        assertEquals("newRefresh", result.getRefreshToken());
    }

//    @Test
    void refreshAccessToken_expired_throws() {
        String bad = "expiredToken";

        when(jwtService.extractUsername(bad)).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));

        Token expiredToken = Token.builder().token(bad).expired(true).build();
        when(tokenRepository.findByToken(bad)).thenReturn(Optional.of(expiredToken));

        assertThrows(RuntimeException.class, () -> authenticationService.refreshAccessToken(bad));
    }

//    @Test
    void revokeAllUserTokens_marksAllExpiredAndRevoked() {
        Token t1 = new Token(); t1.setExpired(false); t1.setRevoked(false);
        Token t2 = new Token(); t2.setExpired(false); t2.setRevoked(false);

        when(tokenRepository.findAllValidTokenByUser(1)).thenReturn(List.of(t1, t2));

        authenticationService.revokeAllUserTokens(mockUser);

        assertTrue(t1.isExpired());
        assertTrue(t2.isRevoked());
        verify(tokenRepository).saveAll(List.of(t1, t2));
    }
}
