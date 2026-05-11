package com.test.withdayback.schedule.controller;

import com.test.withdayback.schedule.dto.DetailScheduleRequestDTO;
import com.test.withdayback.schedule.dto.ScheduleRequestDTO;
import com.test.withdayback.schedule.dto.ScheduleResponseDTO;
import com.test.withdayback.schedule.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/schedules")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping("/{id}")
    public ResponseEntity<ScheduleResponseDTO> getSchedule(@PathVariable Long id) {
        ScheduleResponseDTO result = scheduleService.getScheduleFullDetails(id);
        if (result == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping(value = "/insert-schedule", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> insertSchedule(
            @RequestPart("postData") ScheduleRequestDTO postData,
            @RequestPart("detailSchedule") List<DetailScheduleRequestDTO> detailSchedule,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        System.out.println("=== 컨트롤러 도달 ===");
        System.out.println("postData: " + postData);
        System.out.println("detailSchedule: " + detailSchedule);
        System.out.println("images: " + images);

        try {
            int result = scheduleService.insertSchedule(postData, detailSchedule, images);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}