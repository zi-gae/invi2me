---
description: Supabase RLS 정책 생성
---

# /rls-policy — Supabase RLS 정책 생성

**인자**: `$ARGUMENTS` (테이블명, 예: `events`, `guests`, `rsvp_responses`)

## 실행 지침

사용자가 `/rls-policy <table>` 을 실행하면 해당 테이블의 Supabase RLS 정책 SQL을 생성한다.

출력 위치: `src/db/rls/<table>.sql`

### RLS 정책 원칙

| 테이블 | 공개 read | 조건부 read | 인증 write |
|--------|-----------|-------------|------------|
| events (published) | ✅ anonymous | — | event member only |
| events (draft/archived) | ❌ | event member | event member |
| guests | ❌ | event member or guest token | event member |
| rsvp_responses | ❌ | event member | guest token scope |
| checkin_logs | ❌ | checkin permission | checkin permission |
| gift_accounts | ❌ raw | masked projection (public page) | owner/editor |
| audit_logs | ❌ | workspace member | system only |
| workspace_memberships | ❌ | same workspace | workspace owner |
| organization_memberships | ❌ | same org | org owner |

### 정책 SQL 템플릿

```sql
-- RLS 활성화
ALTER TABLE public.<table> ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 (published 이벤트 데이터)
CREATE POLICY "<table>_public_read"
  ON public.<table>
  FOR SELECT
  TO anon, authenticated
  USING (
    -- 예: event가 published 상태인 경우만
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = <table>.event_id
        AND e.status = 'published'
        AND e.deleted_at IS NULL
    )
  );

-- 인증된 운영자 읽기
CREATE POLICY "<table>_authenticated_read"
  ON public.<table>
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.event_memberships em
      WHERE em.event_id = <table>.event_id
        AND em.user_id = auth.uid()
        AND em.status = 'active'
    )
  );

-- 운영자 쓰기 (insert/update/delete)
CREATE POLICY "<table>_editor_write"
  ON public.<table>
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.event_memberships em
      WHERE em.event_id = <table>.event_id
        AND em.user_id = auth.uid()
        AND em.status = 'active'
        AND em.permissions @> '["event.edit"]'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.event_memberships em
      WHERE em.event_id = <table>.event_id
        AND em.user_id = auth.uid()
        AND em.status = 'active'
        AND em.permissions @> '["event.edit"]'
    )
  );
```

### 게스트 토큰 기반 RLS (RSVP 응답용)

```sql
-- 게스트 개인 토큰으로 본인 RSVP만 write 허용
CREATE POLICY "rsvp_responses_guest_token_write"
  ON public.rsvp_responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.guests g
      WHERE g.id = rsvp_responses.guest_id
        AND g.invitation_token = current_setting('request.headers')::json->>'x-invitation-token'
        AND g.deleted_at IS NULL
    )
  );
```

### Workspace 레벨 RLS

```sql
-- workspace 멤버만 접근
CREATE POLICY "<table>_workspace_member"
  ON public.<table>
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.workspace_memberships wm
      WHERE wm.workspace_id = <table>.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.status = 'active'
    )
  );
```

### soft delete 처리

모든 RLS 정책에서 `deleted_at IS NULL` 조건을 반드시 포함한다.

```sql
USING (
  <table>.deleted_at IS NULL
  AND /* 권한 조건 */
)
```

## 주의사항

- gift_accounts의 계좌번호(`account_number_encrypted`)는 공개 페이지에 raw 노출 금지. 마스킹된 projection만 허용
- checkin_logs는 checkin permission(`"guest.checkin"`)이 있는 사용자만 write 허용
- audit_logs는 application layer에서만 insert (RLS로 사용자 직접 write 금지)
- 정책 이름은 `<table>_<role>_<action>` 형식으로 작성

## 생성 후 확인

```bash
# Supabase CLI로 RLS 정책 적용
supabase db push

# 또는 마이그레이션으로 포함
# src/db/migrations/ 에 SQL 파일로 포함
```
