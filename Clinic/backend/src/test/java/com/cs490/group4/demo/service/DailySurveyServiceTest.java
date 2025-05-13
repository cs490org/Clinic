package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import com.cs490.group4.demo.dto.DailySurveyCreateRequestDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DailySurveyServiceTest {

    @Mock private DailySurveyRepository dailySurveyRepository;
    @Mock private PatientRepository patientRepository;
    @InjectMocks private DailySurveyService dailySurveyService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getDailySurveysForPatientId_returnsListSortedByDate() {
        List<DailySurvey> surveys = List.of(new DailySurvey(), new DailySurvey());
        when(dailySurveyRepository.findByPatientIdOrderBySurveyDateAsc(1)).thenReturn(surveys);

        List<DailySurvey> result = dailySurveyService.getDailySurveysForPatientId(1);

        assertEquals(2, result.size());
    }

    @Test
    void postDailySurvey_success() {
        DailySurveyCreateRequestDTO dto = new DailySurveyCreateRequestDTO();
        dto.setPatientId(1);
        dto.setCaloriesEaten(2000);
        dto.setMood(5);
        dto.setSurveyDate(LocalDate.now());

        Patient patient = new Patient();

        when(patientRepository.findById(1)).thenReturn(Optional.of(patient));
        when(dailySurveyRepository.findBySurveyDateAndPatientId(dto.getSurveyDate(), 1)).thenReturn(Collections.emptyList());
        when(dailySurveyRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        DailySurvey result = dailySurveyService.postDailySurvey(dto);

        assertEquals(5, result.getMood());
        assertEquals(2000, result.getCaloriesEaten());
        assertEquals(LocalDate.now(), result.getSurveyDate());
        assertEquals(patient, result.getPatient());
    }

    @Test
    void postDailySurvey_existingSurvey_throws() {
        DailySurveyCreateRequestDTO dto = new DailySurveyCreateRequestDTO();
        dto.setPatientId(1);
        dto.setSurveyDate(LocalDate.now());

        when(patientRepository.findById(1)).thenReturn(Optional.of(new Patient()));
        when(dailySurveyRepository.findBySurveyDateAndPatientId(dto.getSurveyDate(), 1))
                .thenReturn(List.of(new DailySurvey()));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                dailySurveyService.postDailySurvey(dto));

        assertTrue(ex.getMessage().contains("Survey date already exists"));
    }

    @Test
    void postDailySurvey_missingPatient_throws() {
        DailySurveyCreateRequestDTO dto = new DailySurveyCreateRequestDTO();
        dto.setPatientId(1);

        when(patientRepository.findById(1)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                dailySurveyService.postDailySurvey(dto));

        assertTrue(ex.getMessage().contains("Patient not found"));
    }

    @Test
    void checkIfPatientDidSurveyForToday_true() {
        DailySurvey todaySurvey = new DailySurvey();
        todaySurvey.setSurveyDate(LocalDate.now());

        when(dailySurveyRepository.findByPatientId(1)).thenReturn(List.of(todaySurvey));

        assertTrue(dailySurveyService.checkIfPatientDidSurveyForToday(1));
    }

    @Test
    void checkIfPatientDidSurveyForToday_false() {
        DailySurvey oldSurvey = new DailySurvey();
        oldSurvey.setSurveyDate(LocalDate.now().minusDays(1));

        when(dailySurveyRepository.findByPatientId(1)).thenReturn(List.of(oldSurvey));

        assertFalse(dailySurveyService.checkIfPatientDidSurveyForToday(1));
    }

    @Test
    void isEmpty_returnsCorrectResult() {
        when(dailySurveyRepository.count()).thenReturn(0L);
        assertTrue(dailySurveyService.isEmpty());

        when(dailySurveyRepository.count()).thenReturn(3L);
        assertFalse(dailySurveyService.isEmpty());
    }
}
