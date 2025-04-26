package com.backend.nextwave.Service;

import com.backend.nextwave.DTO.FileUploadRequest;
import com.backend.nextwave.Exception.FileNotFoundException;
import com.backend.nextwave.Model.Files;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
public interface FileService {

    public Files saveFile(MultipartFile file, FileUploadRequest fileUploadRequest, String email) throws Exception;
    public byte[] getDecryptCode(Long fileId) throws Exception;
    public Files deleteFile(long id) throws FileNotFoundException;
    public Optional<Files> getFile(long id);
    public List<Files> getAllFile(String email);
    public Files update(Files files);


}