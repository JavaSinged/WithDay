package com.test.withdayback.schedule.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Alias("ScheduleRequest")
@Data
public class ScheduleRequest {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String region;
    private LocalDate startDate;
    private LocalDate endDate;
    private int maxParticipants;
}
