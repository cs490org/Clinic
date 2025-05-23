package com.cs490.group4.demo.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Random;

@Service
public class CloudStorageService {

    private final Storage storage;

    // TODO: you can use random image names, but I prefer to use an id for the related entity in case the image uri is lost at some point you can search the bucket by that entities' id
    private final Random random = new Random();

    @Value("${gcp.bucket.media}")
    private String imageBucket;

    public CloudStorageService() throws IOException {
        this.storage = StorageOptions.newBuilder()
                .setCredentials(GoogleCredentials.getApplicationDefault())
                .build()
                .getService();
    }

    public ResponseEntity<String> uploadImage(String imageName, MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty");
        }

        try {
            BlobId blobId = BlobId.of(imageBucket, imageName);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(file.getContentType()).build();

            Blob blob = storage.create(blobInfo, file.getBytes());

            return ResponseEntity.ok(blob.getMediaLink());

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading image");
        }
    }


    // throws error if deletion is not successful.
    public void deleteImage(String fullPublicImageUrl) {

        // extract object name from full url
        String objectName = fullPublicImageUrl.substring(fullPublicImageUrl.lastIndexOf('/') + 1);
        objectName = objectName.substring(0,objectName.indexOf('?'));

        BlobId blobId = BlobId.of(imageBucket, objectName);

        boolean deleted = storage.delete(blobId);
        if (!deleted) {
            throw new RuntimeException("Error deleting image");
        }

    }



}