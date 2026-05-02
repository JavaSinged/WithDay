package com.test.withdayback.user.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Alias("UserTerms")
public class UserTerms {
    private int id;
    private int userId;
    private int termsId;
    private boolean agreed;
    private String agreedAt;
}