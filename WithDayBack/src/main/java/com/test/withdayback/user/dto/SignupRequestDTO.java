package com.test.withdayback.user.dto;

import com.test.withdayback.user.vo.User;
import com.test.withdayback.user.vo.UserTerms;
import lombok.Data;
import java.util.List;

@Data
public class SignupRequestDTO {
    private User user;
    private List<UserTerms> termsList;
}