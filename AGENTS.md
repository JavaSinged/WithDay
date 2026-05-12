# WithDay Codex 작업 지침

## 백엔드 검증
- Spring Boot 백엔드는 `WithDayBack`에서 검증한다.
- 테스트 실행 명령:
  - `cd WithDayBack && JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home ./gradlew test`
- `WithDayBack/gradlew`는 실행 권한이 있어야 한다.
- 테스트는 `src/test/resources/application-test.properties`의 H2 메모리 DB 설정을 사용한다.

## 작업 원칙
- 기존에 있는 프론트엔드 변경사항은 건드리지 않는다.
- 민감 정보는 새로 커밋하지 않는다.
- 백엔드 수정 후에는 반드시 테스트 가능 여부를 확인한다.
