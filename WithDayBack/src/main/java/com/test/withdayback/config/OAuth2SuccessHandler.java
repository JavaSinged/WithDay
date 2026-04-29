package com.test.withdayback.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;

    // 생성자에 @Lazy를 추가하여 순환 참조의 고리를 늦게 연결하도록 합니다.
    public OAuth2SuccessHandler(@Lazy JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        // 1. 로그인에 성공한 유저 정보를 가져옴
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // 2. CustomOAuth2UserService에서 설정한 username 형식을 가져옴 (google_xxxx...)
        // 구글의 경우 "sub" 키가 고유 식별자입니다.
        String provider = "google"; // 현재는 구글만 하니까 고정, 나중에 확장 가능
        String providerId = oAuth2User.getAttribute("sub");
        String username = provider + "_" + providerId;

        // 3. JWT 토큰 발행
        String token = jwtTokenProvider.createToken(username);

        // 4. 프론트엔드 리다이렉트 (쿼리 파라미터로 토큰 전달)
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/oauth2/redirect")
                .queryParam("token", token)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}