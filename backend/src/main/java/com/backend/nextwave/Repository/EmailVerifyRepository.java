package com.backend.nextwave.Repository;

import com.backend.nextwave.Model.Entity.OTP;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface EmailVerifyRepository extends JpaRepository<OTP, Long> {
    OTP findByEmail(String email);

    @Modifying
    @Transactional
  @Query("DELETE FROM OTP o WHERE o.expiryTime<:now")
    void deleteByExpiryTimeBefore(@Param("now") LocalDateTime now);
}