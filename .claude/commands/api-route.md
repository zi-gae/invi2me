---
description: invi2me API Route Handler 생성
---

# /api-route — API Route Handler 생성

**인자**: `$ARGUMENTS` (경로 및 도메인, 예: `public/events/[slug]`, `app/events/[eventId]/guests`)

## 실행 지침

사용자가 `/api-route <path>` 를 실행하면 `src/app/api/<path>/route.ts` 를 생성한다.

### Route Handler 기본 구조

```typescript
// src/app/api/<category>/<path>/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/shared/server/supabase'
import { checkPermission } from '@/features/auth/server'
import { SomeDomainRepository } from '@/features/<domain>/queries'
import { SomeInputSchema } from '@/features/<domain>/types/schemas'
import { toAdminDto } from '@/features/<domain>/types/dto'
import { DomainError } from '@/shared/lib/errors'

// ============================================================
// GET — 조회
// ============================================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params
    const supabase = await createClient()

    // 1. 인증 체크 (console/org API는 필수)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    // 2. 권한 체크
    await checkPermission(user.id, eventId, 'event.read')

    // 3. Query layer 경유
    const result = await SomeDomainRepository.findById(eventId)
    if (!result) {
      return NextResponse.json({ error: '찾을 수 없습니다' }, { status: 404 })
    }

    // 4. DTO 변환 후 반환
    return NextResponse.json(toAdminDto(result))

  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.publicMessage }, { status: error.statusCode })
    }
    // internal 에러는 Sentry로 전송
    console.error('[API ERROR]', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}

// ============================================================
// POST — 생성
// ============================================================
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params
    const supabase = await createClient()

    // 1. 인증 체크
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    // 2. 입력 검증 (Zod)
    const body = await request.json()
    const parsed = SomeInputSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: '입력값이 올바르지 않습니다', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // 3. 권한 체크
    await checkPermission(user.id, eventId, 'event.edit')

    // 4. Repository layer 경유
    const result = await SomeDomainRepository.create({
      ...parsed.data,
      eventId,
      createdBy: user.id,
    })

    // 5. DTO 변환 후 반환
    return NextResponse.json(toAdminDto(result), { status: 201 })

  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.publicMessage }, { status: error.statusCode })
    }
    console.error('[API ERROR]', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}
```

### 공개 API (인증 불필요) 구조

```typescript
// src/app/api/public/events/[slug]/route.ts

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // 공개 API: 인증 체크 없음
  // published 이벤트만 조회 (RLS가 자동 필터링)
  const event = await EventRepository.findPublishedBySlug(slug)
  if (!event) {
    return NextResponse.json({ error: '이벤트를 찾을 수 없습니다' }, { status: 404 })
  }

  // 공개 DTO 사용 (민감정보 제외)
  return NextResponse.json(toPublicEventDto(event))
}
```

### API 분류별 규칙

| API 경로 | 인증 | 권한 체크 | DTO |
|----------|------|-----------|-----|
| `/api/public/*` | ❌ | ❌ | `Public*Dto` |
| `/api/app/*` | ✅ required | ✅ event/workspace | `Admin*Dto` |
| `/api/org/*` | ✅ required | ✅ workspace | `Admin*Dto` |
| `/api/webhooks/*` | webhook secret | ❌ | — |

### 주의사항

- `params`는 Next.js 16에서 `Promise<{...}>` 타입 — 반드시 `await params` 사용
- DB row를 직접 `NextResponse.json()` 에 넣지 않는다
- 에러 메시지는 public용(한글, 안전한 내용)과 internal용(상세 로그) 분리
- 모든 mutation에는 audit log 기록 고려
