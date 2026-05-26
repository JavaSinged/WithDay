package com.test.withdayback.notification.controller;

import com.test.withdayback.common.util.JwtUtil;
import com.test.withdayback.notification.service.NotificationService;
import com.test.withdayback.notification.vo.Notification;
import com.test.withdayback.user.service.UserService;
import com.test.withdayback.user.vo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin("*")
public class NotificationController {
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private UserService userService;

    @GetMapping("/count")
    public ResponseEntity<?> getNotificationCount(
            @RequestHeader("Authorization") String authHeader
    ) {
        User user = resolveAuthorizedUser(authHeader);
        int count = notificationService.getNotificationCount(user.getId());

        return ResponseEntity.ok(count);
    }

    @GetMapping
    public ResponseEntity<?> getNotifications(
            @RequestHeader("Authorization") String authHeader
    ) {
        User user = resolveAuthorizedUser(authHeader);
        List<Notification> notifications =
                notificationService.getNotifications(user.getId());

        return ResponseEntity.ok(notifications);
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<?> readNotification(@PathVariable Long notificationId) {
        notificationService.readNotification(notificationId);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/notification-term")
    public ResponseEntity<?> getNotificationTerm(@RequestHeader("Authorization") String authHeader
    ) {
        User user = resolveAuthorizedUser(authHeader);
        int agreed = notificationService.getNotificationTerm(user.getId());

        return ResponseEntity.ok(agreed);
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long notificationId){
        notificationService.deleteNotification(notificationId);

        return ResponseEntity.ok().build();
    }

    private User resolveAuthorizedUser(String authHeader) {
        if (authHeader == null || authHeader.isBlank() || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authorization 헤더가 올바르지 않습니다.");
        }

        String token = authHeader.substring(7).trim();
        String email = jwtUtil.getEmail(token);
        User user = userService.findByEmail(email);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "토큰에 해당하는 사용자를 찾을 수 없습니다.");
        }

        return user;
    }
}
