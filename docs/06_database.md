# 7. 데이터베이스 설계 원칙

## 7.1 핵심 원칙

1. 모든 주요 테이블은 `workspace_id` 또는 `organization_id` 또는 `event_id`를 가진다.
2. 개인 서비스처럼 보여도 내부는 멀티테넌트 SaaS로 설계한다.
3. soft delete, audit log, published snapshot 전략을 초기부터 포함한다.
4. 페이지 편집 데이터는 relational + JSONB 혼합 전략을 쓴다.
5. 게스트 응답/이벤트 로그는 append-only 성격을 유지한다.

## 7.2 식별자 전략

- 내부 PK: `uuid`
- 외부 노출용: `public_id` / `slug`
- QR, 초대링크, 개인화 링크에는 별도 random token 사용

## 7.3 공통 컬럼

모든 핵심 테이블 공통:

- `id uuid primary key`
- `created_at timestamptz`
- `updated_at timestamptz`
- `created_by uuid nullable`
- `updated_by uuid nullable`
- `deleted_at timestamptz nullable`
- `version int not null default 1`

---

# 8. 데이터베이스 스키마

## 8.1 identity / workspace

### users
```sql
id uuid pk
email text unique not null
name text
avatar_url text
phone text
locale text default 'ko'
timezone text default 'Asia/Seoul'
status text not null
last_login_at timestamptz
created_at timestamptz
updated_at timestamptz
```

### workspaces
```sql
id uuid pk
slug text unique not null
name text not null
type text not null -- personal | business
owner_user_id uuid not null
plan_code text not null
status text not null
default_locale text not null default 'ko'
default_timezone text not null default 'Asia/Seoul'
created_at timestamptz
updated_at timestamptz
```

### workspace_memberships
```sql
id uuid pk
workspace_id uuid not null
user_id uuid not null
role text not null
permissions jsonb not null default '[]'
status text not null
created_at timestamptz
updated_at timestamptz
unique(workspace_id, user_id)
```

### organizations
```sql
id uuid pk
workspace_id uuid not null
slug text unique not null
name text not null
business_type text not null -- wedding_hall | planner | studio | corporate
brand_name text
logo_url text
primary_color text
status text not null
created_at timestamptz
updated_at timestamptz
```

### organization_memberships
```sql
id uuid pk
organization_id uuid not null
user_id uuid not null
role text not null
permissions jsonb not null default '[]'
status text not null
created_at timestamptz
updated_at timestamptz
unique(organization_id, user_id)
```

## 8.2 events

### events
```sql
id uuid pk
workspace_id uuid not null
organization_id uuid null
slug text unique not null
event_type text not null
title text not null
subtitle text
status text not null -- draft | scheduled | published | archived
visibility text not null -- public | private | invite_only | password_protected
access_password_hash text null
owner_user_id uuid not null
template_id uuid null
theme_id uuid null
primary_locale text not null default 'ko'
default_timezone text not null default 'Asia/Seoul'
cover_image_url text null
hero_layout text null
published_at timestamptz null
starts_at timestamptz null
ends_at timestamptz null
rsvp_opens_at timestamptz null
rsvp_closes_at timestamptz null
checkin_enabled boolean not null default false
messaging_enabled boolean not null default true
analytics_enabled boolean not null default true
custom_domain_id uuid null
seo_title text null
seo_description text null
og_image_url text null
created_at timestamptz
updated_at timestamptz
```

### event_memberships
```sql
id uuid pk
event_id uuid not null
user_id uuid not null
role text not null
permissions jsonb not null default '[]'
status text not null
created_at timestamptz
updated_at timestamptz
unique(event_id, user_id)
```

### event_schedules
```sql
id uuid pk
event_id uuid not null
name text not null -- 본식 / 피로연 / 2부
schedule_type text not null
starts_at timestamptz not null
ends_at timestamptz null
location_id uuid null
description text null
sort_order int not null default 0
created_at timestamptz
updated_at timestamptz
```

### event_locations
```sql
id uuid pk
event_id uuid not null
name text not null
address_line1 text
address_line2 text
city text
region text
postal_code text
country_code text not null default 'KR'
latitude numeric(10,7)
longitude numeric(10,7)
map_provider text
map_url text
parking_guide text null
transportation_guide text null
created_at timestamptz
updated_at timestamptz
```

## 8.3 event content / editor

### event_pages
```sql
id uuid pk
event_id uuid not null
locale text not null
title text null
slug text not null
page_type text not null -- main | rsvp | gift | gallery | faq
status text not null -- draft | published
is_home boolean not null default false
published_version_id uuid null
created_at timestamptz
updated_at timestamptz
unique(event_id, locale, slug)
```

### event_page_versions
```sql
id uuid pk
event_page_id uuid not null
version_no int not null
schema_version int not null
content_json jsonb not null
theme_tokens jsonb not null default '{}'
published_at timestamptz null
created_by uuid null
created_at timestamptz
unique(event_page_id, version_no)
```

### event_sections
```sql
id uuid pk
event_page_id uuid not null
section_type text not null
section_key text not null
sort_order int not null
is_enabled boolean not null default true
props_json jsonb not null default '{}'
visibility_rules jsonb not null default '{}'
created_at timestamptz
updated_at timestamptz
unique(event_page_id, section_key)
```

### event_assets
```sql
id uuid pk
event_id uuid not null
asset_type text not null -- image | video | pdf | audio
storage_bucket text not null
storage_path text not null
mime_type text not null
file_size bigint not null
width int null
height int null
duration_ms int null
alt_text text null
metadata_json jsonb not null default '{}'
created_by uuid null
created_at timestamptz
updated_at timestamptz
```

### event_galleries
```sql
id uuid pk
event_id uuid not null
name text not null
layout_type text not null
is_public boolean not null default true
sort_order int not null default 0
created_at timestamptz
updated_at timestamptz
```

### event_gallery_items
```sql
id uuid pk
gallery_id uuid not null
asset_id uuid not null
caption text null
sort_order int not null default 0
created_at timestamptz
updated_at timestamptz
```

## 8.4 themes / templates

### event_templates
```sql
id uuid pk
workspace_id uuid null
organization_id uuid null
code text unique not null
name text not null
description text null
event_type text not null
category text not null
is_system boolean not null default false
is_public boolean not null default false
preview_image_url text null
base_schema_json jsonb not null
default_theme_tokens jsonb not null
created_at timestamptz
updated_at timestamptz
```

### event_themes
```sql
id uuid pk
workspace_id uuid null
organization_id uuid null
name text not null
theme_tokens jsonb not null
font_tokens jsonb not null
radius_tokens jsonb not null
shadow_tokens jsonb not null
motion_tokens jsonb not null
created_at timestamptz
updated_at timestamptz
```

### custom_domains
```sql
id uuid pk
workspace_id uuid not null
organization_id uuid null
domain text unique not null
status text not null
verification_token text not null
ssl_status text not null
connected_at timestamptz null
created_at timestamptz
updated_at timestamptz
```

## 8.5 guests / RSVP

### guest_groups
```sql
id uuid pk
event_id uuid not null
name text not null -- 가족 / 친구 / 회사 / 신부측 / 신랑측
color text null
sort_order int not null default 0
created_at timestamptz
updated_at timestamptz
unique(event_id, name)
```

### guests
```sql
id uuid pk
event_id uuid not null
guest_group_id uuid null
first_name text
last_name text
full_name text not null
email text null
phone text null
locale text null
guest_type text not null -- primary | companion | child | vip
side_type text null -- bride | groom | both
status text not null -- invited | responded | checked_in | declined
notes text null
external_ref text null
plus_one_allowed boolean not null default false
max_companion_count int not null default 0
seat_assignment_required boolean not null default false
invitation_channel text null
invitation_token text unique null
personal_access_code text unique null
created_at timestamptz
updated_at timestamptz
```

### guest_tags
```sql
id uuid pk
event_id uuid not null
name text not null
created_at timestamptz
updated_at timestamptz
unique(event_id, name)
```

### guest_tag_assignments
```sql
id uuid pk
guest_id uuid not null
guest_tag_id uuid not null
created_at timestamptz
unique(guest_id, guest_tag_id)
```

### guest_relationships
```sql
id uuid pk
event_id uuid not null
primary_guest_id uuid not null
related_guest_id uuid not null
relationship_type text not null -- companion | family | child | tablemate
created_at timestamptz
unique(primary_guest_id, related_guest_id, relationship_type)
```

### rsvp_forms
```sql
id uuid pk
event_id uuid not null
name text not null
is_default boolean not null default false
schema_json jsonb not null
status text not null
created_at timestamptz
updated_at timestamptz
```

### rsvp_responses
```sql
id uuid pk
event_id uuid not null
rsvp_form_id uuid not null
guest_id uuid not null
attendance_status text not null -- attending | not_attending | maybe
party_size int not null default 1
meal_count int not null default 0
submitted_at timestamptz not null
source_type text not null -- public_link | personal_link | admin_entry
source_ref text null
answers_json jsonb not null default '{}'
message_to_couple text null
consents_json jsonb not null default '{}'
created_at timestamptz
updated_at timestamptz
unique(event_id, guest_id)
```

### rsvp_response_history
```sql
id uuid pk
rsvp_response_id uuid not null
previous_value jsonb not null
new_value jsonb not null
changed_by uuid null
changed_at timestamptz not null
```

## 8.6 seating / operations

### seating_areas
```sql
id uuid pk
event_id uuid not null
name text not null
sort_order int not null default 0
created_at timestamptz
updated_at timestamptz
```

### tables
```sql
id uuid pk
event_id uuid not null
seating_area_id uuid null
name text not null
capacity int not null
shape text not null -- round | rect | custom
sort_order int not null default 0
metadata_json jsonb not null default '{}'
created_at timestamptz
updated_at timestamptz
```

### table_assignments
```sql
id uuid pk
event_id uuid not null
guest_id uuid not null
table_id uuid not null
seat_label text null
assigned_at timestamptz not null
assigned_by uuid null
unique(event_id, guest_id)
```

### checkin_sessions
```sql
id uuid pk
event_id uuid not null
name text not null
schedule_id uuid null
starts_at timestamptz null
ends_at timestamptz null
status text not null
created_at timestamptz
updated_at timestamptz
```

### checkin_logs
```sql
id uuid pk
event_id uuid not null
checkin_session_id uuid null
guest_id uuid not null
method text not null -- qr | manual | search
status text not null -- success | duplicate | denied
checked_in_at timestamptz not null
checked_in_by uuid null
device_info jsonb not null default '{}'
created_at timestamptz
```

### qr_tokens
```sql
id uuid pk
event_id uuid not null
guest_id uuid not null
token text unique not null
expires_at timestamptz null
revoked_at timestamptz null
created_at timestamptz
```

## 8.7 messaging / invitations

### channels
```sql
id uuid pk
workspace_id uuid not null
provider text not null -- email | sms | kakao | webhook
provider_config_ref text not null
status text not null
created_at timestamptz
updated_at timestamptz
```

### message_templates
```sql
id uuid pk
workspace_id uuid null
organization_id uuid null
channel_type text not null
name text not null
subject_template text null
body_template text not null
variables_json jsonb not null default '[]'
is_system boolean not null default false
created_at timestamptz
updated_at timestamptz
```

### campaigns
```sql
id uuid pk
event_id uuid not null
channel_type text not null
name text not null
status text not null -- draft | scheduled | sending | sent | failed
message_template_id uuid null
scheduled_at timestamptz null
filter_json jsonb not null default '{}'
created_by uuid null
created_at timestamptz
updated_at timestamptz
```

### campaign_deliveries
```sql
id uuid pk
campaign_id uuid not null
guest_id uuid not null
status text not null -- queued | sent | delivered | failed | opened | clicked
provider_message_id text null
error_message text null
sent_at timestamptz null
delivered_at timestamptz null
opened_at timestamptz null
clicked_at timestamptz null
tracking_link_id uuid null
created_at timestamptz
updated_at timestamptz
unique(campaign_id, guest_id)
```

### tracking_links
```sql
id uuid pk
event_id uuid not null
campaign_id uuid null
code text unique not null
source text null
medium text null
campaign text null
content text null
target_url text not null
created_at timestamptz
updated_at timestamptz
```

## 8.8 payments / gifts

### gift_accounts
```sql
id uuid pk
event_id uuid not null
account_holder_name text not null
bank_name text not null
account_number_encrypted text not null
account_type text null
is_visible boolean not null default true
sort_order int not null default 0
created_at timestamptz
updated_at timestamptz
```

### gift_messages
```sql
id uuid pk
event_id uuid not null
guest_id uuid null
name text null
message text not null
is_public boolean not null default false
created_at timestamptz
updated_at timestamptz
```

### orders
```sql
id uuid pk
workspace_id uuid not null
event_id uuid null
order_type text not null -- subscription | add_on | premium_template | domain
status text not null
currency text not null default 'KRW'
amount_total bigint not null
provider text not null
provider_order_id text null
created_at timestamptz
updated_at timestamptz
```

## 8.9 analytics / audit

### page_events
```sql
id bigserial pk
event_id uuid not null
guest_id uuid null
session_id text null
event_name text not null -- page_view | rsvp_started | rsvp_completed | map_clicked
path text null
referrer text null
user_agent text null
utm_json jsonb not null default '{}'
metadata_json jsonb not null default '{}'
occurred_at timestamptz not null
```

### event_metrics_daily
```sql
id uuid pk
event_id uuid not null
metric_date date not null
page_views int not null default 0
unique_visitors int not null default 0
rsvp_started int not null default 0
rsvp_completed int not null default 0
attending_count int not null default 0
declined_count int not null default 0
checkins int not null default 0
shares int not null default 0
created_at timestamptz
updated_at timestamptz
unique(event_id, metric_date)
```

### audit_logs
```sql
id bigserial pk
workspace_id uuid not null
organization_id uuid null
event_id uuid null
actor_user_id uuid null
entity_type text not null
entity_id uuid null
action text not null
before_json jsonb null
after_json jsonb null
ip_address inet null
user_agent text null
created_at timestamptz not null
```

---

# 9. 인덱스 및 성능 전략

## 9.1 필수 인덱스

- `events(slug)` unique
- `events(workspace_id, status)`
- `guests(event_id, status)`
- `guests(event_id, guest_group_id)`
- `rsvp_responses(event_id, attendance_status)`
- `campaign_deliveries(campaign_id, status)`
- `checkin_logs(event_id, checked_in_at desc)`
- `page_events(event_id, occurred_at desc)`
- `event_metrics_daily(event_id, metric_date desc)`

## 9.2 JSONB 인덱스

아래는 GIN 인덱스 고려:
- `event_page_versions.content_json`
- `rsvp_responses.answers_json`
- `page_events.metadata_json`

## 9.3 읽기 최적화

- 이벤트 공개 페이지는 published snapshot 기준 조회
- 운영 대시보드는 materialized view 또는 pre-aggregated daily metrics 사용
- 체크인 화면은 검색 성능을 위해 `guest_search_vector` 도입 고려
