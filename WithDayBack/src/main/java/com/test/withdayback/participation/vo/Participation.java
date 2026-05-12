package com.test.withdayback.participation.vo;

import com.test.withdayback.participation.enums.ParticipationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("Participation")
public class Participation {
    private Long id;
    private Long userId;
    private Long scheduleId;
    private ParticipationStatus status;
    private String createdAt;
}
