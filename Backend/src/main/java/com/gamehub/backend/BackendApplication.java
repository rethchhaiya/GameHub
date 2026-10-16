package com.gamehub.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;


@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure().systemProperties().load();


		System.out.println("DB_URL loaded: "
                        + (dotenv.get("DB_URL") != null));
                System.out.println("DB_USERNAME loaded: "
                        + (dotenv.get("DB_USERNAME") != null));
                System.out.println("DB_PASSWORD loaded: "
                        + (dotenv.get("DB_PASSWORD") != null));
		SpringApplication.run(BackendApplication.class, args);
	}

}
