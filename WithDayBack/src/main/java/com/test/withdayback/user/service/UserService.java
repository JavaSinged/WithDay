package com.test.withdayback.user.service;

import com.test.withdayback.user.dao.UserDao;
import com.test.withdayback.user.dto.SignupRequestDTO;
import com.test.withdayback.user.vo.User;
import com.test.withdayback.user.vo.UserTerms;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserDao userDao;

    @Transactional
    public String signup(SignupRequestDTO requestDTO) {
        User user = requestDTO.getUser();

        user.setStatus("active");
        userDao.insertUser(user);

        if(requestDTO.getTermsList() != null) {
            for(UserTerms terms : requestDTO.getTermsList()) {
                terms.setUserId(user.getId());
                userDao.insertUserTerms(terms);
            }
        }
        return "회원가입이 완료되었습니다.";
    }

    public String login(String email, String password) {
        User user = userDao.findByEmail(email);

        if (user == null) {
            throw new IllegalArgumentException("존재하지 않는 이메일입니다.");
        }

        if (!user.getPassword().equals(password)) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return "여기에_생성된_JWT_토큰이_들어갑니다";
    }
}