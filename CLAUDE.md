@AGENTS.md

# invi2me — Wedding Event Platform

## 제품 정의

Splash 스타일의 이벤트 운영 플랫폼. "청첩장 생성기"가 아니라 **초대 → RSVP → 게스트 운영 → 체크인 → 리포트**를 하나로 연결하는 **Event Operating System**이다.

- **B2C**: 커플을 위한 모바일 웨딩 초대/운영 서비스
- **B2B Lite**: 웨딩홀/플래너/스튜디오가 이벤트를 대신 제작/운영하는 관리 플랫폼
- **B2B Full**: 기업 행사, VIP 이벤트, 세미나까지 확장 가능한 이벤트 SaaS

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Framework | Next.js 16+ (App Router) |
| Language | TypeScript strict mode |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animation | Framer Motion |
| State / Server | TanStack Query |
| Form | React Hook Form + Zod |
| URL State | nuqs |
| DB ORM | Drizzle ORM |
| Backend | Supabase (Postgres / Auth / Storage / RLS / Realtime) |
| Async Jobs | Trigger.dev |
| Email | Resend |
| SMS | Twilio (추상화 레이어) |
| Payments | Stripe |
| Monitoring | Sentry + PostHog + OpenTelemetry |
| Infra | Vercel + Supabase Cloud + Cloudflare |

---

## 개발 커맨드

```bash
pnpm dev          # 개발 서버
pnpm build        # 프로덕션 빌드
pnpm lint         # ESLint
pnpm typecheck    # TypeScript 타입 체크
pnpm db:generate  # Drizzle 스키마 → 마이그레이션 파일 생성
pnpm db:migrate   # 마이그레이션 실행
pnpm db:studio    # Drizzle Studio (DB 시각화)
```

---

## 폴더 구조

```
src/
  app/                          # Next.js App Router
    (public)/                   # 공개 이벤트 페이지
      [eventSlug]/
        page.tsx
        rsvp/
        schedule/
        gallery/
        gift/
        check-in/
    (console)/                  # 운영자 대시보드
      app/
        events/
          [eventId]/
            editor/
            guests/
            rsvps/
            checkin/
            tables/
            reports/
            settings/
    (org)/                      # B2B 조직 관리
      org/
        [workspaceSlug]/
    api/
      public/                   # 공개 API
      app/                      # 콘솔 API
      org/                      # 조직 API
      webhooks/                 # 외부 웹훅 수신

  features/                     # 도메인별 기능 모듈
    auth/
    workspaces/
    organizations/
    events/
    event-editor/
    event-themes/
    guests/
    rsvp/
    messaging/
    checkin/
    seating/
    reports/
    billing/

  entities/                     # 순수 도메인 타입/스키마
  shared/
    ui/                         # 공용 UI 컴포넌트
    lib/                        # 유틸리티
    schemas/                    # 공용 Zod 스키마
    constants/
    hooks/
    server/                     # 서버 전용 유틸
```

---

## 핵심 도메인 경계

1. **Identity & Access** — 사용자, 워크스페이스, 조직, 권한 (3계층 RBAC)
2. **Event Authoring** — 이벤트, 페이지 빌더, 테마, 섹션 블록, 버전 관리
3. **Guest Management** — 게스트, 그룹, 세그먼트, RSVP, 동반인
4. **Messaging** — 공유 링크, 이메일, SMS, 알림, 발송 이력
5. **On-site Operations** — QR, 체크인, 테이블/좌석, 현장 스태프
6. **Analytics & Reporting** — 페이지뷰, 전환, 공유 성과, 운영 리포트
7. **Billing & Subscription** — 플랜, 구독, 좌석/이벤트 제한

---

## 권한 모델 (3계층 RBAC)

```
workspace_memberships   →  플랜/청구/조직 설정, 사용자 초대
organization_memberships → 조직 브랜딩, 템플릿, 멤버 관리
event_memberships        → 이벤트 편집, 게스트, 메시지, 체크인, 리포트
```

permission set 예시: `event.edit`, `event.publish`, `guest.read`, `guest.checkin`, `message.send`, `report.read`

---

## 데이터베이스 규칙

### 필수 공통 컬럼 (모든 핵심 테이블)
```sql
id           uuid primary key
created_at   timestamptz not null
updated_at   timestamptz not null
created_by   uuid null
updated_by   uuid null
deleted_at   timestamptz null   -- soft delete
version      int not null default 1
```

### 식별자 전략
- 내부 PK: `uuid`
- 외부 노출: `slug` 또는 `public_id`
- QR/초대링크: 별도 랜덤 `token` 컬럼

### 멀티테넌트 원칙
- 모든 핵심 테이블은 `workspace_id` / `organization_id` / `event_id` 중 하나를 보유
- 개인 서비스처럼 보여도 내부는 멀티테넌트 SaaS 구조 유지

### JSONB 사용 기준
- 편집 콘텐츠 (`content_json`): 블록 기반 페이지 데이터
- 응답 데이터 (`answers_json`): RSVP 추가 질문 응답
- 테마 토큰 (`theme_tokens`): 이벤트별 디자인 토큰
- 권한 (`permissions`): 확장 가능한 permission set

---

## 코드 규칙

### 금지 사항
- `any` 타입 사용 금지
- DB row를 UI에 직접 노출 금지 (반드시 DTO 변환)
- validation 없는 API 구현 금지
- `'use client'` 남용 금지 — server component 기본
- 권한 검사 없는 mutation 금지
- barrel file(`index.ts`) 남용 금지
- MVP 핑계로 확장성 포기 금지
- mock 중심 구조 금지

### 필수 패턴
- 모든 input/output은 Zod schema로 검증
- DB 접근은 반드시 repository/query layer 경유
- public DTO / admin DTO / analytics DTO 분리
- 중요 mutation은 audit log 기록
- 민감 데이터(계좌번호, 비밀번호, 초대토큰)는 암호화/해시 저장

### Server/Client Boundary
- 기본: Server Component
- `'use client'` 사용 조건: 이벤트 핸들러, 브라우저 API, TanStack Query, React Hook Form

---

## 보안 정책

| 항목 | 처리 방식 |
|------|----------|
| access password | bcrypt hash |
| gift account number | AES 암호화 |
| admin invite token | random token + hash |
| QR 체크인 토큰 | 충분한 엔트로피의 랜덤 token |
| 전화번호/이메일 | API 응답 시 마스킹 |

---

## 구현 우선순위

1. DB schema and migrations
2. Auth + RBAC + RLS
3. Event core entities
4. Public event page renderer
5. RSVP flow
6. Guest management console
7. Editor + publish workflow
8. Messaging infra
9. Check-in flow
10. Reports dashboard
11. B2B org management
12. Custom domains / billing
