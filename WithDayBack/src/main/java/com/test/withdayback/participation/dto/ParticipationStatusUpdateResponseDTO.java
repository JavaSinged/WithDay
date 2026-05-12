package com.test.withdayback.participation.dto;

import com.test.withdayback.participation.enums.ParticipationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

import java.time.OffsetDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("ParticipationStatusUpdateResponse")
public class ParticipationStatusUpdateResponseDTO {
    private Long participationId;
    private Long scheduleId;
    private ParticipationStatus status;
    private Integer currentParticipants;
    private Integer maxParticipants;
    private OffsetDateTime updatedAt;
}
