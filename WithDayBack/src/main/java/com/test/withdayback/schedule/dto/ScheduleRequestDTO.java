package com.test.withdayback.schedule.dto;

import com.test.withdayback.schedule.enums.CostType;
import com.test.withdayback.schedule.enums.GenderLimit;
import com.test.withdayback.schedule.enums.ScheduleCategory;
import com.test.withdayback.schedule.vo.Schedule;
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
    private Long id;

    private Long userId;
    private String memberEmail;

    private String title;
    private String description;
    private ScheduleCategory category;

    private String region;
    private String detailRegion;

    private String chatLink;

    private String startDate;
    private String endDate;

    private String recruitStartDate;
    private String recruitEndDate;

    private Integer minParticipants;
    private Integer maxParticipants;

    private Integer ageMin;
    private Integer ageMax;

    private GenderLimit genderLimit;

    private Integer totalPrice;
    private CostType costType;
}
