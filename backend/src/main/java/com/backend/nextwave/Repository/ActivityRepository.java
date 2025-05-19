package com.backend.nextwave.Repository;

import com.backend.nextwave.Model.Entity.Activity;
import com.backend.nextwave.Model.Enum.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ActivityRepository extends JpaRepository<Activity , Long> {

    Page<Activity> findByStatus(Optional<Status> status , Pageable pageable);

}
