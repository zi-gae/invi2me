# 5. 기술 스택

## 5.1 최종 권장 스택

### Frontend
- **Next.js 16+ (App Router)**
- **TypeScript**
- **React 19 계열**
- **Tailwind CSS v4**
- **shadcn/ui**
- **Framer Motion**
- **TanStack Query**
- **React Hook Form**
- **Zod**
- **nuqs** for URL state

### Backend / Fullstack
- **Next.js Route Handlers + Server Actions**
- **Supabase**
  - PostgreSQL
  - Auth
  - Storage
  - Realtime
  - Edge Functions (선택)
- **Drizzle ORM** 권장
- **Kysely** 또는 raw SQL 혼합 허용
- **pgmq / Supabase queues 대체 전략** 또는 **Trigger.dev** for async jobs

### Infra / DevOps
- **Vercel**
- **Supabase Cloud**
- **Cloudflare**
  - DNS
  - WAF
  - Image Optimization (선택)
  - Turnstile
- **Resend** for transactional email
- **Twilio** or local SMS provider abstraction
- **Sentry**
- **PostHog**
- **OpenTelemetry**
- **GitHub Actions**

### CMS / Authoring Support
- 별도 CMS 도입하지 않음
- 자체 블록 편집기 + JSON schema 기반 렌더러
- 이미지 업로드는 Supabase Storage 직접 사용

### Payments / Commerce
- **Stripe**
- 향후 한국 결제 대행사 추상화 레이어 도입 가능

## 5.2 스택 선택 이유

### Next.js
- 공개 이벤트 페이지, 관리자 콘솔, API, 인증 연계를 단일 코드베이스로 처리 가능
- SEO 대응 가능
- 서버 컴포넌트 기반으로 초기 렌더 성능 확보 가능

### Supabase
- Postgres를 중심으로 Auth, Storage, RLS까지 통합
- 프론트엔드 개발자에게 운영 난이도가 낮음
- 멀티테넌시와 RBAC 구현 시 생산성이 높음

### Drizzle
- 타입 안정성과 SQL 가시성이 좋음
- Prisma 대비 더 가볍고 세밀한 제어 가능
- 복합 인덱스/partial index/enum/view/materialized view 전략과 궁합이 좋음

### PostHog + Sentry
- 제품 분석과 에러 모니터링을 분리
- 초기 운영 품질 확보에 유리
