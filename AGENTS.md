<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# invi2me Agent Rules

## 코드 작성 전 필수 체크리스트

코드를 작성하기 전에 항상 아래를 순서대로 확인한다:

1. `node_modules/next/dist/docs/` 에서 해당 Next.js 기능 가이드를 읽는다
2. `src/features/` 에 이미 관련 모듈이 있는지 확인한다
3. `src/entities/` 에 해당 도메인 타입이 정의되어 있는지 확인한다
4. `src/shared/schemas/` 에 Zod 스키마가 있는지 확인한다
5. Drizzle 스키마(`src/db/schema/`)에서 테이블 구조를 확인한다

---

## 도메인 지식

### 이 제품이 다루는 핵심 개념

| 용어 | 의미 |
|------|------|
| workspace | 최상위 테넌트 단위. 개인(personal) 또는 비즈니스(business) |
| organization | workspace 하위의 B2B 조직 (웨딩홀, 플래너, 스튜디오) |
| event | 실제 이벤트 단위 (결혼식, 피로연, 세미나 등) |
| event_page | 이벤트의 공개 페이지. locale별로 분리됨 |
| event_section | 페이지를 구성하는 블록 단위 (hero, gallery, rsvp_form 등) |
| published snapshot | 공개 페이지 렌더링 기준. draft와 항상 분리됨 |
| guest | 초대된 사람. primary / companion / child / vip 타입 |
| invitation_token | 게스트 개인화 링크용 랜덤 토큰 |
| checkin_session | 체크인 운영 세션. 일정(schedule)에 연결될 수 있음 |
| campaign | 메시지 발송 단위. guest segment에 배치 발송 |
| tracking_link | UTM 파라미터 포함 공유 링크. 유입 성과 추적용 |

### 이벤트 상태 흐름
```
draft → scheduled → published → archived
```

### RSVP 응답 타입
```
attending | not_attending | maybe
```

### 게스트 상태 흐름
```
invited → responded → checked_in | declined
```

---

## 아키텍처 규칙

### 라우트 접두사 규칙

| 경로 | 용도 |
|------|------|
| `/:eventSlug/*` | 공개 이벤트 페이지 (게스트 접근) |
| `/app/*` | 운영자 콘솔 (인증 필요) |
| `/org/:workspaceSlug/*` | B2B 조직 관리 (인증 필요) |
| `/api/public/*` | 공개 API (인증 불필요) |
| `/api/app/*` | 콘솔 API (인증 필요) |
| `/api/org/*` | 조직 API (인증 필요) |
| `/api/webhooks/*` | 외부 웹훅 수신 |

### Feature 모듈 규칙

각 feature는 아래 구조를 따른다:

```
src/features/{feature-name}/
  actions/          # Server Actions (mutation)
  queries/          # Server-side query functions
  components/       # UI 컴포넌트
  hooks/            # Client-side hooks
  schemas/          # Zod 입력 스키마
  types/            # 도메인 타입 및 DTO
  utils/            # 순수 유틸리티
```

### 데이터 흐름 규칙

```
HTTP Request
  → Zod validation (schema layer)
  → Permission check (auth/rbac layer)
  → Repository/Query layer (Drizzle)
  → DTO transformation
  → Response
```

절대 이 순서를 건너뛰지 않는다.

### Server vs Client Component 결정 기준

**Server Component** (기본값):
- 데이터 fetch
- DB 접근
- 인증 체크
- 민감 데이터 렌더링

**Client Component** (`'use client'`만 붙이는 경우):
- onClick, onChange 등 이벤트 핸들러
- useState, useEffect 필요
- TanStack Query (`useQuery`, `useMutation`)
- React Hook Form
- 브라우저 API (localStorage, geolocation 등)
- Framer Motion 애니메이션

---

## Supabase / RLS 규칙

### RLS 정책 원칙

| 테이블 | 공개 read | 인증 write |
|--------|-----------|------------|
| events (published) | ✅ anonymous | ❌ |
| events (draft) | ❌ | ✅ event member |
| guests | ❌ | ✅ event member |
| rsvp_responses | ❌ | ✅ guest token scope |
| checkin_logs | ❌ | ✅ checkin permission |
| gift_accounts | ❌ raw | ✅ owner/editor (masked projection만 public) |

### 민감 데이터 처리

절대 평문 저장하지 않는 데이터:
- `access_password` → bcrypt hash
- `account_number` → AES 암호화 (`account_number_encrypted`)
- `invitation_token` → 충분한 엔트로피 (최소 32바이트 random)

---

## Drizzle ORM 규칙

### 스키마 파일 위치
```
src/db/
  schema/
    identity.ts       # users, workspaces, workspace_memberships
    organizations.ts  # organizations, organization_memberships
    events.ts         # events, event_memberships, event_schedules, event_locations
    content.ts        # event_pages, event_page_versions, event_sections, event_assets
    themes.ts         # event_templates, event_themes, custom_domains
    guests.ts         # guests, guest_groups, guest_tags, guest_relationships
    rsvp.ts           # rsvp_forms, rsvp_responses, rsvp_response_history
    seating.ts        # seating_areas, tables, table_assignments
    checkin.ts        # checkin_sessions, checkin_logs, qr_tokens
    messaging.ts      # channels, message_templates, campaigns, campaign_deliveries, tracking_links
    payments.ts       # gift_accounts, gift_messages, orders
    analytics.ts      # page_events, event_metrics_daily, audit_logs
  migrations/         # 자동 생성된 마이그레이션 파일
  index.ts            # DB 클라이언트 export
```

### 인덱스 필수 적용 대상
- `events(slug)` — unique
- `events(workspace_id, status)` — composite
- `guests(event_id, status)` — composite
- `rsvp_responses(event_id, attendance_status)` — composite
- `checkin_logs(event_id, checked_in_at desc)` — composite
- `page_events(event_id, occurred_at desc)` — composite
- `event_metrics_daily(event_id, metric_date desc)` — composite

---

## API 설계 규칙

### Route Handler 파일 위치
```
src/app/api/public/events/[slug]/route.ts
src/app/api/public/events/[slug]/rsvp/route.ts
src/app/api/app/events/[eventId]/route.ts
src/app/api/app/events/[eventId]/guests/route.ts
src/app/api/org/[workspaceSlug]/templates/route.ts
```

### 응답 DTO 분리 원칙

같은 데이터라도 컨텍스트에 따라 다른 DTO를 사용한다:

```typescript
// 공개 이벤트 페이지용
type PublicEventDto = { slug: string; title: string; /* 민감정보 제외 */ }

// 운영자 콘솔용
type AdminEventDto = { id: string; slug: string; status: string; /* 내부 필드 포함 */ }

// 분석용
type EventAnalyticsDto = { event_id: string; metrics: EventMetrics }
```

---

## 페이지 빌더 규칙

### 섹션 블록 타입

```typescript
interface SectionBlock<TProps = Record<string, unknown>> {
  id: string;           // uuid
  type: SectionBlockType;
  enabled: boolean;
  sortOrder: number;
  props: TProps;
  visibilityRules?: VisibilityRule[];
}
```

지원 블록 타입: `hero` | `countdown` | `invitation_message` | `couple_profile` | `event_schedule` | `location_map` | `transport_guide` | `parking_info` | `gallery` | `video` | `faq` | `contact_panel` | `gift_account` | `guestbook` | `rsvp_form` | `timeline` | `dress_code` | `accommodation_guide` | `notice_banner`

### Published Snapshot 원칙

- 공개 페이지는 **항상** `event_page_versions.published_version_id` 기준으로 렌더링
- draft 데이터를 공개 페이지에 직접 노출하는 코드는 절대 작성하지 않는다

---

## 에러 처리 규칙

```typescript
// domain error 클래스 사용
class EventNotFoundError extends DomainError { ... }
class InsufficientPermissionError extends DomainError { ... }
class RsvpAlreadySubmittedError extends DomainError { ... }

// public 메시지와 internal 로그 분리
// - public: 사용자에게 노출되는 메시지 (한글, 안전한 내용)
// - internal: Sentry로 전송되는 상세 에러 (스택트레이스, 컨텍스트)
```

---

## 테스트 전략

| 테스트 종류 | 대상 |
|------------|------|
| Schema tests | Zod 스키마 유효성 |
| Repository integration tests | DB query layer (실제 DB 연결) |
| RLS tests | Supabase RLS 정책 |
| E2E | public RSVP flow, check-in flow, editor publish flow |

**mock DB 금지**: repository 테스트는 반드시 실제 테스트 DB에 연결한다.
