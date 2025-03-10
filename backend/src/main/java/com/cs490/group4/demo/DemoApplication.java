package com.cs490.group4.demo;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.crypto.SecretKey;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

		// Optionally, encode the key in Base64 if you want to store or display it.
		String base64Key = Encoders.BASE64.encode(key.getEncoded());
		System.out.println("Secret Key (Base64): " + base64Key);

		SpringApplication.run(DemoApplication.class, args);
	}

}
