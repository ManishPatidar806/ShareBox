package com.backend.nextwave.Controller;

import com.backend.nextwave.Config.JwtConfig;
import com.backend.nextwave.DTO.FileUploadRequest;
import com.backend.nextwave.DTO.FilesResponse;
import com.backend.nextwave.DTO.GetAllFileResponse;
import com.backend.nextwave.Exception.FileNotFoundException;
import com.backend.nextwave.Exception.UnAuthorizeException;
import com.backend.nextwave.Helper.EmailFileSharing;
import com.backend.nextwave.Model.Entity.Files;
import com.backend.nextwave.Service.ActivityService;
import com.backend.nextwave.Service.FileService;
import com.backend.nextwave.Service.UserDetail;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    private final FileService fileService;


    private final ActivityService activityService;


    private final JwtConfig jwtConfig;


    private final EmailFileSharing emailFileSharing;

    public FileController(FileService fileService, ActivityService activityService, JwtConfig jwtConfig, EmailFileSharing emailFileSharing) {
        this.fileService = fileService;

        this.activityService = activityService;
        this.jwtConfig = jwtConfig;
        this.emailFileSharing = emailFileSharing;
    }

    @PostMapping("/uploadFiles")
    public ResponseEntity<FilesResponse> uploadFiles(@AuthenticationPrincipal UserDetail userDetail,
                                                     @RequestParam("file") MultipartFile file, @RequestParam("password") @NotBlank String password
    , @RequestParam("oneTimeAccess") boolean oneTimeAccess , @RequestParam("expiryDate")LocalDate expiryDate ) throws UnAuthorizeException {
        FilesResponse response = new FilesResponse();

        try {
            String email = userDetail.getUsername();
            String originalFileName = file.getOriginalFilename();
            FileUploadRequest fileUploadRequest = new FileUploadRequest();
            fileUploadRequest.setExpiryDate(expiryDate);
            fileUploadRequest.setPassword(password);
            fileUploadRequest.setOneTimeAccess(oneTimeAccess);

            Files files = fileService.saveFile(file, fileUploadRequest,email);
            activityService.addUpload(files.getId() + " Uploaded ", files.getFileName(), email);
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
    public ResponseEntity<Files> getFile(@RequestParam @NotNull long id) throws Exception {

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
    public ResponseEntity<GetAllFileResponse> getFile( @AuthenticationPrincipal UserDetail userDetail) throws Exception {

        String email = userDetail.getUsername();
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
    public ResponseEntity<FilesResponse> deleteFile(@RequestParam @NotNull long id) throws Exception {

        FilesResponse response = new FilesResponse();
         Files files =  fileService.deleteFile(id);
        response.setFile(files);
        response.setMessage("The file "+files.getFileName()+"  has been deleted successfully.");
        response.setStatus(false);
        return new ResponseEntity<>(response , HttpStatus.OK);
    }

    @PostMapping("/shareFiles")
    public ResponseEntity<FilesResponse> shareFile(@AuthenticationPrincipal UserDetail userDetail, @RequestParam @NotNull long id, @RequestParam @NotBlank String link, @RequestParam @NotBlank String email) throws Exception {

        FilesResponse response = new FilesResponse();
        Optional<Files> file = fileService.getFile(id);
        if (file.isPresent()) {
            Files foundFile = file.get();
            foundFile.setShared(true);
            fileService.update(foundFile);
            emailFileSharing.sendLinkEmail(email, link, foundFile);
            activityService.addShare(foundFile.getId() + " shared ", foundFile.getFileName(), userDetail.getUsername());
            response.setMessage("The file "+file.get().getFileName()+"  has been shared successfully.");
            response.setStatus(true);
        return new ResponseEntity<>(response , HttpStatus.ACCEPTED);
        }
        throw new FileNotFoundException();
    }

    @PostMapping("/downloadFile/{id}")
    public ResponseEntity<byte[]> downloadFile(@AuthenticationPrincipal UserDetail userDetail, @PathVariable @NotNull Long id, @RequestBody @Valid FileUploadRequest fileUploadRequest) throws Exception {

        Optional<Files> file = fileService.getFile(id);
        if (file.isPresent()) {
            Files foundFile = file.get();
            if (foundFile.isDelete() || !foundFile.getPassword().equals(fileUploadRequest.getPassword())) {
                throw new UnAuthorizeException();
            }
            if (foundFile.isOneTimeAccess()) {
                foundFile.setDelete(true);
            }
            activityService.addDownload(foundFile.getId() + " Downloaded ", foundFile.getFileName(), userDetail.getUsername());
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
    public ResponseEntity<FilesResponse> changeShareMode(@RequestParam @NotNull long id) throws FileNotFoundException, UnAuthorizeException {

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
