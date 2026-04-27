package com.test.withdayback.schedule.dao;

import com.test.withdayback.schedule.dto.ScheduleRequest;
import com.test.withdayback.schedule.dto.ScheduleResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ScheduleDao {
    // 일정
    void insertSchedule(ScheduleRequest dto);

    List<ScheduleResponse> findSchedules(
            @Param("category") String category,
            @Param("region") String region,
            @Param("sort") String sort
    );

    ScheduleResponse findById(Long id);

    void increaseViewCount(Long id);

    // 참여
    void insertParticipation(@Param("scheduleId") Long scheduleId,
                             @Param("userId") Long userId);

    void updateParticipationStatus(@Param("id") Long id,
                                   @Param("status") String status);

    void increaseParticipantCount(Long participationId);
}
