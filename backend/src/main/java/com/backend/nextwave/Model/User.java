package com.backend.nextwave.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity(name = "share_box_user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true)
    private long id;

//    @Column(nullable = false)
@NotBlank
    private String name;
    @Column(nullable = false , length = 255)
    @NotBlank
    private String Username;
    @Column(nullable = false , length = 255 , unique = true)
    @NotBlank
    private String email;
    @Column(nullable = false , length = 255)
    @NotBlank
    private String password;
    @Column(columnDefinition = "BOOLEAN DEFAULT false")
    private boolean twoFactorEnabled;

    private LocalDate localDate;


}
