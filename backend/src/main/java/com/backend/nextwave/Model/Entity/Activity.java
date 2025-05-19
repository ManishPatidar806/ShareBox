package com.backend.nextwave.Model.Entity;

import com.backend.nextwave.Model.Enum.Status;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private Status status;

    private String message;


    private LocalDate createdDate;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id" , nullable = false)
    private User user;


}