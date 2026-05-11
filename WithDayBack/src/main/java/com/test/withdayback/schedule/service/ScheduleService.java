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

@Service
public class ScheduleService {

    private final ScheduleDao scheduleDao;
    private final Cloudinary cloudinary;

    @Autowired
    public ScheduleService(ScheduleDao scheduleDao, Cloudinary cloudinary) {
        this.scheduleDao = scheduleDao;
        this.cloudinary = cloudinary;
    }

    public ScheduleResponseDTO getScheduleFullDetails(Long id) {
        Schedule schedule = scheduleDao.selectScheduleById(id);
        if (schedule == null) return null;

        List<ScheduleDetail> details = scheduleDao.selectDetailsByScheduleId(id);
        List<ScheduleImage> images = scheduleDao.selectImageByScheduleId(id);

        return new ScheduleResponseDTO(schedule, details, images);
    }

    @Transactional(rollbackFor = Exception.class)
    public int insertSchedule(ScheduleRequestDTO postData,
                              List<DetailScheduleRequestDTO> detailSchedule,
                              List<MultipartFile> images) throws IOException {

        // 1. 유저 ID 확인
        Long userId = scheduleDao.findUserIdByEmail(postData.getMemberEmail());
        if (userId == null) {
            throw new RuntimeException("유저 정보를 찾을 수 없습니다.");
        }

        // 2. 이미지 업로드 (Cloudinary) - 썸네일 URL을 먼저 확보하기 위해 최상단에서 수행
        List<String> imageUrls = new ArrayList<>();
        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                if (image != null && !image.isEmpty()) {
                    try {
                        Map uploadParams = ObjectUtils.asMap(
                                "folder", "withday/schedule/images",
                                "use_filename", true,
                                "unique_filename", true
                        );
                        Map uploadResult = cloudinary.uploader().upload(image.getBytes(), uploadParams);
                        imageUrls.add((String) uploadResult.get("secure_url"));
                    } catch (Exception e) {
                        throw new RuntimeException("이미지 업로드 실패: " + e.getMessage());
                    }
                }
            }
        }

        // 3. DTO 데이터를 VO(Schedule)로 변환 (MyBatis ReflectionException 및 TypeException 해결)
        Schedule schedule = new Schedule();
        schedule.setUserId(userId);
        schedule.setTitle(postData.getTitle());
        schedule.setDescription(postData.getDescription());
        schedule.setCategory(postData.getCategory()); // Enum 직접 세팅
        schedule.setRegion(postData.getRegion()+" "+postData.getRegion());
        schedule.setChatLink(postData.getChatLink());
        schedule.setStartDate(postData.getStartDate()); // LocalDateTime
        schedule.setEndDate(postData.getEndDate());
        schedule.setRecruitStartDate(postData.getRecruitStartDate());
        schedule.setRecruitEndDate(postData.getRecruitEndDate());
        schedule.setMinParticipants(postData.getMinParticipants());
        schedule.setMaxParticipants(postData.getMaxParticipants());
        schedule.setAgeMin(postData.getAgeMin());
        schedule.setAgeMax(postData.getAgeMax());
        schedule.setGenderLimit(postData.getGenderLimit()); // Enum
        schedule.setTotalPrice(postData.getTotalPrice());
        schedule.setCostType(postData.getCostType()); // Enum

        // 업로드된 이미지 중 첫 번째를 썸네일로 지정
        if (!imageUrls.isEmpty()) {
            schedule.setThumbnailImage(imageUrls.get(0));
        }

        // 4. 메인 일정 insert (result1)
        // insert 성공 시 useGeneratedKeys에 의해 schedule.getId()에 값이 담깁니다.
        int result1 = scheduleDao.insertSchedule(schedule);
        Long scheduleId = schedule.getId();

        if (scheduleId == null || result1 != 1) {
            throw new RuntimeException("일정 기본 정보 등록 실패");
        }

        // 5. 세부 일정 등록 (result2)
        int result2 = 0;
        int expectedDetailCount = (detailSchedule != null) ? detailSchedule.size() : 0;
        if (expectedDetailCount > 0) {
            result2 = scheduleDao.insertDetailSchedule(scheduleId, detailSchedule);
        }

        // 6. 이미지 경로 리스트 등록 (result3)
        int result3 = 0;
        int expectedImageCount = imageUrls.size();
        if (expectedImageCount > 0) {
            result3 = scheduleDao.insertScheduleImages(scheduleId, imageUrls);
        }

        // 7. 최종 검증
        boolean detailSuccess = (expectedDetailCount == 0) || (result2 >= 1); // bulk insert 특성상 1 이상이면 성공으로 간주하거나 size와 비교
        boolean imageSuccess = (expectedImageCount == 0) || (result3 >= 1);

        if (result1 == 1 && detailSuccess && imageSuccess) {
            return 1;
        } else {
            throw new RuntimeException("데이터 저장 중 불일치가 발생했습니다.");
        }
    }
    
    // 🌟 파라미터를 받아서 Dao로 넘겨주도록 수정
    public List<Schedule> getAllSchedules(String category, String keyword) {
        return scheduleDao.getAllSchedules(category, keyword);
    }
}
