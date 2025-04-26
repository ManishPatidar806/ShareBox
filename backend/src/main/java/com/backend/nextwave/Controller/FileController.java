package com.backend.nextwave.Controller;

import com.backend.nextwave.Config.JwtConfig;
import com.backend.nextwave.DTO.FileUploadRequest;
import com.backend.nextwave.DTO.FilesResponse;
import com.backend.nextwave.DTO.GetAllFileResponse;
import com.backend.nextwave.Exception.CommanException;
import com.backend.nextwave.Exception.FileNotFoundException;
import com.backend.nextwave.Exception.UnAuthorizeException;
//import com.backend.nextwave.Helper.CloudinaryService;
import com.backend.nextwave.Helper.EmailFileSharing;
import com.backend.nextwave.Model.Files;
import com.backend.nextwave.Repository.FilesRepository;
import com.backend.nextwave.Service.ActivityService;
import com.backend.nextwave.Service.AuthService;
import com.backend.nextwave.Service.FileService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Validated
@RestController
@RequestMapping("/api")
public class FileController {
    @Autowired
    private FileService fileService;

    @Autowired
    private AuthService authService;

    @Autowired
    private ActivityService activityService;

    @Autowired
    private JwtConfig jwtConfig;

    @Autowired
    private EmailFileSharing emailFileSharing;

//    @Autowired
//    private CloudinaryService cloudinaryService;

    @PostMapping("/uploadFiles")
    public ResponseEntity<FilesResponse> uploadFiles(@RequestHeader("Authorization") String token, @RequestParam("file")  MultipartFile file, @RequestParam("password") @NotBlank String password
    , @RequestParam("oneTimeAccess") boolean oneTimeAccess , @RequestParam("expiryDate")LocalDate expiryDate ) throws UnAuthorizeException {
        FilesResponse response = new FilesResponse();
        if (!jwtConfig.validateToken(token)){
            throw new UnAuthorizeException();
        }
        try {
            String email = jwtConfig.extractEmail(token);
            String originalFileName = file.getOriginalFilename();
            FileUploadRequest fileUploadRequest = new FileUploadRequest();
            fileUploadRequest.setExpiryDate(expiryDate);
            fileUploadRequest.setPassword(password);
            fileUploadRequest.setOneTimeAccess(oneTimeAccess);

            Files files = fileService.saveFile(file, fileUploadRequest,email);
            activityService.addUpload(files.getId() + " Uploaded ", files.getFileName(), authService.extraceUser(token));
            response.setMessage("The file "+files.getFileName()+" has been uploaded successfully.");
            response.setStatus(true);
            response.setFile(files);
        } catch (Exception e) {
            response.setMessage("An error occurred while uploading the file. Please try again later.");
            response.setStatus(false);
        }
        return new ResponseEntity<>(response , HttpStatus.ACCEPTED);
    }

    @GetMapping("/getFiles")
    public ResponseEntity<Files> getFile(@RequestHeader("Authorization") String token ,@RequestParam @NotBlank long id) throws Exception {
        if (!jwtConfig.validateToken(token)){
            throw new UnAuthorizeException();
        }
        FilesResponse response = new FilesResponse();
       Optional<Files> file = fileService.getFile(id);
        if (file.isPresent()) {
            file.get().setFileCode(null);
            response.setFile(file.get());
            response.setMessage("The file has been fetched successfully.");
            response.setStatus(true);
            return ResponseEntity.ok(file.get());
        }
        throw new FileNotFoundException();
    }

    @GetMapping("/getAllFiles")
    public ResponseEntity<GetAllFileResponse> getFile(@RequestHeader("Authorization") String token ) throws Exception {
            if (!jwtConfig.validateToken(token)){
                throw new UnAuthorizeException();
            }
        String email = jwtConfig.extractEmail(token);
        GetAllFileResponse response = new GetAllFileResponse();
        List<Files> file = fileService.getAllFile(email);
            for (Files files : file) {
                files.setFileCode(null);
            }
            response.setFilesList(file);
            response.setMessage("All files have been retrieved successfully.");
            response.setStatus(true);
            return new ResponseEntity<>(response ,HttpStatus.OK);
    }

    @GetMapping("/deleteFiles")
    public ResponseEntity<FilesResponse> deleteFile(@RequestHeader("Authorization") String token ,@RequestParam @NotBlank long id) throws Exception {
        if (!jwtConfig.validateToken(token)){
            throw new UnAuthorizeException();
        }
        FilesResponse response = new FilesResponse();
         Files files =  fileService.deleteFile(id);
        response.setFile(files);
        response.setMessage("The file "+files.getFileName()+"  has been deleted successfully.");
        response.setStatus(false);
        return new ResponseEntity<>(response , HttpStatus.OK);
    }

    @PostMapping("/shareFiles")
    public ResponseEntity<FilesResponse> shareFile(@RequestHeader("Authorization") String token, @RequestParam @NotBlank long id, @RequestParam @NotBlank String link, @RequestParam @NotBlank String email) throws Exception {
        if (!jwtConfig.validateToken(token)){
            throw new UnAuthorizeException();
        }
        FilesResponse response = new FilesResponse();
        Optional<Files> file = fileService.getFile(id);
        if (file.isPresent()) {
            Files foundFile = file.get();
            foundFile.setShared(true);
            fileService.update(foundFile);
            emailFileSharing.sendLinkEmail(email, link, foundFile);
            activityService.addShare(foundFile.getId() + " shared ", foundFile.getFileName(), authService.extraceUser(token));
            response.setMessage("The file "+file.get().getFileName()+"  has been shared successfully.");
            response.setStatus(true);
        return new ResponseEntity<>(response , HttpStatus.ACCEPTED);
        }
        throw new FileNotFoundException();
    }

    @PostMapping("/downloadFile/{id}")
    public ResponseEntity<byte[]> downloadFile(@RequestHeader("Authorization") String token, @PathVariable @NotBlank Long id, @RequestBody @Valid FileUploadRequest fileUploadRequest) throws Exception {
        if (!jwtConfig.validateToken(token)){
            throw new UnAuthorizeException();
        }
        Optional<Files> file = fileService.getFile(id);
        if (file.isPresent()) {
            Files foundFile = file.get();
            if (foundFile.isDelete() || !foundFile.getPassword().equals(fileUploadRequest.getPassword())) {
                throw new UnAuthorizeException();
            }
            if (foundFile.isOneTimeAccess()) {
                foundFile.setDelete(true);
            }
            activityService.addDownload(foundFile.getId() + " Downloaded ", foundFile.getFileName(), authService.extraceUser(token));
            foundFile.setFileCode(fileService.getDecryptCode(foundFile.getId()));
            byte[] fileContent = foundFile.getFileCode();
            String contentType = foundFile.getFileType();
            if (contentType == null || contentType.isEmpty()) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + foundFile.getFileName() + "\"").body(fileContent);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/changeMode")
    public ResponseEntity<FilesResponse> changeShareMode(@RequestHeader("Authorization") String token,@RequestParam @NotBlank long id) throws FileNotFoundException, UnAuthorizeException {
        if (!jwtConfig.validateToken(token)){
            throw new UnAuthorizeException();
        }
        Optional <Files> files = fileService.getFile(id);
        if(files.isPresent()){
            files.get().setShared(!files.get().isShared());
        FilesResponse response = new FilesResponse();
        response.setStatus(true);
        response.setMessage("The sharing mode has been updated successfully.");
        response.setFile(files.get());
        return new ResponseEntity<>(response , HttpStatus.OK);
        }else{
            throw new FileNotFoundException();
        }
    }


}
