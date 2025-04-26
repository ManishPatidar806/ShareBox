package com.backend.nextwave.Service;


import com.backend.nextwave.Model.Activity;
import com.backend.nextwave.Model.User;
import com.backend.nextwave.utils.Status;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface ActivityService {

    public Page<Activity> findAllActivity(Optional<Status> status, int page, int size);
    public Activity addUpload(String message , String fileName , User user);
    public Activity addDownload(String message , String fileName , User user);
    public Activity addShare(String message , String fileName , User user);
}
