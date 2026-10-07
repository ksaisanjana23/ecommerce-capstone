# ============================================
# E-Commerce Capstone - Spring Boot Backend
# Production Docker Image
# Java 21 + Maven
# ============================================

# ---------- Build Stage ----------
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy Maven configuration first for dependency caching
COPY pom.xml .

# Download dependencies
RUN mvn -B dependency:go-offline

# Copy application source
COPY src ./src

# Build Spring Boot application
RUN mvn -B clean package -DskipTests


# ---------- Runtime Stage ----------
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the built Spring Boot JAR
COPY --from=build /app/target/*.jar app.jar

# Render provides PORT dynamically.
# application.properties already reads ${PORT:8080}.
EXPOSE 8080

# Start Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]