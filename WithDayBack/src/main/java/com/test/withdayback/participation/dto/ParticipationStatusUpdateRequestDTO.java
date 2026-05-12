package com.test.withdayback.participation.dto;

import com.test.withdayback.participation.enums.ParticipationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("ParticipationStatusUpdateRequest")
public class ParticipationStatusUpdateRequestDTO {
    private String email;
    private ParticipationStatus status;
    private String reason;
}
