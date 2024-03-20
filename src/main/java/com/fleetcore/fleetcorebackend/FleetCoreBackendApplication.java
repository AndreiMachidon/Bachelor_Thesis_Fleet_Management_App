package com.fleetcore.fleetcorebackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


@SpringBootApplication
@EnableScheduling
public class FleetCoreBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(FleetCoreBackendApplication.class, args);
	}

}
