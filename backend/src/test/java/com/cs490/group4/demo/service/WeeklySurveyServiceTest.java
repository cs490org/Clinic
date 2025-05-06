package com.cs490.group4.demo.service;

import com.cs490.group4.demo.dao.*;
import com.cs490.group4.demo.dto.WeeklySurveyCreateRequestDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class WeeklySurveyServiceTest {

    @Mock private PatientRepository patientRepository;
    @Mock private WeeklySurveyRepository weeklySurveyRepository;
    @InjectMocks private WeeklySurveyService weeklySurveyService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getWeeklySurveysForPatientId_returnsSortedList() {
        List<WeeklySurvey> surveys = List.of(new WeeklySurvey(), new WeeklySurvey());
        when(weeklySurveyRepository.findByPatientIdOrderByStartDateAsc(1)).thenReturn(surveys);

        List<WeeklySurvey> result = weeklySurveyService.getWeeklySurveysForPatientId(1);

        assertEquals(2, result.size());
    }

    @Test
    void postWeeklySurvey_success() {
        LocalDate today = LocalDate.of(2024, 5, 8); // e.g., Wednesday
        LocalDate expectedStart = today.with(DayOfWeek.MONDAY);
        LocalDate expectedEnd = today.with(DayOfWeek.SUNDAY);

        WeeklySurveyCreateRequestDTO dto = new WeeklySurveyCreateRequestDTO();
        dto.setPatientId(1);
        dto.setWeight(160.5f);
        dto.setSurveyDate(today);

        Patient patient = new Patient();

        when(patientRepository.findById(1)).thenReturn(Optional.of(patient));
        when(weeklySurveyRepository.findByStartDateAndPatientId(expectedStart, 1)).thenReturn(Collections.emptyList());
        when(weeklySurveyRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        WeeklySurvey result = weeklySurveyService.postWeeklySurvey(dto);

        assertEquals(patient, result.getPatient());
        assertEquals(today, result.getSurveyDate());
        assertEquals(expectedStart, result.getStartDate());
        assertEquals(expectedEnd, result.getEndDate());
        assertEquals(160.5f, result.getWeight());
    }

    @Test
    void postWeeklySurvey_alreadyExists_throws() {
        LocalDate date = LocalDate.of(2024, 5, 8);
        LocalDate start = date.with(DayOfWeek.MONDAY);

        WeeklySurveyCreateRequestDTO dto = new WeeklySurveyCreateRequestDTO();
        dto.setPatientId(1);
        dto.setSurveyDate(date);

        when(patientRepository.findById(1)).thenReturn(Optional.of(new Patient()));
        when(weeklySurveyRepository.findByStartDateAndPatientId(start, 1)).thenReturn(List.of(new WeeklySurvey()));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                weeklySurveyService.postWeeklySurvey(dto));
        assertTrue(ex.getMessage().contains("Survey date already exists"));
    }

    @Test
    void postWeeklySurvey_patientNotFound_throws() {
        WeeklySurveyCreateRequestDTO dto = new WeeklySurveyCreateRequestDTO();
        dto.setPatientId(1);

        when(patientRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> weeklySurveyService.postWeeklySurvey(dto));
    }

    @Test
    void checkIfPatientDidSurveyForWeek_returnsTrue() {
        LocalDate now = LocalDate.now();
        WeeklySurvey ws = new WeeklySurvey();
        ws.setStartDate(now.minusDays(1));
        ws.setEndDate(now.plusDays(1));

        when(weeklySurveyRepository.findByPatientId(1)).thenReturn(List.of(ws));

        assertTrue(weeklySurveyService.checkIfPatientDidSurveyForWeek(1));
    }

    @Test
    void checkIfPatientDidSurveyForWeek_returnsFalse() {
        LocalDate now = LocalDate.now();
        WeeklySurvey ws = new WeeklySurvey();
        ws.setStartDate(now.minusWeeks(2));
        ws.setEndDate(now.minusWeeks(2).with(DayOfWeek.SUNDAY));

        when(weeklySurveyRepository.findByPatientId(1)).thenReturn(List.of(ws));

        assertFalse(weeklySurveyService.checkIfPatientDidSurveyForWeek(1));
    }

    @Test
    void getStartDate_returnsMonday() {
        LocalDate input = LocalDate.of(2024, 5, 8); // Wednesday
        LocalDate expected = input.with(DayOfWeek.MONDAY);

        assertEquals(expected, weeklySurveyService.getStartDate(input));
    }

    @Test
    void isEmpty_returnsCorrectValue() {
        when(weeklySurveyRepository.count()).thenReturn(0L);
        assertTrue(weeklySurveyService.isEmpty());

        when(weeklySurveyRepository.count()).thenReturn(3L);
        assertFalse(weeklySurveyService.isEmpty());
    }
}
