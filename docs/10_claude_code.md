# 16. Claude Code 작업 지침

## 16.1 역할

너는 시니어 스태프 엔지니어로서 아래 제품을 설계/구현한다.

제품은 Splash 스타일의 이벤트 플랫폼을 벤치마킹한 **결혼식 중심 이벤트 SaaS**이며, 초기부터 완성형으로 출시한다.

단순 모바일 청첩장 생성기가 아니라 다음을 제공해야 한다.

- 공개 이벤트 페이지
- RSVP/게스트 응답 관리
- 운영 대시보드
- QR 체크인
- 좌석/테이블 관리
- 메시지 발송
- 리포트
- 조직 단위 B2B 관리
- 커스텀 도메인
- 템플릿/테마 시스템

## 16.2 반드시 지켜야 할 기술 기준

- Next.js App Router
- TypeScript strict
- Tailwind + shadcn/ui
- Supabase(Postgres/Auth/Storage/RLS)
- Drizzle ORM
- Zod validation
- TanStack Query
- React Hook Form
- Sentry + PostHog 연동

## 16.3 아키텍처 원칙

- feature 기반 폴더 구조를 사용한다.
- 공개 페이지와 관리자 콘솔을 하나의 monolithic fullstack app으로 유지한다.
- 데이터 모델은 처음부터 멀티테넌트 B2C/B2B 확장을 고려한다.
- 이벤트 페이지 편집은 블록 기반 구조를 사용한다.
- published snapshot 기반으로 공개 페이지를 렌더링한다.
- 모든 입력/출력은 Zod schema로 검증한다.
- 민감 데이터는 암호화/마스킹 정책을 적용한다.
- 권한은 workspace / organization / event 3계층으로 나눈다.

## 16.4 구현 우선순위

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

## 16.5 작업 산출물

항상 아래를 포함해서 작성한다.

- architecture decision
- file tree
- TypeScript types
- Zod schemas
- DB migrations
- repository/query layer
- API routes or server actions
- UI components
- test strategy
- follow-up tasks

## 16.6 금지 사항

- barrel file 남용 금지
- DB row를 UI에 직접 노출 금지
- validation 없는 API 구현 금지
- client component 남용 금지
- 권한 검사 없는 mutation 금지
- 임시 mock 중심 구조 금지
- MVP 핑계로 확장성 포기 금지

---

# 17. Claude Code용 실행 프롬프트

```md
# Goal
Build a production-ready wedding-first event platform inspired by Splash.
This is not an MVP. Design and implement it as a complete product with B2C and future B2B scalability from day one.

# Product Requirements
The platform must support:
- public event invitation pages
- RSVP and guest response management
- guest groups and segmentation
- event schedules and locations
- gallery and content sections
- gift/account info with safe masking/encryption
- messaging campaigns
- QR-based guest check-in
- seating/table assignments
- event analytics and reporting
- workspace / organization / event RBAC
- template/theme system
- custom domains
- audit logs
- multi-locale support

# Technical Stack
- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- TanStack Query
- Supabase (Postgres/Auth/Storage/RLS)
- Drizzle ORM
- Sentry
- PostHog
- Resend

# Architecture Rules
- Use feature-based modular architecture.
- Separate public app concerns from admin console concerns.
- Use server components by default; use client components only when necessary.
- Use Zod for all input and output contracts.
- Use repository/query layer for DB access.
- Use published snapshots for rendering public event pages.
- Design data model for multi-tenant B2C/B2B support.
- Add audit logging for all important mutations.
- Apply secure token, masking, encryption, and permission checks.

# Deliverables
Generate:
1. folder structure
2. domain model
3. database schema
4. migrations
5. RLS policy strategy
6. API and server action design
7. UI route map
8. core components list
9. implementation order
10. testing plan

# Output Format
Write everything in detailed markdown.
Include rationale for each major architectural decision.
Be explicit and production-oriented.
Do not simplify for MVP.
```
