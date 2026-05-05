package com.test.withdayback.user.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils; // 💡 팀장님 코드에 있던 유틸!
import com.test.withdayback.common.util.JwtUtil;
import com.test.withdayback.user.dao.UserDao;
import com.test.withdayback.user.dto.SignupRequestDTO;
import com.test.withdayback.user.vo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // 💡 FileUtil 대신 Cloudinary를 주입받아!
    @Autowired
    private Cloudinary cloudinary;

    public String signup(SignupRequestDTO signupRequest, MultipartFile profileFile) {
        try {
            User user = signupRequest.getUser();

            // ==================================================
            // 💡 팀장님의 Cloudinary 로직을 프로필 이미지에 적용!
            // ==================================================
            if (profileFile != null && !profileFile.isEmpty()) {
                // 1. 업로드 설정 (폴더명을 우리 프로젝트에 맞게 'withday/profiles'로 바꿈)
                Map uploadParams = ObjectUtils.asMap(
                        "folder", "withday/profiles",
                        "use_filename", true,
                        "unique_filename", true
                );

                // 2. Cloudinary로 업로드 슛!
                Map uploadResult = cloudinary.uploader().upload(profileFile.getBytes(), uploadParams);

                // 3. 업로드된 결과에서 안전한 URL (https://...) 추출
                String profileImageUrl = (String) uploadResult.get("secure_url");

                // 4. DB에 저장될 User 객체에 URL 세팅
                user.setProfileImage(profileImageUrl);
            }

            // 2. 비밀번호 암호화
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            // 3. DB 저장
            userDao.insertUser(user);
            return "success";

        } catch (IOException e) {
            throw new RuntimeException("Cloudinary 프로필 사진 저장 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // login 메서드는 아까 짰던 코드 (Map 리턴하는 방식) 그대로 유지!
    public Map<String, Object> login(String email, String rawPassword) {
        User dbUser = userDao.findByEmail(email);
        if (dbUser == null || !passwordEncoder.matches(rawPassword, dbUser.getPassword())) {
            return null;
        }

        String token = jwtUtil.createToken(dbUser.getEmail(), dbUser.getNickname());

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("token", token);

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("email", dbUser.getEmail());
        userInfo.put("nickname", dbUser.getNickname());
        userInfo.put("birthday", dbUser.getBirthday());
        userInfo.put("gender", dbUser.getGender());
        userInfo.put("postcode", dbUser.getPostcode());

        responseData.put("user", userInfo);
        return responseData;
    }
}