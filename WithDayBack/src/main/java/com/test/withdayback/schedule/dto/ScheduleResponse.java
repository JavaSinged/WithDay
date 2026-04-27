package com.test.withdayback.schedule.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

@NoArgsConstructor
@AllArgsConstructor
@Alias("ScheduleResponse")
@Data
public class ScheduleResponse {
    private Long id;
    private String title;
    private String category;
    private String region;
    private int viewCount;
}
