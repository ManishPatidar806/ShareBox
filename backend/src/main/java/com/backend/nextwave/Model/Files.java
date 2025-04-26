package com.backend.nextwave.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity(name = "share_box_file")
public class Files {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, length = 255)
    private long fileSize;

    @Column(nullable = false, length = 255)
    private String fileName;

    @Column(nullable = false)
    private String fileType;

    @Column(nullable = false)
    private String password;

    @Column(length = 2000)
    private String publicUrl;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGBLOB")
    private byte[] fileCode;

    @Lob
    @Column(nullable = false)
    private String encryptKey;

    private String iv;


    @Column(nullable = true, length = 255)
    private String storageUrl;

    @Column(nullable = false)
    private boolean isShared;

    @Column(columnDefinition = "BOOLEAN DEFAULT false")
    private boolean isDelete;

    @Column(columnDefinition = "BOOLEAN DEFAULT false")
    private boolean oneTimeAccess;

    private LocalDate createdDate;

    @Column(nullable = true)
    private LocalDate expiryDate;



    private String email;



}
