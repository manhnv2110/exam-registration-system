# Build stage - Build code từ source
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copy Maven wrapper và pom.xml
COPY .mvn .mvn
COPY mvnw .
COPY pom.xml .

# FIX: Thêm quyền thực thi cho mvnw
RUN chmod +x mvnw

# Download dependencies (cache layer để build nhanh hơn lần sau)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src ./src

# Build application (skip tests để build nhanh hơn)
RUN ./mvnw clean package -DskipTests

# Runtime stage - Chỉ chạy app với JRE (nhẹ hơn)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy jar file từ build stage
COPY --from=build /app/target/examreg-*.jar examreg.jar

# Expose port
EXPOSE 8080

# Health check (giúp Render biết app đã sẵn sàng chưa)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Run application với các JVM options tối ưu cho container
ENTRYPOINT ["java", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-Dspring.profiles.active=prod", \
  "-jar", "examreg.jar"]