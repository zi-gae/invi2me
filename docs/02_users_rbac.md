# 3. 사용자 유형과 권한 모델

## 3.1 액터 정의

### 개인 사용자
- bride_or_groom_owner
- co_owner

### 외부 운영자
- planner_manager
- planner_editor
- venue_operator
- photographer_collaborator

### 조직 사용자
- org_owner
- org_admin
- org_editor
- org_analyst
- org_checkin_staff
- org_viewer

### 공개 사용자
- invited_guest
- anonymous_visitor

## 3.2 권한 레벨

### Workspace 레벨
- 청구/플랜/조직 설정
- 사용자 초대
- 도메인 및 브랜드 설정

### Event 레벨
- 이벤트 편집
- 게스트 관리
- 응답 보기
- 메시지 발송
- 체크인 진행
- 리포트 조회

### Guest 레벨
- 본인 RSVP 응답
- 동반인 응답
- 개인화 링크 접근

## 3.3 RBAC 설계 원칙

- `workspace_memberships`
- `organization_memberships`
- `event_memberships`

세 계층으로 분리한다.

권한은 문자열 enum이 아니라 **permission set**으로 확장 가능하게 설계한다.

예:
- `event.edit`
- `event.publish`
- `guest.read`
- `guest.write`
- `guest.checkin`
- `message.send`
- `report.read`
- `billing.manage`
