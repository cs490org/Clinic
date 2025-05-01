package com.cs490.group4.demo.config;

import com.cs490.group4.demo.dao.RxStatusCode;
import com.cs490.group4.demo.dao.RxStatusCodeRepository;
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
    @Autowired
    RxStatusCodeRepository rxStatusCodeRepository;

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

            if (rxStatusCodeRepository.count() == 0) {
                RxStatusCode rxStatusCode = new RxStatusCode();
                rxStatusCode.setStatus("NEW_PRESCRIPTION");
                rxStatusCodeRepository.save(rxStatusCode);

                rxStatusCode = new RxStatusCode();
                rxStatusCode.setStatus("READY_FOR_PICKUP");
                rxStatusCodeRepository.save(rxStatusCode);

                rxStatusCode = new RxStatusCode();
                rxStatusCode.setStatus("FULFILLED");
                rxStatusCodeRepository.save(rxStatusCode);
            }

        };
    }

} 