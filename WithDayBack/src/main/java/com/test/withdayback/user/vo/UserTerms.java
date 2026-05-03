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
    private Integer id;       // int -> Integer
    private Integer userId;   // int -> Integer
    private Integer termsId;  // int -> Integer
    private boolean agreed;
    private String agreedAt;
}