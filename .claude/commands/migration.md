---
description: Drizzle 마이그레이션 생성 및 관리
---

# /migration — Drizzle 마이그레이션 관리

**인자**: `$ARGUMENTS` (선택, 마이그레이션 설명, 예: `add-guests-table`, `add-rsvp-indexes`)

## 실행 지침

사용자가 `/migration` 또는 `/migration <description>` 을 실행하면 Drizzle 마이그레이션을 생성하고 관련 사항을 안내한다.

### 마이그레이션 생성 순서

1. **스키마 확인**: `src/db/schema/` 의 변경 사항 확인
2. **마이그레이션 생성**:
   ```bash
   pnpm db:generate
   # 또는 설명 포함
   pnpm db:generate --name <description>
   ```
3. **생성된 파일 검토**: `src/db/migrations/` 에 생성된 SQL 파일 확인
4. **RLS 정책 포함 여부 확인**: 새 테이블이면 RLS 정책 SQL도 마이그레이션에 포함
5. **마이그레이션 실행**:
   ```bash
   pnpm db:migrate
   ```
6. **Drizzle Studio로 확인**:
   ```bash
   pnpm db:studio
   ```

### 마이그레이션 파일 구조

```
src/db/migrations/
  0001_initial_schema.sql
  0002_add_rls_policies.sql
  0003_add_guest_search_vector.sql
  meta/
    _journal.json
    0001_snapshot.json
```

### 마이그레이션 포함 체크리스트

새 테이블 추가 시 반드시 포함해야 하는 항목:

- [ ] 테이블 생성 SQL
- [ ] 공통 컬럼 포함 여부 (`id`, `created_at`, `updated_at`, `deleted_at`, `version`)
- [ ] 필수 인덱스 추가 (마스터 플랜 섹션 9 참고)
- [ ] JSONB 컬럼이 있다면 GIN 인덱스 고려
- [ ] RLS 활성화 (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)
- [ ] RLS 정책 SQL (또는 별도 마이그레이션)
- [ ] 민감 데이터 컬럼 암호화 여부 확인

### 주의사항

- **절대 마이그레이션 파일을 직접 편집하지 않는다** — `pnpm db:generate` 로 재생성
- **이미 실행된 마이그레이션은 수정하지 않는다** — 새 마이그레이션 추가
- **soft delete 사용**: `DELETE` 대신 `deleted_at = NOW()` 업데이트
- **멱등성**: 마이그레이션은 여러 번 실행해도 안전해야 한다 (`IF NOT EXISTS` 활용)

### 자주 사용하는 Drizzle 커맨드

```bash
pnpm db:generate          # 스키마 변경사항으로 마이그레이션 파일 생성
pnpm db:migrate           # 미적용 마이그레이션 실행
pnpm db:studio            # Drizzle Studio (브라우저 DB 탐색기)
pnpm db:push              # 개발 환경 스키마 직접 push (마이그레이션 없이)
pnpm db:check             # 스키마 일관성 검사
```

### 마이그레이션 롤백

Drizzle은 기본적으로 롤백을 제공하지 않는다. 롤백이 필요하면:
1. 역방향 마이그레이션 파일을 수동 작성
2. Supabase 대시보드에서 직접 SQL 실행

### 프로덕션 마이그레이션 주의

- 프로덕션 마이그레이션 전 반드시 스테이징에서 테스트
- 테이블/컬럼 삭제 마이그레이션은 배포 후 최소 1 릴리즈 대기
- 대용량 테이블 인덱스 추가는 `CREATE INDEX CONCURRENTLY` 사용
