package com.test.withdayback.schedule.controller;

import com.test.withdayback.schedule.dto.DetailScheduleRequestDTO;
import com.test.withdayback.schedule.dto.ScheduleRequestDTO;
import com.test.withdayback.schedule.dto.ScheduleResponseDTO;
import com.test.withdayback.schedule.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/schedules")
@CrossOrigin("*")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    /**
     * 일정 상세 조회
     * @param id
     * @return ResponseEntity
     */
    @GetMapping("/{id}")
    public ResponseEntity<ScheduleResponseDTO> getSchedule(@PathVariable Long id) {
        ScheduleResponseDTO result = scheduleService.getScheduleFullDetails(id);

        if (result == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }

    /**
     * 일정 등록
     * @param postData
     * @param detailSchedule
     * @param images
     * @return result // 1이면 저장 완료, 0이면 실패
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> insertSchedule(
            @RequestPart("postData") ScheduleRequestDTO postData,
            @RequestPart("detailSchedule") List<DetailScheduleRequestDTO> detailSchedule,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {

        try {
            // Service 로직 호출
            int result = scheduleService.insertSchedule(postData, detailSchedule, images);
            return ResponseEntity.ok().body("일정 등록 성공. 일정 ID: " + result);

        } catch (Exception e) {
            System.out.println("일정 등록 실패");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("일정 등록 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
