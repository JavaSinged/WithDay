package com.test.withdayback.user.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/geocode")
public class GeocodeController {

    @Value("${naver.client.id}")
    private String clientId;

    @Value("${naver.client.secret}")
    private String clientSecret;

    @GetMapping
    public ResponseEntity<?> getCoordinate(@RequestParam String address) {
        try {
            // 1. 💡 네이버 API 주소. 파라미터가 들어갈 자리를 {query} 로 비워둡니다.
            String url = "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query={query}";

            // 2. 헤더에 네이버 키 넣기
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-NCP-APIGW-API-KEY-ID", clientId);
            headers.set("X-NCP-APIGW-API-KEY", clientSecret);

            HttpEntity<String> entity = new HttpEntity<>(headers);
            RestTemplate restTemplate = new RestTemplate();

            // 3. 💡 마법이 일어나는 곳!
            // exchange의 맨 마지막 인자로 address를 넘겨주면,
            // 스프링이 알아서 {query} 자리에 한글을 인코딩(UTF-8)해서 쏙 넣어줍니다!
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class, address);
            Map<String, Object> body = response.getBody();

            // 4. 받은 데이터에서 위도, 경도만 쏙쏙 빼내기
            if (body != null && body.get("addresses") != null) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> addresses = (List<Map<String, Object>>) body.get("addresses");

                if (!addresses.isEmpty()) {
                    Map<String, Object> firstAddress = addresses.get(0);
                    double x = Double.parseDouble(firstAddress.get("x").toString()); // 경도(Lng)
                    double y = Double.parseDouble(firstAddress.get("y").toString()); // 위도(Lat)

                    Map<String, Double> result = new HashMap<>();
                    result.put("lat", y);
                    result.put("lng", x);
                    return ResponseEntity.ok(result); // 프론트로 전달!
                }
            }

            return ResponseEntity.badRequest().body("정확한 좌표를 찾을 수 없는 주소입니다.");

        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-NCP-APIGW-API-KEY-ID", clientId);
            headers.set("X-NCP-APIGW-API-KEY", clientSecret);

            // 💡 터미널에 진짜 키값이 들어왔는지 출력해보기!
            System.out.println("=== 네이버 API 요청 키값 확인 ===");
            System.out.println("ID: [" + clientId + "]");
            System.out.println("Secret: [" + clientSecret + "]");
            System.out.println("=================================");

            // 💡 네이버가 인증 실패 등으로 에러를 뱉었을 때, 그 이유를 출력해 줌!
            System.out.println("====== 네이버 API 에러 발생! ======");
            System.out.println("상태 코드: " + e.getStatusCode());
            System.out.println("상세 내용: " + e.getResponseBodyAsString());
            System.out.println("==================================");
            return ResponseEntity.internalServerError().body("네이버 API 연동 에러");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("지오코딩 API 호출 중 알 수 없는 에러 발생");
        }
    }
}