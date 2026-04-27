package com.test.withdayback.schedule.controller;

import com.test.withdayback.schedule.dto.ScheduleRequest;
import com.test.withdayback.schedule.dto.ScheduleResponse;
import com.test.withdayback.schedule.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/schedules")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    /**
     * 일정 생성
     */
    @PostMapping
    public ResponseEntity<Long> create(@RequestBody ScheduleRequest dto) {
        Long id = scheduleService.createSchedule(dto);
        return ResponseEntity.ok(id);
    }

    /**
     * 일정 목록 조회
     */
    @GetMapping
    public ResponseEntity<
//            List<ScheduleResponse>
            ?
            > list(
//            @RequestParam(required = false) String category,
//            @RequestParam(required = false) String region,
//            @RequestParam(defaultValue = "latest") String sort
    ) {
//        return ResponseEntity.ok(scheduleService.getSchedules(category, region, sort));
    return ResponseEntity.ok("전송완료");
    }

    /**
     * 일정 상세
     */
    @GetMapping("/{id}")
    public ResponseEntity<ScheduleResponse> detail(@PathVariable Long id) {
        return ResponseEntity.ok(scheduleService.getScheduleDetail(id));
    }

    /**
     * 참여 신청
     */
    @PostMapping("/{id}/apply")
    public ResponseEntity<Void> apply(@PathVariable Long id,
                                      @RequestParam Long userId) {
        scheduleService.apply(id, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * 승인
     */
    @PatchMapping("/participations/{id}/approve")
    public ResponseEntity<Void> approve(@PathVariable Long id) {
        scheduleService.approve(id);
        return ResponseEntity.ok().build();
    }

    /**
     * 거절
     */
    @PatchMapping("/participations/{id}/reject")
    public ResponseEntity<Void> reject(@PathVariable Long id) {
        scheduleService.reject(id);
        return ResponseEntity.ok().build();
    }

}
