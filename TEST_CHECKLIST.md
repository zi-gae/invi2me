# invi2me 테스트 체크리스트

> 현재 구현된 기능 기준 (2026-04-06)  
> 구현 완료된 API, 인증, DB 스키마, RBAC 중심으로 작성

---

## 1. 인증 (Auth)

### 1-1. 회원가입 플로우
- [ ] Supabase OAuth (구글) 로그인 시 `/auth/callback` 리다이렉트 처리
- [ ] `createUserAfterSignup` 실행 시 `users` 테이블에 row 생성
- [ ] 회원가입 시 개인 `workspace` 자동 생성 (type: `personal`)
- [ ] 회원가입 시 `workspace_memberships`에 `owner` 역할로 자동 등록
- [ ] 동일 이메일 재가입 시 중복 오류 처리

### 1-2. 로그인 / 세션
- [ ] 로그인 후 세션 쿠키 정상 발급
- [ ] `requireUser()` 유틸이 비인증 요청을 올바르게 차단 (401 반환)
- [ ] 로그아웃 후 세션 만료 확인

---

## 2. RBAC (권한 검증)

### 2-1. 이벤트 권한
- [ ] `event.edit` 권한 없는 사용자가 PATCH `/api/app/events/[eventId]` 요청 시 403
- [ ] `guest.read` 권한 없는 사용자가 GET `/api/app/events/[eventId]/guests` 요청 시 403
- [ ] `guest.write` 권한 없는 사용자가 POST `/api/app/events/[eventId]/guests` 요청 시 403
- [ ] `report.read` 권한 없는 사용자가 GET `/api/app/events/[eventId]/reports` 요청 시 403
- [ ] `owner` 역할은 위 모든 권한 포함 확인

### 2-2. 워크스페이스 격리
- [ ] 다른 워크스페이스 소속 이벤트에 접근 시 403 또는 404
- [ ] 삭제(`deleted_at` 있는) 이벤트에 접근 시 404

---

## 3. 이벤트 API

### 3-1. `GET /api/app/events/[eventId]`
- [ ] 정상 요청 시 이벤트 상세 반환
- [ ] 존재하지 않는 `eventId`로 요청 시 404
- [ ] 응답에 민감 필드(`access_password_hash`) 미포함 확인

### 3-2. `PATCH /api/app/events/[eventId]`
- [ ] `title` 수정 후 DB 반영 확인
- [ ] `status`를 `published`로 변경 후 반영 확인
- [ ] 허용되지 않은 필드를 body에 포함해도 무시 또는 에러 처리
- [ ] Zod 스키마 검증 실패 시 422 반환

---

## 4. 게스트 API

### 4-1. `GET /api/app/events/[eventId]/guests`
- [ ] 게스트 목록 정상 반환
- [ ] 페이지네이션 파라미터(`page`, `limit`) 동작 확인
- [ ] `email`, `phone` 필드 마스킹 처리 확인 (e.g. `ho**@***.com`)
- [ ] `status` 필터 파라미터 동작 확인

### 4-2. `POST /api/app/events/[eventId]/guests`
- [ ] 유효한 게스트 정보로 생성 성공
- [ ] `invitation_token` 자동 생성 및 유니크 확인
- [ ] 필수 필드 누락 시 422 반환
- [ ] 같은 이벤트에서 동일 `invitation_token` 중복 생성 불가 확인

---

## 5. 공개 이벤트 API

### 5-1. `GET /api/public/events/[slug]`
- [ ] 발행(published) 상태 이벤트 정상 반환
- [ ] draft 상태 이벤트 접근 시 404 반환
- [ ] 존재하지 않는 `slug`로 요청 시 404
- [ ] 응답에 `access_password_hash` 등 민감 필드 미포함 확인

### 5-2. `POST /api/public/events/[slug]/rsvp`
- [ ] `attending` 상태로 RSVP 제출 성공
- [ ] `not_attending` 상태로 RSVP 제출 성공
- [ ] 동일 게스트 중복 RSVP 제출 시 `RsvpAlreadySubmittedError` (409)
- [ ] RSVP 마감(`rsvp_closes_at` 경과) 후 제출 시 `RsvpClosedError` (403)
- [ ] `attendance_status` 누락 시 Zod 검증 오류 422
- [ ] 존재하지 않는 `slug`로 RSVP 제출 시 404
- [ ] 제출 후 `rsvp_responses` 테이블에 row 생성 확인
- [ ] `answers_json`, `consents_json` 필드 정상 저장 확인

---

## 6. 리포트 API

### 6-1. `GET /api/app/events/[eventId]/reports`
- [ ] RSVP 요약 통계 정상 반환
  - [ ] `attending_count`
  - [ ] `not_attending_count`
  - [ ] `maybe_count`
  - [ ] `total_responses`
- [ ] 응답 없는 이벤트에서 0 값 정상 반환

---

## 7. Server Actions

### 7-1. `createEventAction`
- [ ] 유효한 input으로 이벤트 생성 성공
- [ ] 생성 시 호출자가 자동으로 `event_memberships`에 `owner` 등록
- [ ] `slug` 자동 생성 및 유니크 확인
- [ ] 동일 `slug` 중복 생성 시 오류 처리

### 7-2. `updateEventAction`
- [ ] 허용된 필드 업데이트 성공
- [ ] `updated_at` 및 `version` 필드 자동 갱신 확인

---

## 8. DB 스키마 무결성

### 8-1. Soft Delete
- [ ] `deleted_at` 설정 후 일반 조회 쿼리에서 제외 확인
- [ ] 이벤트 soft delete 후 API 조회 시 404

### 8-2. 필수 공통 컬럼
- [ ] 신규 row 생성 시 `created_at`, `updated_at` 자동 설정
- [ ] 업데이트 시 `updated_at` 갱신
- [ ] `version` 필드 기본값 1 확인

### 8-3. 민감 데이터
- [ ] `access_password` DB에 bcrypt hash로 저장 확인
- [ ] `account_number_encrypted` 평문 아닌 암호화 값 저장 확인
- [ ] `invitation_token` 32바이트 이상 랜덤 엔트로피 확인

---

## 9. 에러 응답 형식

- [ ] 성공 응답 형식: `{ success: true, data: {...} }`
- [ ] 실패 응답 형식: `{ success: false, error: { code, message } }`
- [ ] 401 — 비인증
- [ ] 403 — 권한 없음
- [ ] 404 — 리소스 없음
- [ ] 409 — 충돌 (중복 RSVP 등)
- [ ] 422 — Zod 검증 실패

---

## 10. 미들웨어

- [ ] `/app/*` 경로 비인증 접근 시 `/login` 리다이렉트
- [ ] `/org/*` 경로 비인증 접근 시 `/login` 리다이렉트
- [ ] `/api/app/*` 비인증 요청 시 401 반환
- [ ] `/api/public/*` 인증 없이 접근 가능 확인

---

## 진행 현황

| 영역 | 총 항목 | 완료 |
|------|---------|------|
| 인증 | 8 | 0 |
| RBAC | 7 | 0 |
| 이벤트 API | 7 | 0 |
| 게스트 API | 8 | 0 |
| 공개 이벤트 API | 10 | 0 |
| 리포트 API | 3 | 0 |
| Server Actions | 6 | 0 |
| DB 스키마 | 7 | 0 |
| 에러 응답 | 7 | 0 |
| 미들웨어 | 4 | 0 |
| **합계** | **67** | **0** |
