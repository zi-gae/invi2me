---
description: invi2me feature 모듈 스캐폴드 생성
---

# /feature — Feature 모듈 스캐폴드

**인자**: `$ARGUMENTS` (feature 이름, 예: `guests`, `rsvp`, `checkin`)

## 실행 지침

사용자가 `/feature <name>` 을 실행하면 `src/features/<name>/` 하위에 아래 구조를 생성한다.

### 생성할 파일 구조

```
src/features/<name>/
  actions/
    .gitkeep
  queries/
    .gitkeep
  components/
    .gitkeep
  hooks/
    .gitkeep
  schemas/
    index.ts        ← Zod 입력 스키마
  types/
    index.ts        ← 도메인 타입 및 DTO 정의
  utils/
    .gitkeep
```

### schemas/index.ts 템플릿

```typescript
import { z } from 'zod'

// 생성 스키마
export const Create<Name>Schema = z.object({
  // TODO: 필드 정의
})

// 수정 스키마
export const Update<Name>Schema = Create<Name>Schema.partial()

export type Create<Name>Input = z.infer<typeof Create<Name>Schema>
export type Update<Name>Input = z.infer<typeof Update<Name>Schema>
```

### types/index.ts 템플릿

```typescript
// DB row 타입 (Drizzle에서 import)
// import type { <Name> } from '@/db/schema/<file>'

// 공개 DTO
export type Public<Name>Dto = {
  id: string
  // TODO: 공개 필드만 포함 (민감정보 제외)
}

// 운영자 DTO
export type Admin<Name>Dto = {
  id: string
  createdAt: string
  updatedAt: string
  // TODO: 내부 필드 포함
}
```

## 실행 후 안내

생성 완료 후 다음 작업을 안내한다:

1. `src/db/schema/` 에 해당 도메인 테이블 스키마 추가 (`/db-schema` 커맨드 사용)
2. `src/features/<name>/queries/` 에 Drizzle query 함수 작성
3. `src/features/<name>/actions/` 에 Server Action 작성 (mutation)
4. `src/features/<name>/components/` 에 UI 컴포넌트 작성

## 주의사항

- feature 이름은 kebab-case를 사용한다 (`guest-management` → `src/features/guest-management/`)
- 이미 존재하는 feature 디렉토리가 있으면 덮어쓰지 않고 누락된 파일만 추가한다
- 마스터 플랜의 feature 목록을 참고한다: `auth`, `workspaces`, `organizations`, `events`, `event-editor`, `event-themes`, `guests`, `rsvp`, `messaging`, `checkin`, `seating`, `reports`, `billing`
