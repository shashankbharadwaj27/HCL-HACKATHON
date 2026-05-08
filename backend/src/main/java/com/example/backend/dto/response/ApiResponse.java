package com.example.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)  // omits null fields from JSON
public record ApiResponse<T>(
        boolean success,
        String message,
        T data,
        Object errors
) {
    public static <T> ApiResponse<T> ok(String message, T data) {
        return new ApiResponse<>(true, message, data, null);
    }

    public static <T> ApiResponse<T> ok(String message) {
        return new ApiResponse<>(true, message, null, null);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, null);
    }

    public static <T> ApiResponse<T> validationError(Object errors) {
        return new ApiResponse<>(false, "Validation failed", null, errors);
    }
}