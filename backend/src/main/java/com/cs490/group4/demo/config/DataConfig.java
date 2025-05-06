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
                appointmentStatusCode.setId(1);
                appointmentStatusCode.setStatus("PENDING");
                appointmentStatusCodeRepository.save(appointmentStatusCode);

                appointmentStatusCode = new AppointmentStatusCode();
                appointmentStatusCode.setId(2);
                appointmentStatusCode.setStatus("CONFIRMED");
                appointmentStatusCodeRepository.save(appointmentStatusCode);

                appointmentStatusCode = new AppointmentStatusCode();
                appointmentStatusCode.setId(3);
                appointmentStatusCode.setStatus("CANCELLED");
                appointmentStatusCodeRepository.save(appointmentStatusCode);

                appointmentStatusCode = new AppointmentStatusCode();
                appointmentStatusCode.setId(4);
                appointmentStatusCode.setStatus("COMPLETED");
                appointmentStatusCodeRepository.save(appointmentStatusCode);
            }

        };
    }

} 