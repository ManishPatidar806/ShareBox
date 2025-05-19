package com.backend.nextwave.Controller;

import com.backend.nextwave.Config.JwtConfig;
import com.backend.nextwave.DTO.ActivityResponse;
import com.backend.nextwave.Exception.CommanException;
import com.backend.nextwave.Exception.UnAuthorizeException;
import com.backend.nextwave.Model.Entity.Activity;
import com.backend.nextwave.Service.ActivityService;
import com.backend.nextwave.Model.Enum.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")

public class ActivityController {

    private final ActivityService activityService;


    private final JwtConfig jwtConfig;

    public ActivityController(ActivityService activityService, JwtConfig jwtConfig) {
        this.activityService = activityService;
        this.jwtConfig = jwtConfig;
    }

    @GetMapping("/activity")
    public ResponseEntity<ActivityResponse> getAllTestCases(
            @RequestParam
            Optional<Status> status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size ) throws CommanException, UnAuthorizeException {



        ActivityResponse responseDTO = new ActivityResponse();
        Page<Activity> testCases = activityService.findAllActivity(status, page, size);
        responseDTO.setActivities(testCases);
        responseDTO.setMessage("Test cases retrieved successfully.");
        responseDTO.setStatus(true);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);

    }


}
