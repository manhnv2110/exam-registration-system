package com.examreg.examreg.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class OpenApiConfig {
  
  @Bean
  public OpenAPI customOpenAPI() {
    SecurityScheme securityScheme = new SecurityScheme()
      .name("bearerAuth")
      .type(SecurityScheme.Type.HTTP)
      .scheme("bearer")
      .bearerFormat("JWT");
    
    SecurityRequirement securityRequirement = new SecurityRequirement()
      .addList("bearerAuth");

    return new OpenAPI()
      .addSecurityItem(securityRequirement)
      .components(new Components().addSecuritySchemes("bearerAuth", securityScheme))
      .info(new Info()
        .title("ExamReg API")
        .description("Tài liệu API cho hệ thống đăng kí thi ")
        .version("1.0.0")
        .contact(new Contact()
          .name("API Support")
          .email("support@example.com")
          .url("https://example.com")
        )
        .license(new License()
          .name("Apache 2.0")
          .url("http://springdoc.org")
        )
      );
  }
}
