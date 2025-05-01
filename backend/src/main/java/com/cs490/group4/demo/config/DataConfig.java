package com.cs490.group4.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.cs490.group4.demo.dao.AppointmentStatusCode;
import com.cs490.group4.demo.dao.AppointmentStatusCodeRepository;


@Configuration
public class DataConfig {

    @Autowired
    AppointmentStatusCodeRepository appointmentStatusCodeRepository;

    @Bean
    CommandLineRunner dataInitializer() {
        return args -> {
            if (appointmentStatusCodeRepository.count() == 0) {
                AppointmentStatusCode appointmentStatusCode = new AppointmentStatusCode();
                appointmentStatusCode.setStatus("PENDING");
                appointmentStatusCodeRepository.save(appointmentStatusCode);

                appointmentStatusCode = new AppointmentStatusCode();
                appointmentStatusCode.setStatus("CONFIRMED");
                appointmentStatusCodeRepository.save(appointmentStatusCode);

                appointmentStatusCode = new AppointmentStatusCode();
                appointmentStatusCode.setStatus("CANCELLED");
                appointmentStatusCodeRepository.save(appointmentStatusCode);
            }

        };
    }

} 