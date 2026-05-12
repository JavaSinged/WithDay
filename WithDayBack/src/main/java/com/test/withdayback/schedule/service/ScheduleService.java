package com.test.withdayback.schedule.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.test.withdayback.schedule.dao.ScheduleDao;
import com.test.withdayback.schedule.dto.DetailScheduleRequestDTO;
import com.test.withdayback.schedule.dto.ScheduleRequestDTO;
import com.test.withdayback.schedule.dto.ScheduleResponseDTO;
import com.test.withdayback.schedule.vo.Schedule;
import com.test.withdayback.schedule.vo.ScheduleDetail;
import com.test.withdayback.schedule.vo.ScheduleImage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.test.withdayback.schedule.enums.CostType;

@Service
public class ScheduleService {

    @Autowired
    private final ScheduleDao scheduleDao;

    @Autowired
    private Cloudinary cloudinary;

    public ScheduleService(ScheduleDao scheduleDao) {
        this.scheduleDao = scheduleDao;
    }

    public ScheduleResponseDTO getScheduleFullDetails(Long id) {
        // 1. 일정 기본 정보 조회
        Schedule schedule = scheduleDao.selectScheduleById(id);

        if (schedule == null) return null;

        // 2. 세부 계획 리스트 조회
        List<ScheduleDetail> details = scheduleDao.selectDetailsByScheduleId(id);

        // 3. 이미지 리스트 조회
        List<ScheduleImage> images = scheduleDao.selectImageByScheduleId(id);

        // 3. 조립
        return new ScheduleResponseDTO(schedule, details, images);
    }

    @Transactional
    public int insertSchedule(ScheduleRequestDTO postData,
                              List<DetailScheduleRequestDTO> detailSchedule,
                              List<MultipartFile> images) throws IOException {

        return 0;
    }
}
