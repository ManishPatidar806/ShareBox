package com.backend.nextwave.Service;

import com.backend.nextwave.Exception.CommanException;
import com.backend.nextwave.Exception.FileNotFoundException;
import com.backend.nextwave.Model.Activity;
import com.backend.nextwave.Model.User;
import com.backend.nextwave.Repository.ActivityRepository;
import com.backend.nextwave.utils.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.awt.print.Pageable;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ActivityServiceImpl implements ActivityService{

    @Autowired
    private ActivityRepository activityRepository;

    public Page<Activity>findAllActivity(Optional<Status> status, int page, int size) {
        PageRequest pageable =  PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Activity> activityData;
        if (status.isPresent()) {
            activityData = activityRepository.findByStatus(status, pageable);
        } else {
            activityData = activityRepository.findAll(pageable);
        }
        return activityData;
    }

    public Activity addUpload(String message , String fileName , User user)  {
        Activity activity= new Activity();
        activity.setFileName(fileName);
        activity.setStatus(Status.Upload);
        activity.setMessage(message);
        activity.setUser(user);
        return activityRepository.save(activity);
    }
    public Activity addDownload(String message , String fileName , User user){
        Activity activity= new Activity();
        activity.setFileName(fileName);
        activity.setStatus(Status.Download);
        activity.setMessage(message);
        activity.setUser(user);
        return activityRepository.save(activity);
    }
    public Activity addShare(String message , String fileName , User user){
        Activity activity= new Activity();
        activity.setFileName(fileName);
        activity.setStatus(Status.Share);
        activity.setMessage(message);
        activity.setUser(user);
        return activityRepository.save(activity);
    }

}
