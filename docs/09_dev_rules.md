# 14. 비기능 요구사항

## 14.1 성능

- 공개 페이지 LCP 2.5초 이내 목표
- 관리자 주요 페이지 TTI 최소화
- 이미지 lazy load + responsive sources
- 공개 페이지 JS 최소화
- section renderer code splitting

## 14.2 안정성

- 주요 변경 작업은 audit log 필수
- 메시지 발송은 idempotent 처리
- 체크인 중복 처리는 status 기반 제어
- RSVP 중복 제출 방지

## 14.3 접근성

- WCAG AA 수준 목표
- 키보드 접근성
- alt text
- 명확한 대비
- 폼 에러 메시지 접근성

## 14.4 국제화

- locale 기반 페이지/문구 분리
- 날짜/시간/주소/통화 포맷 분리
- ko/en 우선 지원

---

# 15. 개발 규칙

## 15.1 코드 규칙

- TypeScript strict mode 필수
- any 금지
- server/client boundary 명확화
- schema-driven input validation 필수
- DB access는 repository or query layer를 통해서만 수행
- UI 컴포넌트와 도메인 로직 분리
- 함수는 단일 책임 원칙 준수

## 15.2 에러 처리 규칙

- domain error class 정의
- public 에러 메시지와 internal 에러 로그 분리
- observability context 포함

## 15.3 테스트 전략

- schema tests
- repository integration tests
- auth/RLS tests
- public RSVP flow e2e
- check-in flow e2e
- editor publish flow e2e
