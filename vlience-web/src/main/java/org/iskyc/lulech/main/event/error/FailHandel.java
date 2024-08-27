package org.iskyc.lulech.main.event.error;

import org.springframework.boot.diagnostics.AbstractFailureAnalyzer;
import org.springframework.boot.diagnostics.FailureAnalysis;
import org.springframework.stereotype.Component;

@Component
public class FailHandel extends AbstractFailureAnalyzer<Throwable> {

    @Override
    protected FailureAnalysis analyze(Throwable rootFailure, Throwable cause) {
        rootFailure.printStackTrace();
        String description = rootFailure.getLocalizedMessage();
        String action = "error";
        return new FailureAnalysis(description, action, cause);
    }
}
