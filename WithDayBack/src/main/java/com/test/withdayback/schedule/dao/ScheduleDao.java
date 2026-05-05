package com.test.withdayback.schedule.dao;

import com.test.withdayback.schedule.vo.Schedule;
import com.test.withdayback.schedule.vo.ScheduleDetail;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ScheduleDao {
    Schedule selectScheduleById(Long id);

    List<ScheduleDetail> selectDetailsByScheduleId(Long id);
}
