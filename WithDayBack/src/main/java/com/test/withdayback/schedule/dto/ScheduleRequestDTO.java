package com.test.withdayback.schedule.dto;

import com.test.withdayback.schedule.enums.CostType;
import com.test.withdayback.schedule.enums.GenderLimit;
import jdk.jfr.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

import java.time.LocalDateTime;


@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("ScheduleRequest")
public class ScheduleRequestDTO {
    private String email;
    private String title;
    private String description;
    private Category category;      // travel, popup 등 영문 문자열
    private String region;
    private String detailRegion;
    private String chatLink;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime recruitEndDate;
    private Integer minParticipants;
    private Integer maxParticipants;
    private Integer ageMin;
    private Integer ageMax;
    private GenderLimit genderLimit;   // all, male, female
    private Integer totalPrice;
    private CostType costType;      // per_person, free 등
}