package com.test.withdayback.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SignupRequest {
    // 유저 정보
    private String username;
    private String password;
    private String name;
    private String email;
    private String phone;
    private String gender; // MALE, FEMALE
    private String birthDate; // "1995-05-20" -> LocalDate로 변환 필요

    // 약관 동의 정보
    private boolean termsAgreed;
    private boolean privacyAgreed;
    private boolean infoAgreed;
    private boolean marketingAgreed;
}