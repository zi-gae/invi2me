# 12. 페이지 빌더 설계

## 12.1 방향

노코드 CMS를 통째로 도입하지 않고, **이벤트 페이지에 최적화된 제한형 블록 에디터**를 구현한다.

## 12.2 블록 타입

- hero
- countdown
- invitation_message
- couple_profile
- event_schedule
- location_map
- transport_guide
- parking_info
- gallery
- video
- faq
- contact_panel
- gift_account
- guestbook
- rsvp_form
- timeline
- dress_code
- accommodation_guide
- notice_banner
- sponsor_or_brand_block

## 12.3 블록 데이터 원칙

각 블록은 다음 구조를 가진다.

```ts
interface SectionBlock<TProps> {
  id: string;
  type: string;
  enabled: boolean;
  props: TProps;
  visibilityRules?: VisibilityRule[];
}
```

## 12.4 버전 관리

- draft version
- published version
- restore version
- diff viewer

공개 페이지는 항상 published snapshot만 참조한다.

---

# 13. 리포팅 설계

## 13.1 주요 지표

### 유입
- page views
- unique visitors
- top referrers
- UTM별 유입
- 공유 링크별 유입

### 전환
- RSVP start rate
- RSVP completion rate
- 참석/불참 비율
- 일정별 참석 비율
- 그룹별 응답률

### 운영
- 체크인 수
- 체크인 완료율
- 노쇼 추정치
- 테이블 배정 완료율
- 메시지 발송 성공률

### B2B
- 조직별 이벤트 수
- 템플릿별 전환 성과
- 채널별 응답 성과
- 고객사별 운영 효율

## 13.2 집계 전략

- raw event log 저장
- daily aggregate 생성
- 운영 대시보드는 aggregate 우선 조회
- drill-down이 필요할 때 raw log 사용
