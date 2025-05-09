package com.comet.opik.infrastructure;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public record PythonEvaluatorConfig(@JsonProperty @NotBlank String url) {

    public PythonEvaluatorConfig() {
        this(null);
    }
}
