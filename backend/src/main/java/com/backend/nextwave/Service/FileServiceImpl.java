package com.backend.nextwave.Service;

import com.backend.nextwave.utils.Encrypt;
import com.backend.nextwave.DTO.FileUploadRequest;
import com.backend.nextwave.Exception.FileNotFoundException;

import com.backend.nextwave.Model.Entity.Files;
import com.backend.nextwave.Repository.FilesRepository;
import com.backend.nextwave.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.SecretKey;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class FileServiceImpl implements FileService{
//    @Autowired
//    private CloudinaryService cloudinaryService;


    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FilesRepository fileRepository;

    public Files saveFile(MultipartFile file, FileUploadRequest fileUploadRequest,String email) throws Exception {
        Files files = new Files();
        byte[] filesBytes = file.getBytes();
        SecretKey secretKey =  Encrypt.generateAESKey();
        byte[] iv = new byte[16];
        new SecureRandom().nextBytes(iv);
        byte[] encryptedData = Encrypt.encrypt(filesBytes, secretKey, iv);
        files.setFileCode( encryptedData);
        files.setFileName(file.getOriginalFilename());
        files.setFileType(file.getContentType());
        files.setFileSize(file.getSize());
        files.setCreatedDate(LocalDate.now());
        files.setEncryptKey(Encrypt.encodeKey(secretKey));
        files.setIv(Base64.getEncoder().encodeToString(iv));
        files.setExpiryDate(fileUploadRequest.getExpiryDate());
        files.setPassword(fileUploadRequest.getPassword());
        files.setOneTimeAccess(fileUploadRequest.isOneTimeAccess());
        files.setEmail(email);
//        String publicUrl = cloudinaryService.uploadImage(file);
//        files.setPublicUrl(publicUrl);
        return fileRepository.save(files);
    }

    public byte[] getDecryptCode(Long fileId) throws Exception {
        Optional<Files> files = fileRepository.findById(fileId);

        if (files.isPresent()) {
            // Decode stored key & IV
            SecretKey secretKey = Encrypt.decodeKey(files.get().getEncryptKey());
            byte[] iv = Base64.getDecoder().decode(files.get().getIv());

            // Decrypt the file data
            return Encrypt.decrypt(files.get().getFileCode(), secretKey, iv);
        }
        return null;
    }

    public Files deleteFile(long id) throws FileNotFoundException {
        Optional<Files> files = fileRepository.findById(id);
        if (files.isEmpty()) {
            throw new FileNotFoundException();
        }
        fileRepository.deleteById(id);
        return files.get();
    }

    public Optional<Files> getFile(long id){

        return fileRepository.findById(id);
    }
    public List<Files> getAllFile(String email){
        return fileRepository.findByEmail(email);

    }
    public Files update(Files files){
        return fileRepository.save(files);
    }





}
