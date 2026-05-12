package com.test.withdayback.participation.dto;

import com.test.withdayback.participation.enums.ParticipationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("ParticipationApplicant")
public class ParticipationApplicantDTO {
    private Long participationId;
    private Long scheduleId;
    private Long userId;
    private String email;
    private String nickname;
    private ParticipationStatus status;
    private String createdAt;
}
