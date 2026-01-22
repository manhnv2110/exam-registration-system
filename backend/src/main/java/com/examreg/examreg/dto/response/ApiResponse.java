package com.examreg.examreg.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse<T> {
  private String message;
  private T data;

  public static <T> ApiResponse<T> success(String message, T data) {
    return ApiResponse.<T>builder()
      .message(message)
      .data(data)
      .build();
  }

  public static ApiResponse<?> success(String message) {
    return ApiResponse.builder()
      .message(message)
      .build();
  }
}
