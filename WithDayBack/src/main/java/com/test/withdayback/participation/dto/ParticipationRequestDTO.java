package com.test.withdayback.participation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("ParticipationRequest")
public class ParticipationRequestDTO {
    private Long scheduleId;
    private String email;
}
