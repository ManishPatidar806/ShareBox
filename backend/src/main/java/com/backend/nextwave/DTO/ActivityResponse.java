package com.backend.nextwave.DTO;

import com.backend.nextwave.Model.Entity.Activity;
import lombok.Data;
import org.springframework.data.domain.Page;

@Data
public class ActivityResponse {
    private String message;
    private boolean status;
    private Page<Activity> activities;
}
