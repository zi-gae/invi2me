---
description: invi2me DTO 및 Zod 스키마 생성
---

# /dto — DTO 및 응답 스키마 생성

**인자**: `$ARGUMENTS` (도메인명, 예: `event`, `guest`, `rsvp-response`)

## 실행 지침

사용자가 `/dto <domain>` 을 실행하면 해당 도메인의 DTO와 Zod 스키마를 생성한다.

### DTO 분리 원칙

같은 DB row라도 컨텍스트에 따라 **반드시** 다른 DTO를 사용한다:

| DTO 종류 | 용도 | 포함 필드 |
|----------|------|-----------|
| `Public<Domain>Dto` | 공개 이벤트 페이지 | 민감정보 제외, 마스킹 적용 |
| `Admin<Domain>Dto` | 운영자 콘솔 | 내부 필드 포함, 민감정보 마스킹 |
| `Analytics<Domain>Dto` | 리포트/분석 | 집계/측정 필드 중심 |

### 파일 위치

```
src/features/<domain>/types/
  dto.ts         ← DTO 타입 정의
  schemas.ts     ← Zod 입출력 스키마
```

### DTO 템플릿

```typescript
// src/features/<domain>/types/dto.ts

import type { <DomainDbType> } from '@/db/schema/<file>'

// ========================
// Public DTO (공개 페이지)
// ========================
export type Public<Domain>Dto = {
  id: string
  // 민감정보 제외
  // 계좌번호 → 마스킹 ("****1234")
  // 이메일 → 마스킹 ("u***@example.com")
  // 전화번호 → 마스킹 ("010-****-5678")
}

// ========================
// Admin DTO (운영자 콘솔)
// ========================
export type Admin<Domain>Dto = {
  id: string
  createdAt: string     // ISO 8601
  updatedAt: string
  // 내부 필드 포함 (단, raw 암호화 데이터는 포함하지 않음)
}

// ========================
// DTO 변환 함수
// ========================
export function toPublic<Domain>Dto(row: <DomainDbType>): Public<Domain>Dto {
  return {
    id: row.id,
    // 마스킹 및 필드 선택 적용
  }
}

export function toAdmin<Domain>Dto(row: <DomainDbType>): Admin<Domain>Dto {
  return {
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    // 필드 변환
  }
}
```

### Zod 스키마 템플릿

```typescript
// src/features/<domain>/types/schemas.ts

import { z } from 'zod'

// ========================
// 입력 스키마 (API Request)
// ========================
export const Create<Domain>Schema = z.object({
  // 모든 입력 필드 정의
  // 타입, 길이 제한, 포맷 검증 포함
})

export const Update<Domain>Schema = Create<Domain>Schema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: '하나 이상의 필드가 필요합니다' }
  )

export const List<Domain>QuerySchema = z.object({
  page:    z.coerce.number().int().positive().default(1),
  limit:   z.coerce.number().int().min(1).max(100).default(20),
  search:  z.string().optional(),
  sortBy:  z.enum(['createdAt', 'updatedAt']).default('createdAt'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
})

// ========================
// 출력 스키마 (API Response)
// ========================
export const Public<Domain>ResponseSchema = z.object({
  // 공개 응답 구조 정의
})

export const Admin<Domain>ResponseSchema = z.object({
  // 운영자 응답 구조 정의
})

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data:       z.array(itemSchema),
    pagination: z.object({
      page:       z.number(),
      limit:      z.number(),
      total:      z.number(),
      totalPages: z.number(),
    }),
  })

// ========================
// 타입 추론
// ========================
export type Create<Domain>Input  = z.infer<typeof Create<Domain>Schema>
export type Update<Domain>Input  = z.infer<typeof Update<Domain>Schema>
export type List<Domain>Query    = z.infer<typeof List<Domain>QuerySchema>
```

### 마스킹 유틸리티

```typescript
// src/shared/lib/masking.ts 에 정의된 함수 사용

maskEmail('user@example.com')       // "u***@example.com"
maskPhone('01012345678')            // "010-****-5678"
maskAccountNumber('1234567890123')  // "**********123"
```

### 주의사항

- DB row 타입(`$inferSelect`)을 API response에 직접 return하지 않는다
- `deletedAt`, `version`, `createdBy`, `updatedBy` 등 내부 컬럼은 public DTO에 포함하지 않는다
- `account_number_encrypted` 같은 암호화 컬럼은 어떤 DTO에도 raw 값으로 포함하지 않는다
- nullable 필드는 명시적으로 `null` 처리한다 (`undefined` 대신 `null` 반환)
