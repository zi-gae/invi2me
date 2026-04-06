---
description: invi2me Drizzle ORM 테이블 스키마 생성
---

# /db-schema — Drizzle 테이블 스키마 생성

**인자**: `$ARGUMENTS` (테이블명 또는 도메인명, 예: `guests`, `rsvp_responses`, `events`)

## 실행 지침

사용자가 `/db-schema <domain>` 을 실행하면 `src/db/schema/` 의 적절한 파일에 Drizzle 스키마를 작성한다.

### 스키마 파일 매핑

| 도메인 | 파일 |
|--------|------|
| users, workspaces, workspace_memberships | `src/db/schema/identity.ts` |
| organizations, organization_memberships | `src/db/schema/organizations.ts` |
| events, event_memberships, event_schedules, event_locations | `src/db/schema/events.ts` |
| event_pages, event_page_versions, event_sections, event_assets, galleries | `src/db/schema/content.ts` |
| event_templates, event_themes, custom_domains | `src/db/schema/themes.ts` |
| guests, guest_groups, guest_tags | `src/db/schema/guests.ts` |
| rsvp_forms, rsvp_responses, rsvp_response_history | `src/db/schema/rsvp.ts` |
| seating_areas, tables, table_assignments | `src/db/schema/seating.ts` |
| checkin_sessions, checkin_logs, qr_tokens | `src/db/schema/checkin.ts` |
| channels, message_templates, campaigns, campaign_deliveries, tracking_links | `src/db/schema/messaging.ts` |
| gift_accounts, gift_messages, orders | `src/db/schema/payments.ts` |
| page_events, event_metrics_daily, audit_logs | `src/db/schema/analytics.ts` |

### 필수 공통 컬럼 (모든 핵심 테이블에 반드시 포함)

```typescript
import { pgTable, uuid, timestamptz, integer } from 'drizzle-orm/pg-core'

const commonColumns = {
  id:        uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamptz('created_at').notNull().defaultNow(),
  updatedAt: timestamptz('updated_at').notNull().defaultNow(),
  createdBy: uuid('created_by'),
  updatedBy: uuid('updated_by'),
  deletedAt: timestamptz('deleted_at'),   // soft delete
  version:   integer('version').notNull().default(1),
}
```

### 스키마 작성 템플릿

```typescript
import {
  pgTable, uuid, text, timestamptz, boolean, integer,
  bigint, jsonb, numeric, inet, bigserial, uniqueIndex, index
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const tableName = pgTable(
  'table_name',
  {
    id:         uuid('id').primaryKey().defaultRandom(),
    // ... 도메인 컬럼
    createdAt:  timestamptz('created_at').notNull().defaultNow(),
    updatedAt:  timestamptz('updated_at').notNull().defaultNow(),
    createdBy:  uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
    updatedBy:  uuid('updated_by').references(() => users.id, { onDelete: 'set null' }),
    deletedAt:  timestamptz('deleted_at'),
    version:    integer('version').notNull().default(1),
  },
  (t) => ({
    // 인덱스 정의
    workspaceIdx: index('table_name_workspace_id_idx').on(t.workspaceId),
  })
)

export const tableNameRelations = relations(tableName, ({ one, many }) => ({
  // 관계 정의
}))

// Drizzle insert/select 타입
export type TableName       = typeof tableName.$inferSelect
export type NewTableName    = typeof tableName.$inferInsert
```

### 중요 규칙

1. **식별자**: 내부 PK는 `uuid`, 외부 노출 ID는 별도 `slug` 또는 `public_id` 컬럼
2. **암호화 필드**: 계좌번호 등 민감 데이터는 컬럼명에 `_encrypted` 접미사 (`account_number_encrypted`)
3. **토큰 필드**: 초대링크/QR 토큰은 충분한 엔트로피 (`text().unique()`)
4. **JSONB**: 편집 콘텐츠, RSVP 응답, 테마 토큰, 권한은 `jsonb` 사용
5. **soft delete**: `deleted_at` 컬럼 필수, 하드 delete 사용 금지
6. **멀티테넌트**: 반드시 `workspace_id` 또는 `organization_id` 또는 `event_id` 참조 포함

### 스키마 작성 후 실행 커맨드

```bash
pnpm db:generate   # 마이그레이션 파일 생성
pnpm db:migrate    # 마이그레이션 실행
pnpm db:studio     # Drizzle Studio로 확인
```

## 실행 순서

1. 대상 도메인을 파악하고 기존 스키마 파일을 읽는다
2. 마스터 플랜 섹션 8의 SQL 정의를 Drizzle 문법으로 변환한다
3. 공통 컬럼을 반드시 포함한다
4. 인덱스를 마스터 플랜 섹션 9 기준으로 추가한다
5. `relations()` 정의를 추가한다
6. TypeScript 타입을 export한다
