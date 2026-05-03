package com.test.withdayback.user.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Alias("User")
public class User {
    private Integer id;       // int -> Integer 로 변경!
    private String email;
    private String password;
    private String provider;
    private String providerId;
    private String nickname;
    private String profileImage;
    private String birthday;
    private Integer gender;   // int -> Integer 로 변경!
    private String phone;
    private String status;
    private String postcode;
    private String address;
    private String detailAddress;
    private Double lat;
    private Double lng;
    private String createdAt;
}