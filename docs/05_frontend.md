# 6. 프론트엔드 아키텍처 원칙

## 6.1 앱 분할

### Public App
- 공개 초대장 페이지
- RSVP 페이지
- 체크인/게스트 개인 링크

### Console App
- 이벤트 관리
- 게스트/좌석/체크인/리포트

### Org Admin App
- B2B 조직 관리
- 브랜딩/템플릿/사용자 관리

물리적으로는 하나의 Next.js 앱으로 유지하되, 라우팅 및 패키지 경계로 구분한다.

## 6.2 라우트 구조

```txt
/
/:eventSlug
/:eventSlug/rsvp
/:eventSlug/schedule
/:eventSlug/gallery
/:eventSlug/gift
/:eventSlug/check-in

/app
/app/events
/app/events/:eventId
/app/events/:eventId/editor
/app/events/:eventId/guests
/app/events/:eventId/rsvps
/app/events/:eventId/checkin
/app/events/:eventId/tables
/app/events/:eventId/reports
/app/events/:eventId/settings

/org/:workspaceSlug
/org/:workspaceSlug/events
/org/:workspaceSlug/templates
/org/:workspaceSlug/members
/org/:workspaceSlug/domains
/org/:workspaceSlug/billing
```

## 6.3 모듈 구조

```txt
src/
  app/
  features/
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
  entities/
  shared/
    ui/
    lib/
    schemas/
    constants/
    hooks/
    server/
```

## 6.4 설계 원칙

- feature 기반 모듈화
- entity와 feature 책임 분리
- server/client boundary 명확화
- 입력은 Zod, 저장은 SQL, 출력은 DTO로 일관화
- API contract를 TS 타입 + 런타임 검증으로 보장
- 디자인 토큰과 이벤트 테마 토큰을 분리
