package com.test.withdayback.user.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

import java.time.LocalDateTime;

@Alias("agreement")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAgreement {
    private Long agreementId;

    private User user; // 대상 유저 참조

    private boolean termsAgreed;
    private boolean privacyAgreed;
    private boolean infoAgreed;
    private boolean marketingAgreed;

    private LocalDateTime agreedAt;

    public void prePersist() {
        this.agreedAt = LocalDateTime.now();
    }
}