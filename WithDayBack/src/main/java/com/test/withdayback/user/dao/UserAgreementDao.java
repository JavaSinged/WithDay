package com.test.withdayback.user.dao;

import com.test.withdayback.user.entity.UserAgreement;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserAgreementDao {
    void save(UserAgreement userAgreement);
}
