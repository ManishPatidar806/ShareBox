package com.backend.nextwave.Repository;

import com.backend.nextwave.Model.Files;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FilesRepository extends JpaRepository<Files ,Long> {
List<Files> findByEmail(String email);
}
