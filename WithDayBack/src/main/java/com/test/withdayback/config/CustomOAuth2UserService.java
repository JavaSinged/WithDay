package com.test.withdayback.config;

import com.springboot.localandsocialloginback.user.dto.GoogleUserInfo;
import com.springboot.localandsocialloginback.user.dto.OAuth2UserInfo;
import com.springboot.localandsocialloginback.user.entity.User;
import com.springboot.localandsocialloginback.user.repository.UserRepository;
import com.test.withdayback.user.dao.UserDao;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserDao userDao;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String provider = userRequest.getClientRegistration().getRegistrationId();

        // 1. 정보를 파싱하는 로직을 메서드로 분리하여 '확정된 값'을 바로 받음
        OAuth2UserInfo oAuth2UserInfo = getOAuth2UserInfo(provider, oAuth2User.getAttributes());

        String username = provider + "_" + oAuth2UserInfo.getProviderId();

        // 2. 이제 oAuth2UserInfo는 이 시점 이후로 변경되지 않으므로(effectively final) 에러가 나지 않음
        User user = userRepository.findByUsername(username)
                .orElseGet(() -> userRepository.save(User.builder()
                        .username(username)
                        .name(oAuth2UserInfo.getName())
                        .email(oAuth2UserInfo.getEmail())
                        .role("ROLE_USER")
                        .build()));

        return oAuth2User;
    }

    // 정보 추출 로직 전용 메서드
    private OAuth2UserInfo getOAuth2UserInfo(String provider, Map<String, Object> attributes) {
        if (provider.equals("google")) {
            return new GoogleUserInfo(attributes);
        }
        // else if (provider.equals("naver")) { return new NaverUserInfo(attributes); }
        throw new IllegalArgumentException("지원하지 않는 로그인 서비스입니다.");
    }
}