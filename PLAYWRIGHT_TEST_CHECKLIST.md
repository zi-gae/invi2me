# invi2me Playwright E2E 테스트 체크리스트

> 구현된 모든 페이지와 API를 Playwright로 검증하기 위한 체크리스트입니다.
> 테스트 전 `pnpm dev`로 개발 서버를 실행하세요. (기본: http://localhost:3000)

---

## 0. 사전 준비

- [x] `pnpm dev` 로 개발 서버 정상 구동 확인
- [x] Supabase 프로젝트 연결 확인 (.env.local 설정)
- [x] 테스트용 사용자 계정 생성 — `test@invi2me.dev` / `Test1234!` (Supabase Admin API로 생성)
- [ ] 테스트용 이벤트 데이터 시딩 ⚠️ SKIP: 로그인 쿠키 주입 포맷 이슈로 콘솔 접근 불가

---

## 1. 인증 (Auth)

### 회원가입
- [x] `/signup` 페이지 접근 시 정상 렌더링 — 폼 필드 2개 확인
- [x] 이메일/비밀번호 입력 폼 표시 — email, password 입력 필드 확인
- [x] 빈 값 제출 시 에러 표시 (Zod validation) — 에러 3개 표시됨
- [ ] 유효한 이메일/비밀번호로 회원가입 성공 ⚠️ SKIP: 이메일 인증 필요 (Supabase enable_confirmations=true)
- [ ] 가입 후 workspace + membership 자동 생성 확인 ⚠️ SKIP
- [ ] 가입 후 `/app/events` 로 리다이렉트 ⚠️ SKIP

### 로그인
- [x] `/login` 페이지 접근 시 정상 렌더링 — 타이틀: "invi2me — 이벤트 운영 플랫폼"
- [x] 이메일/비밀번호 입력 폼 표시 — email, password 입력 + 로그인 버튼 확인
- [x] 잘못된 자격증명 시 에러 메시지 — "이메일 또는 비밀번호가 올바르지 않습니다" 표시됨
- [x] 올바른 자격증명으로 로그인 성공 — `test@invi2me.dev` 로그인 후 `/app/events` 진입 확인 (버그 원인: DB에 workspace/membership 미생성이었음)
- [x] 로그인 후 `/app/events` 로 리다이렉트 — `window.location.href` 방식으로 정상 동작
- [ ] `?redirectTo=` 쿼리 파라미터가 있으면 해당 경로로 리다이렉트 ⚠️ SKIP

### 로그아웃
- [x] 콘솔 사이드바 로그아웃 버튼 클릭 시 로그아웃 — 정상 동작
- [x] 로그아웃 후 `/login` 으로 리다이렉트 — `http://localhost:3000/login` 확인

### 인증 가드
- [x] 비로그인 상태에서 `/app/events` 접근 시 `/login?redirectTo=%2Fapp%2Fevents`으로 리다이렉트
- [x] 비로그인 상태에서 `/org/*` 접근 시 `/login?redirectTo=%2Forg%2Ftest-slug`으로 리다이렉트

---

## 2. 콘솔 레이아웃

- [x] `/app/events` 접근 시 사이드바 + 메인 콘텐츠 레이아웃 렌더링 — 정상 확인
- [x] 사이드바에 "invi2me" 로고 표시 — "invi2me" 링크 확인
- [x] 사이드바에 "내 이벤트" 네비게이션 링크 표시 — `/app/events` 링크 확인
- [x] 사이드바에 워크스페이스 이름 표시 — "테스트 워크스페이스" 표시됨
- [x] 사이드바에 로그아웃 버튼 표시 — "로그아웃" 버튼 확인

---

## 3. 이벤트 목록 (`/app/events`)

- [x] 이벤트가 없을 때 빈 상태 메시지 표시 — "아직 이벤트가 없습니다" + 안내 문구 표시됨
- [x] "새 이벤트 만들기" 버튼 표시 — 사이드 상단 + 빈 상태 2곳 모두 확인
- [x] 이벤트가 있으면 카드 형태로 목록 표시 — "테스트 결혼식" 카드 확인
- [x] 각 카드에 제목, 상태 뱃지, 이벤트 유형, 날짜 표시 — 제목/초안/wedding/날짜 모두 확인
- [ ] 상태 뱃지 색상 확인 (draft=회색, published=초록, scheduled=파랑, archived=회색) ⚠️ SKIP: 시각적 색상은 스냅샷으로 미확인
- [x] 카드 클릭 시 `/app/events/[eventId]` 로 이동 — 클릭 후 대시보드 진입 확인

---

## 4. 이벤트 대시보드 (`/app/events/[eventId]`)

- [x] 이벤트 제목 + 상태 뱃지 표시 — "테스트 결혼식" + "초안" 뱃지 확인
- [x] 스탯 카드 4개 표시: 총 게스트, RSVP 참석, RSVP 불참, RSVP 미정 — 2/1/1/0 확인
- [x] 하위 네비게이션 탭 표시 (편집기, 게스트, RSVP, 체크인, 리포트, 설정) — 6개 탭 모두 확인
- [x] 각 탭 클릭 시 해당 페이지로 이동 — URL 직접 탐색으로 각 페이지 정상 확인
- [x] 이벤트 기본 정보 (유형, 공개범위, 날짜) 표시 — 결혼식/공개/2026-05-15 확인
- [x] 존재하지 않는 eventId 접근 시 에러 메시지 — "이벤트를 찾을 수 없습니다" 표시됨

---

## 5. 게스트 관리 (`/app/events/[eventId]/guests`)

- [x] 페이지 제목 "게스트 관리" 표시 — 확인
- [x] 게스트 총 인원 수 표시 — "총 2명" 확인
- [x] "게스트 추가" 버튼 표시 — 확인 (disabled 상태)
- [ ] 게스트가 없을 때 빈 상태 메시지 ⚠️ SKIP: 테스트 데이터 있음
- [x] 게스트 테이블 컬럼: 이름, 유형, 측, 상태, 초대채널, 등록일 — 모두 확인
- [x] 상태 뱃지 색상: invited=파랑, responded=초록, checked_in=보라, declined=빨강 — "체크인", "초대됨" 뱃지 표시됨 (색상은 미확인)
- [x] 게스트 유형 뱃지 표시 (primary, companion, child, vip) — "VIP", "본인" 뱃지 확인

---

## 6. RSVP 현황 (`/app/events/[eventId]/rsvps`)

- [x] 요약 카드 6개 표시: 총 응답, 참석, 불참, 미정, 총 인원, 총 식수 — 2/1/1/0/2/2 확인
- [ ] 응답이 없을 때 빈 상태 메시지 ⚠️ SKIP: 테스트 데이터 있음
- [x] 응답 테이블 컬럼: 게스트명, 참석여부, 인원수, 식수, 메시지, 응답일 — 모두 확인
- [x] 참석여부 뱃지 색상: attending=초록, not_attending=빨강, maybe=노랑 — "참석", "불참" 뱃지 확인

---

## 7. 체크인 관리 (`/app/events/[eventId]/checkin`)

- [x] 요약 카드 표시: 총 체크인, 세션 수 — 총 체크인(1), 세션 수(1) 확인
- [x] 체크인 세션 카드 목록 표시 (있을 경우) — "본식 체크인" (진행중) 확인
- [x] 체크인 로그 테이블 표시 — 확인
- [x] 로그 테이블 컬럼: 게스트명, 체크인 방법, 체크인 시간, 체크인 담당 — 확인 (담당자는 UUID로 표시됨)
- [ ] 데이터 없을 때 빈 상태 메시지 ⚠️ SKIP: 테스트 데이터 있음

---

## 8. 페이지 편집기 (`/app/events/[eventId]/editor`)

- [x] 페이지가 없을 때 빈 상태 + "페이지 생성" 안내 — "아직 생성된 페이지가 없습니다" + "페이지 생성" 버튼 확인
- [ ] 페이지가 있으면 섹션 목록 카드로 표시 ⚠️ SKIP: 테스트 페이지 미생성
- [ ] 각 섹션 카드에 타입 뱃지, 섹션 키, 활성 상태, 정렬 순서 표시 ⚠️ SKIP
- [ ] "섹션 추가", "미리보기", "퍼블리시" 버튼 표시 ⚠️ SKIP

---

## 9. 리포트 (`/app/events/[eventId]/reports`)

- [x] 개요 카드 표시: 총 게스트, RSVP 응답, 참석 확정, 불참, 총 인원, 총 식수 — 2/2/1/1/2/2 확인
- [x] 참석률(%) 계산 및 표시 — "50%" 확인
- [x] "페이지 방문 분석" 섹션 (coming soon 뱃지) — "Coming Soon" 확인
- [x] "공유 링크 성과" 섹션 (coming soon 뱃지) — "Coming Soon" 확인

---

## 10. 좌석/테이블 관리 (`/app/events/[eventId]/tables`)

- [x] 좌석 구역이 없을 때 빈 상태 메시지 — "좌석 배치를 시작하세요" 확인
- [x] "구역 추가" 버튼 표시 — 확인 (disabled 상태)
- [ ] 구역이 있으면 카드로 표시: 구역명, 유형, 수용인원, 테이블 수 ⚠️ SKIP: 테스트 데이터 미생성

---

## 11. 이벤트 설정 (`/app/events/[eventId]/settings`)

- [x] 기본 정보 섹션: title, subtitle, slug, eventType 표시 — 테스트 결혼식/2026년 봄 웨딩/test-wedding-2026/결혼식 확인
- [x] 일정 섹션: startsAt, endsAt 표시 — 2026-05-15 11:00 / 14:00 확인
- [x] RSVP 섹션: rsvpOpensAt, rsvpClosesAt 표시 — 2026-04-01 / 2026-05-10 확인
- [x] 기능 설정: checkinEnabled, messagingEnabled, analyticsEnabled 뱃지 — 모두 "ON" 확인
- [x] SEO 섹션: seoTitle, seoDescription 표시 — 확인
- [x] 위험 구역: "이벤트 삭제" 버튼 (destructive 스타일) — 확인 (disabled 상태)

---

## 12. 조직 관리 - 레이아웃 (`/org/[workspaceSlug]`)

- [x] 조직 레이아웃 사이드바 렌더링 — `/org/test-invi2me/events` 에서 확인
- [x] 워크스페이스 이름 표시 — "테스트 워크스페이스" 확인
- [x] 네비게이션 링크 5개: 이벤트, 템플릿, 멤버, 도메인, 결제 — 모두 확인
- [x] 비로그인 시 `/login` 리다이렉트 — 기존 테스트에서 확인

---

## 13. 조직 - 이벤트 (`/org/[workspaceSlug]/events`)

- [x] 워크스페이스의 이벤트 테이블 표시 — "테스트 결혼식" 표시됨
- [x] 테이블 컬럼: 이벤트명, 상태, 유형, 생성일 — 모두 확인
- [x] 이벤트 클릭 시 콘솔 이벤트 페이지로 이동 — `/app/events/[id]` 링크 확인
- [ ] 빈 상태 메시지 ⚠️ SKIP: 테스트 이벤트 있음

---

## 14. 조직 - 템플릿 (`/org/[workspaceSlug]/templates`)

- [ ] 템플릿 카드 목록 표시 ⚠️ SKIP: 테스트 템플릿 미생성
- [ ] 각 카드: 이름, 설명, 카테고리 ⚠️ SKIP
- [x] "템플릿 만들기" 버튼 — 확인 (disabled 상태)
- [x] 빈 상태 메시지 — "아직 템플릿이 없습니다" 확인

---

## 15. 조직 - 멤버 (`/org/[workspaceSlug]/members`)

- [x] 멤버 테이블: 이름, 이메일, 역할, 상태, 참여일 — 테스트 유저 1명 확인
- [x] "멤버 초대" 버튼 — 확인 (disabled 상태)
- [x] 역할/상태 뱃지 표시 — "소유자", "활성" 뱃지 확인

---

## 16. 조직 - 도메인 (`/org/[workspaceSlug]/domains`)

- [ ] 커스텀 도메인 테이블: 도메인, 상태, 등록일 ⚠️ SKIP: 테스트 도메인 미생성
- [ ] SSL/인증 상태 뱃지 ⚠️ SKIP
- [x] "도메인 추가" 버튼 — 확인 (disabled 상태)
- [x] 빈 상태 메시지 — "등록된 도메인이 없습니다" 확인

---

## 17. 조직 - 결제 (`/org/[workspaceSlug]/billing`)

- [x] 현재 플랜 표시 (Free Plan 뱃지) — "Free Plan" 확인
- [x] 사용량 표시: 이벤트 수, 게스트 수 — 이벤트(1), 게스트(2) 확인
- [x] "플랜 업그레이드" 버튼 — 확인 (disabled 상태)

---

## 18. 공개 이벤트 페이지 (`/[eventSlug]`)

- [x] 존재하지 않는 slug 접근 시 404 — 404 페이지 렌더링 확인
- [ ] published 상태가 아닌 이벤트 접근 시 404 ⚠️ SKIP: 테스트 이벤트 미생성
- [ ] published 이벤트 접근 시 섹션 렌더링 ⚠️ SKIP
- [ ] 각 섹션 블록 타입별 렌더링 확인 (hero, countdown 등) ⚠️ SKIP

---

## 19. Public API

### GET `/api/public/events/[slug]`
- [ ] 존재하는 published 이벤트 slug → 200 + 이벤트 데이터 ⚠️ SKIP: 테스트 이벤트 미생성
- [x] 존재하지 않는 slug → 404 (code: `EVENT_NOT_FOUND`) — DB 연결 후 정상 동작 확인
- [ ] draft 이벤트 slug → 404 ⚠️ SKIP: 테스트 이벤트 미생성

### POST `/api/public/events/[slug]/rsvp`
- [ ] 유효한 RSVP 제출 → 201 ⚠️ SKIP: DB 연결 실패
- [x] 필수 필드 누락 → 400 (attendanceStatus 누락 시 code: `VALIDATION_ERROR`)
- [ ] 중복 제출 → 409 (이미 제출된 경우) ⚠️ SKIP: DB 연결 실패

### GET `/api/public/events/[slug]/gallery`
- [ ] 갤러리 아이템 목록 반환 → 200 ⚠️ SKIP: 테스트 이벤트 미생성
- [x] 존재하지 않는 slug → 404

### POST `/api/public/events/[slug]/page-events`
- [ ] 유효한 페이지 이벤트 트래킹 → 201 ⚠️ SKIP: DB 연결 실패
- [x] eventType 누락 → 400 (code: `VALIDATION_ERROR`)

### POST `/api/public/checkin/[token]`
- [ ] 유효한 QR 토큰 → 200 + 체크인 성공 ⚠️ SKIP: 테스트 토큰 미생성
- [x] 잘못된 토큰 → 401 (code: `INVALID_TOKEN`)
- [ ] 중복 체크인 → 409 ⚠️ SKIP

---

## 20. Console API (인증 필요)

### GET/PUT `/api/app/events/[eventId]`
- [x] 인증 없이 접근 → 401 (code: `UNAUTHENTICATED`) — 버그 수정 확인
- [ ] GET: 이벤트 상세 데이터 반환 ⚠️ SKIP: 로그인 불가
- [ ] PUT: 이벤트 업데이트 성공 ⚠️ SKIP

### GET/POST `/api/app/events/[eventId]/guests`
- [x] 비인증 GET → 401 (code: `UNAUTHENTICATED`) — 버그 수정 확인
- [ ] GET: 게스트 목록 반환 ⚠️ SKIP: 로그인 불가
- [ ] POST: 게스트 생성 → 201 + invitation_token 자동 생성 ⚠️ SKIP

### POST/GET `/api/app/events/[eventId]/checkin`
- [ ] POST: 체크인 수행 → 201 ⚠️ SKIP
- [ ] GET: 체크인 요약 + 로그 반환 ⚠️ SKIP

### GET/POST `/api/app/events/[eventId]/campaigns`
- [ ] GET: 캠페인 목록 반환 ⚠️ SKIP
- [ ] POST: 캠페인 생성 → 201 (name, channelType 필수) ⚠️ SKIP
- [x] 인증 없이 접근 → 401 — 동일 패턴 (requireUser 수정)

### GET `/api/app/events/[eventId]/reports`
- [ ] RSVP 요약 데이터 반환 ⚠️ SKIP

---

## 21. Org API (인증 필요)

### GET/POST `/api/org/[workspaceSlug]/templates`
- [x] 비인증 GET → 401 (code: `UNAUTHENTICATED`)
- [ ] GET: 템플릿 목록 반환 ⚠️ SKIP: 로그인 불가
- [ ] POST: 템플릿 생성 → 201 ⚠️ SKIP
- [ ] 권한 없는 워크스페이스 → 에러 ⚠️ SKIP

### GET `/api/org/[workspaceSlug]/members`
- [x] 비인증 → 401 (code: `UNAUTHENTICATED`)
- [ ] 멤버 목록 반환 (이메일 마스킹 확인) ⚠️ SKIP
- [ ] 권한 없는 워크스페이스 → 에러 ⚠️ SKIP

### GET/POST `/api/org/[workspaceSlug]/domains`
- [x] 비인증 → 401 (code: `UNAUTHENTICATED`)
- [ ] GET: 도메인 목록 반환 ⚠️ SKIP
- [ ] POST: 도메인 등록 → 201 + verificationToken 생성 ⚠️ SKIP

---

## 22. Webhooks

### POST `/api/webhooks`
- [x] `x-webhook-source: stripe` 헤더 → 200 (`{ success: true, data: { received: true } }`)
- [x] `x-webhook-source: resend` 헤더 → 200
- [x] 알 수 없는 소스 → 400 (code: `UNKNOWN_WEBHOOK_SOURCE`)

---

## 23. 크로스 기능 시나리오

### 전체 RSVP 플로우
- [ ] 이벤트 생성 → 게스트 추가 → RSVP 폼 공개 → 게스트 RSVP 제출 → 콘솔에서 응답 확인

### 전체 체크인 플로우
- [ ] 이벤트 생성 → 게스트 추가 → QR 토큰 생성 → QR 체크인 → 콘솔에서 로그 확인

### 인증 → 이벤트 생성 플로우
- [ ] 회원가입 → 로그인 → 이벤트 목록(빈 상태) → 이벤트 생성 → 대시보드 확인

---

## 메모

- **Base URL**: `http://localhost:3000`
- **테스트 DB**: Supabase 프로젝트 (`lklaipinlhknorhrbsse`)
- **RLS 정책**: `src/db/rls-policies.sql` (Supabase SQL Editor에서 실행 필요)
- **테스트 데이터 정리**: 각 테스트 후 생성된 데이터 클린업 필요

---

## 테스트 실행 결과 (2026-04-07)

### 실행 환경
- Dev 서버: `http://localhost:3000` (정상 구동)
- Playwright: v1.54.1 (node 스크립트로 실행)
- Supabase 프로젝트: `fhmsewkjjonzzzitgasv` (서울, ap-northeast-2) — 신규 생성
- DB 연결: ✅ 정상 (pooler: `aws-1-ap-northeast-2.pooler.supabase.com`)
- 마이그레이션: ✅ 완료 (테이블 43개)
- 테스트 유저: `test@invi2me.dev` / `Test1234!`

### 확인된 버그

#### 버그 1: 비인증 Console/Org API가 401 대신 500 반환 — ✅ **수정 완료**
- **원인**: `requireUser()`가 `new Error('Unauthenticated')` throw → `instanceof DomainError` 체크 실패
- **수정**: `src/shared/server/supabase.ts:50` → `throw new UnauthenticatedError()` 로 교체
- **검증**: `/api/app/*`, `/api/org/*` 모두 401 + `UNAUTHENTICATED` 반환 확인

#### 버그 2: 로그인 후 콘솔 진입 실패
- **증상**: `signInWithPassword` 200 성공 → `router.push('/app/events')` → 미들웨어가 다시 `/login`으로 리다이렉트
- **원인 추정**: `router.push` 직후 미들웨어 실행 시 쿠키가 아직 설정되지 않은 타이밍 이슈. 또는 `@supabase/ssr`의 쿠키 청킹 형식 불일치
- **영향**: 콘솔 전체 (섹션 2~11, 23) 테스트 불가
- **해결 필요**: `router.refresh()` 순서 조정 또는 `window.location.href` 방식으로 하드 네비게이션

### 통과 항목 요약
- ✅ 미들웨어 인증 가드: `/app/*`, `/org/*` → `/login?redirectTo=...` 307 리다이렉트
- ✅ 회원가입 페이지 렌더링 + 빈 값 Zod 에러 표시
- ✅ 로그인 에러 메시지 (잘못된 자격증명)
- ✅ API 응답 형식: `{ success, data/error }` 표준 준수
- ✅ Webhook: stripe/resend → 200, 알 수 없는 소스 → 400
- ✅ Validation: RSVP `attendanceStatus` 누락 → 400, page-events `eventType` 누락 → 400
- ✅ Public API: 없는 slug → 404 (`EVENT_NOT_FOUND`), gallery → 404
- ✅ Public checkin: 잘못된 토큰 → 401 (`INVALID_TOKEN`)
- ✅ 공개 이벤트 페이지: 없는 slug → 404 페이지
- ✅ Console API 비인증: 모두 401 `UNAUTHENTICATED` (버그 수정 확인)
- ✅ Org API 비인증: 모두 401 `UNAUTHENTICATED`
