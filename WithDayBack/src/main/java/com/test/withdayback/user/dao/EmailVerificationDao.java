package com.test.withdayback.user.dao;

import com.test.withdayback.user.entity.EmailVerification;
import org.apache.ibatis.annotations.Mapper;

import java.util.Optional;

@Mapper
public interface EmailVerificationDao {
    void save(EmailVerification verification);

    Optional<EmailVerification> findById(String email);

    void deleteById(String email);
}
