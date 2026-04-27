package com.test.withdayback.schedule.service;

import com.test.withdayback.schedule.dao.ScheduleDao;
import com.test.withdayback.schedule.dto.ScheduleRequest;
import com.test.withdayback.schedule.dto.ScheduleResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleDao scheduleDao;

    // 일정 생성
    @Transactional
    public Long createSchedule(ScheduleRequest dto) {
        scheduleDao.insertSchedule(dto);
        return dto.getId();
    }

    // 목록 조회
    public List<ScheduleResponse> getSchedules(String category, String region, String sort) {
        return scheduleDao.findSchedules(category, region, sort);
    }

    // 상세 조회
    public ScheduleResponse getScheduleDetail(Long id) {
        scheduleDao.increaseViewCount(id);
        return scheduleDao.findById(id);
    }

    // 참여 신청
    @Transactional
    public void apply(Long scheduleId, Long userId) {
        scheduleDao.insertParticipation(scheduleId, userId);
    }

    // 승인
    @Transactional
    public void approve(Long participationId) {
        scheduleDao.updateParticipationStatus(participationId, "approved");
        scheduleDao.increaseParticipantCount(participationId);
    }

    // 거절
    @Transactional
    public void reject(Long participationId) {
        scheduleDao.updateParticipationStatus(participationId, "rejected");
    }
}
