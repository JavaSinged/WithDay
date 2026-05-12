package com.test.withdayback.user.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.test.withdayback.common.util.EmailSender;
import com.test.withdayback.common.util.JwtUtil;
import com.test.withdayback.user.dao.UserDao;
import com.test.withdayback.user.dto.SignupRequestDTO;
import com.test.withdayback.user.vo.Terms;
import com.test.withdayback.user.vo.User;
import com.test.withdayback.user.vo.UserTerms;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class UserService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private EmailSender emailSender;

    // 💡 제한할 나이 설정
    private static final int MIN_AGE = 18;

    @Transactional
    public String signup(SignupRequestDTO signupRequest, MultipartFile profileFile) {
        try {
            User user = signupRequest.getUser();

            // 백엔드 나이 검증: 프론트 우회 가입 방지 (만 나이 계산)
            if (user.getBirthday() != null && !user.getBirthday().isEmpty()) {
                LocalDate birthDate = LocalDate.parse(user.getBirthday(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                LocalDate currentDate = LocalDate.now();
                int age = Period.between(birthDate, currentDate).getYears();

                if (age < MIN_AGE) {
                    throw new RuntimeException("만 " + MIN_AGE + "세 이상만 가입할 수 있습니다.");
                }
            }

            user.setProvider("local");
            user.setProviderId("");

            // 1. 프로필 이미지 Cloudinary 업로드
            if (profileFile != null && !profileFile.isEmpty()) {
                Map uploadParams = ObjectUtils.asMap(
                        "folder", "withday/profiles", "use_filename", true, "unique_filename", true);
                Map uploadResult = cloudinary.uploader().upload(profileFile.getBytes(), uploadParams);
                user.setProfileImage((String) uploadResult.get("secure_url"));
            }

            // 💡 이메일 중복 체크 로직 추가 (DB에 저장하기 직전에 확인합니다)
            User existingUser = userDao.findByEmail(user.getEmail());
            if (existingUser != null) {
                // 이미 DB에 같은 이메일이 있다면 에러를 던져서 가입을 막습니다.
                throw new RuntimeException("이미 해당 이메일로 가입된 계정이 존재합니다.");
            }

            // 2. 유저 정보 저장
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userDao.insertUser(user);

            // 3. 약관 동의 내역 저장
            Map<String, Boolean> terms = signupRequest.getTerms();
            if (terms != null && user.getId() != null) {
                for (Map.Entry<String, Boolean> entry : terms.entrySet()) {
                    UserTerms userTerms = new UserTerms();

                    userTerms.setUserId(((Number) user.getId()).longValue());

                    Long termsId = 0L;
                    switch (entry.getKey()) {
                        case "TOS":
                            termsId = 1L;
                            break;
                        case "PRIVACY":
                            termsId = 2L;
                            break;
                        case "MARKETING":
                            termsId = 3L;
                            break;
                    }

                    userTerms.setTermsId(termsId);
                    userTerms.setAgreed(entry.getValue());

                    userDao.insertUserTerms(userTerms);
                }
            }
            return "success";

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
    }

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

    // 💡 구글 로그인 & 자동 회원가입 로직
    @Transactional
    public Map<String, Object> googleLogin(Map<String, String> googleData) {
        String email = googleData.get("email");
        User dbUser = userDao.findByEmail(email);

        // 1. DB에 해당 이메일이 없다면? -> 구글 정보로 즉시 회원가입 진행
        // (여기는 중복 체크가 아니라, 회원이 없을 때만 가입시키는 로직이므로 기존 코드 그대로 유지합니다)
        if (dbUser == null) {
            dbUser = new User();
            dbUser.setEmail(email);
            dbUser.setNickname(googleData.get("nickname"));
            dbUser.setProvider("google");
            dbUser.setProviderId(googleData.get("providerId"));
            dbUser.setProfileImage(googleData.get("profileImage"));

            // 소셜 로그인은 비밀번호를 안 쓰지만, DB 규칙을 위해 랜덤 비밀번호 암호화 저장
            dbUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));

            // 구글에서 제공하지 않는 빈 값들 초기화 방어
            dbUser.setBirthday("");
            dbUser.setGender(0);
            dbUser.setPhone("");
            dbUser.setPostcode("");
            dbUser.setAddress("");
            dbUser.setDetailAddress("");

            userDao.insertUser(dbUser);
        }

        // 2. 가입된(혹은 방금 가입한) 유저 정보로 JWT 토큰 발급
        String token = jwtUtil.createToken(dbUser.getEmail(), dbUser.getNickname());

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("token", token);

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("email", dbUser.getEmail());
        userInfo.put("nickname", dbUser.getNickname());
        userInfo.put("birthday", dbUser.getBirthday());
        userInfo.put("gender", dbUser.getGender());
        userInfo.put("postcode", dbUser.getPostcode());
        userInfo.put("profileImage", dbUser.getProfileImage());

        responseData.put("user", userInfo);
        return responseData;
    }

    public List<Terms> getAllTerms() {
        return userDao.getAllTerms();
    }

    // 이메일 인증 발송
    public String sendVerificationEmail(String receiverEmail) {
        Random r = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            int flag = r.nextInt(3);
            if (flag == 0) sb.append(r.nextInt(10));
            else if (flag == 1) sb.append((char) (r.nextInt(26) + 65));
            else sb.append((char) (r.nextInt(26) + 97));
        }
        String authCode = sb.toString();

        String emailTitle = "[WithDay] 회원가입 이메일 인증번호입니다.";
        String emailContent = "<h1>안녕하세요. WithDay 입니다.</h1>"
                + "<h3>인증번호는 [ <b style='color:#007BFF;'>" + authCode + "</b> ] 입니다.</h3>"
                + "<h3>화면으로 돌아가 인증번호를 입력해 주세요.</h3>";

        emailSender.sendMail(emailTitle, receiverEmail, emailContent);

        return authCode;
    }
}