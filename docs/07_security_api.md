# 10. RLS 및 보안 정책

## 10.1 보안 원칙

1. 공개 페이지 데이터와 운영 데이터는 같은 테이블이어도 접근 정책을 다르게 적용한다.
2. 게스트 개인정보는 최소 권한으로만 조회 가능해야 한다.
3. 개인화 링크는 짧은 토큰이 아니라 충분한 랜덤 엔트로피를 가진다.
4. 계좌번호 등 민감 데이터는 암호화 저장한다.
5. 메시지 발송, 체크인, 응답 수정은 모두 audit log에 남긴다.

## 10.2 Supabase RLS 방향

- `users`: self only
- `workspace_memberships`: same workspace members only
- `events`: published public rows는 anonymous read 가능, draft는 권한 있는 사용자만
- `guests`: event membership 기준 read/write
- `rsvp_responses`: event membership read, guest token scope write
- `checkin_logs`: checkin permission 보유자만
- `gift_accounts`: owner/editor only read raw, public page에는 masked projection만 노출

## 10.3 민감 데이터 처리

### 평문 저장 금지
- access password raw value
- gift account number raw value
- admin invite token raw value

### 마스킹 정책
- 전화번호
- 이메일
- 계좌번호

---

# 11. API 설계 원칙

## 11.1 API 스타일

- 내부 운영 API: Route Handlers + Server Actions 혼합
- 외부/공개 이벤트: REST 중심
- 웹훅 수신: `/api/webhooks/*`

## 11.2 API 분류

### Public APIs
- `GET /api/public/events/:slug`
- `POST /api/public/events/:slug/rsvp`
- `GET /api/public/events/:slug/gallery`
- `POST /api/public/events/:slug/page-events`
- `POST /api/public/checkin/:token`

### Console APIs
- `GET /api/app/events/:eventId`
- `PATCH /api/app/events/:eventId`
- `GET /api/app/events/:eventId/guests`
- `POST /api/app/events/:eventId/guests/import`
- `POST /api/app/events/:eventId/campaigns`
- `POST /api/app/events/:eventId/checkin`
- `GET /api/app/events/:eventId/reports/summary`

### Org APIs
- `GET /api/org/:workspaceSlug/templates`
- `POST /api/org/:workspaceSlug/templates`
- `GET /api/org/:workspaceSlug/members`
- `POST /api/org/:workspaceSlug/domains`

## 11.3 DTO 원칙

- DB row 직접 반환 금지
- public DTO, admin DTO, analytics DTO 분리
- input/output schema를 Zod로 검증
- nullable 필드는 명시적으로 관리
