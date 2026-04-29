package com.test.withdayback.user.entity;

import lombok.*;
import org.apache.ibatis.type.Alias;

import java.time.LocalDate;

@Alias("user")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long userId;
    private String username;

    // 소셜 로그인 유저는 비밀번호가 없으므로 nullable = true (기본값임)
    private String password;

    private String name;
    private String email;

    // 소셜 로그인 시 없을 수 있는 정보들은 명시적으로 nullable하게 둡니다.
    private String phone;

    private String role;

    private Gender gender;

    private LocalDate birthDate;

    // 1:1 관계 설정 (양방향)
    // 소셜 로그인 시 agreement가 없어도 가입되게 하려면
    // 저장 로직(Service)에서 null 처리를 잘 해주어야 합니다.
    private UserAgreement agreement;

    public enum Gender {MALE, FEMALE}
}