package com.backend.nextwave.Service;

import com.backend.nextwave.Exception.UserNotFoundException;
import com.backend.nextwave.Model.Entity.Activity;
import com.backend.nextwave.Model.Entity.User;
import com.backend.nextwave.Repository.ActivityRepository;
import com.backend.nextwave.Model.Enum.Status;
import com.backend.nextwave.Repository.UserRepository;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ActivityServiceImpl implements ActivityService{


    private final ActivityRepository activityRepository;

    private final UserRepository userRepository;

    public ActivityServiceImpl(ActivityRepository activityRepository, UserRepository userRepository) {
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
    }

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

    @SneakyThrows
    public Activity addUpload(String message , String fileName , String email)  {
        Optional<User> user = userRepository.findByEmail(email);
        user.orElseThrow(UserNotFoundException::new);
        Activity activity= new Activity();
        activity.setFileName(fileName);
        activity.setStatus(Status.Upload);
        activity.setMessage(message);
        activity.setUser(user.get());
        return activityRepository.save(activity);
    }

    @SneakyThrows
    public Activity addDownload(String message , String fileName ,String email){
        Optional<User> user = userRepository.findByEmail(email);
        user.orElseThrow(UserNotFoundException::new);
        Activity activity= new Activity();
        activity.setFileName(fileName);
        activity.setStatus(Status.Download);
        activity.setMessage(message);
        activity.setUser(user.get());
        return activityRepository.save(activity);
    }
    @SneakyThrows
    public Activity addShare(String message , String fileName , String email){
        Optional<User> user = userRepository.findByEmail(email);
        user.orElseThrow(UserNotFoundException::new);
        Activity activity= new Activity();
        activity.setFileName(fileName);
        activity.setStatus(Status.Share);
        activity.setMessage(message);
        activity.setUser(user.get());
        return activityRepository.save(activity);
    }

}
