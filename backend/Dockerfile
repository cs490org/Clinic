# Stage 1: Build the Spring Boot application with Maven using Java 21
FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /app
# Copy the Maven configuration and source code
COPY pom.xml .
COPY src ./src
# Package the application (skipping tests for faster builds; remove -DskipTests if needed)
RUN mvn clean package -DskipTests

# Stage 2: Create the runtime image using Eclipse Temurin Java 21
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
# Copy the built JAR from the build stage
COPY --from=build /app/target/clinic-0.0.1-SNAPSHOT.jar clinic-0.0.1-SNAPSHOT.jar
# Copy the .env file
COPY --from=build /app/src/main/resources/.env .env
EXPOSE 8080
# Set the entrypoint to run the Spring Boot application
ENTRYPOINT ["java", "-jar", "clinic-0.0.1-SNAPSHOT.jar"]
