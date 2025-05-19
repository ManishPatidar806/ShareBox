package com.backend.nextwave.Service;


import com.backend.nextwave.Model.Entity.Activity;
import com.backend.nextwave.Model.Entity.User;
import com.backend.nextwave.Model.Enum.Status;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface ActivityService {

    public Page<Activity> findAllActivity(Optional<Status> status, int page, int size);
    public Activity addUpload(String message , String fileName , String user);
    public Activity addDownload(String message , String fileName , String user);
    public Activity addShare(String message , String fileName , String user);
}
