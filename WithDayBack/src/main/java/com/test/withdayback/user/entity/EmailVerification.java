package com.test.withdayback.user.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

import java.time.LocalDateTime;

@Alias("emailVerification")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailVerification {

    private String email;
    private String code;
    private LocalDateTime expiryDate;
}