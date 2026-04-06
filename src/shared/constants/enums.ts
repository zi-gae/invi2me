// Domain Enums — all enum-like types used across the platform

// === Event ===
export const EVENT_STATUS = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;
export type EventStatus = (typeof EVENT_STATUS)[keyof typeof EVENT_STATUS];

export const EVENT_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  INVITE_ONLY: 'invite_only',
  PASSWORD_PROTECTED: 'password_protected',
} as const;
export type EventVisibility =
  (typeof EVENT_VISIBILITY)[keyof typeof EVENT_VISIBILITY];

export const EVENT_TYPE = {
  WEDDING: 'wedding',
  WEDDING_RECEPTION: 'wedding_reception',
  AFTER_PARTY: 'after_party',
  BABY_SHOWER: 'baby_shower',
  FIRST_BIRTHDAY: 'first_birthday',
  BRIDAL_SHOWER: 'bridal_shower',
  PRIVATE_PARTY: 'private_party',
  CORPORATE_INVITATION: 'corporate_invitation',
  SEMINAR: 'seminar',
  VIP_EVENT: 'vip_event',
} as const;
export type EventType = (typeof EVENT_TYPE)[keyof typeof EVENT_TYPE];

// === Workspace ===
export const WORKSPACE_TYPE = {
  PERSONAL: 'personal',
  BUSINESS: 'business',
} as const;
export type WorkspaceType =
  (typeof WORKSPACE_TYPE)[keyof typeof WORKSPACE_TYPE];

export const PLAN_CODE = {
  FREE: 'free',
  STARTER: 'starter',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const;
export type PlanCode = (typeof PLAN_CODE)[keyof typeof PLAN_CODE];

// === Status (reusable) ===
export const ENTITY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  ARCHIVED: 'archived',
} as const;
export type EntityStatus =
  (typeof ENTITY_STATUS)[keyof typeof ENTITY_STATUS];

export const MEMBERSHIP_STATUS = {
  ACTIVE: 'active',
  INVITED: 'invited',
  SUSPENDED: 'suspended',
} as const;
export type MembershipStatus =
  (typeof MEMBERSHIP_STATUS)[keyof typeof MEMBERSHIP_STATUS];

// === Roles ===
export const WORKSPACE_ROLE = {
  OWNER: 'owner',
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const;
export type WorkspaceRole =
  (typeof WORKSPACE_ROLE)[keyof typeof WORKSPACE_ROLE];

export const ORGANIZATION_ROLE = {
  OWNER: 'owner',
  ADMIN: 'admin',
  EDITOR: 'editor',
  ANALYST: 'analyst',
  CHECKIN_STAFF: 'checkin_staff',
  VIEWER: 'viewer',
} as const;
export type OrganizationRole =
  (typeof ORGANIZATION_ROLE)[keyof typeof ORGANIZATION_ROLE];

export const EVENT_ROLE = {
  OWNER: 'owner',
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
  CHECKIN_STAFF: 'checkin_staff',
  PLANNER: 'planner',
} as const;
export type EventRole = (typeof EVENT_ROLE)[keyof typeof EVENT_ROLE];

// === Permissions ===
export const PERMISSION = {
  EVENT_EDIT: 'event.edit',
  EVENT_PUBLISH: 'event.publish',
  GUEST_READ: 'guest.read',
  GUEST_WRITE: 'guest.write',
  GUEST_CHECKIN: 'guest.checkin',
  MESSAGE_SEND: 'message.send',
  REPORT_READ: 'report.read',
  BILLING_MANAGE: 'billing.manage',
} as const;
export type Permission = (typeof PERMISSION)[keyof typeof PERMISSION];

// === Guest ===
export const GUEST_TYPE = {
  PRIMARY: 'primary',
  COMPANION: 'companion',
  CHILD: 'child',
  VIP: 'vip',
} as const;
export type GuestType = (typeof GUEST_TYPE)[keyof typeof GUEST_TYPE];

export const GUEST_SIDE = {
  BRIDE: 'bride',
  GROOM: 'groom',
  BOTH: 'both',
} as const;
export type GuestSide = (typeof GUEST_SIDE)[keyof typeof GUEST_SIDE];

export const GUEST_STATUS = {
  INVITED: 'invited',
  RESPONDED: 'responded',
  CHECKED_IN: 'checked_in',
  DECLINED: 'declined',
} as const;
export type GuestStatus = (typeof GUEST_STATUS)[keyof typeof GUEST_STATUS];

// === RSVP ===
export const ATTENDANCE_STATUS = {
  ATTENDING: 'attending',
  NOT_ATTENDING: 'not_attending',
  MAYBE: 'maybe',
} as const;
export type AttendanceStatus =
  (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];

export const RSVP_SOURCE = {
  PUBLIC_LINK: 'public_link',
  PERSONAL_LINK: 'personal_link',
  ADMIN_ENTRY: 'admin_entry',
} as const;
export type RsvpSource = (typeof RSVP_SOURCE)[keyof typeof RSVP_SOURCE];

// === Check-in ===
export const CHECKIN_METHOD = {
  QR: 'qr',
  MANUAL: 'manual',
  SEARCH: 'search',
} as const;
export type CheckinMethod =
  (typeof CHECKIN_METHOD)[keyof typeof CHECKIN_METHOD];

export const CHECKIN_STATUS = {
  SUCCESS: 'success',
  DUPLICATE: 'duplicate',
  DENIED: 'denied',
} as const;
export type CheckinStatus =
  (typeof CHECKIN_STATUS)[keyof typeof CHECKIN_STATUS];

// === Content ===
export const PAGE_TYPE = {
  MAIN: 'main',
  RSVP: 'rsvp',
  GIFT: 'gift',
  GALLERY: 'gallery',
  FAQ: 'faq',
} as const;
export type PageType = (typeof PAGE_TYPE)[keyof typeof PAGE_TYPE];

export const SECTION_TYPE = {
  HERO: 'hero',
  COUNTDOWN: 'countdown',
  INVITATION_MESSAGE: 'invitation_message',
  COUPLE_PROFILE: 'couple_profile',
  EVENT_SCHEDULE: 'event_schedule',
  LOCATION_MAP: 'location_map',
  TRANSPORT_GUIDE: 'transport_guide',
  PARKING_INFO: 'parking_info',
  GALLERY: 'gallery',
  VIDEO: 'video',
  FAQ: 'faq',
  CONTACT_PANEL: 'contact_panel',
  GIFT_ACCOUNT: 'gift_account',
  GUESTBOOK: 'guestbook',
  RSVP_FORM: 'rsvp_form',
  TIMELINE: 'timeline',
  DRESS_CODE: 'dress_code',
  ACCOMMODATION_GUIDE: 'accommodation_guide',
  NOTICE_BANNER: 'notice_banner',
  SPONSOR_OR_BRAND_BLOCK: 'sponsor_or_brand_block',
} as const;
export type SectionType = (typeof SECTION_TYPE)[keyof typeof SECTION_TYPE];

// === Asset ===
export const ASSET_TYPE = {
  IMAGE: 'image',
  VIDEO: 'video',
  PDF: 'pdf',
  AUDIO: 'audio',
} as const;
export type AssetType = (typeof ASSET_TYPE)[keyof typeof ASSET_TYPE];

// === Organization ===
export const BUSINESS_TYPE = {
  WEDDING_HALL: 'wedding_hall',
  PLANNER: 'planner',
  STUDIO: 'studio',
  CORPORATE: 'corporate',
} as const;
export type BusinessType =
  (typeof BUSINESS_TYPE)[keyof typeof BUSINESS_TYPE];

// === Campaign / Messaging ===
export const CHANNEL_TYPE = {
  EMAIL: 'email',
  SMS: 'sms',
  KAKAO: 'kakao',
  WEBHOOK: 'webhook',
} as const;
export type ChannelType = (typeof CHANNEL_TYPE)[keyof typeof CHANNEL_TYPE];

export const CAMPAIGN_STATUS = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  SENDING: 'sending',
  SENT: 'sent',
  FAILED: 'failed',
} as const;
export type CampaignStatus =
  (typeof CAMPAIGN_STATUS)[keyof typeof CAMPAIGN_STATUS];

export const DELIVERY_STATUS = {
  QUEUED: 'queued',
  SENT: 'sent',
  DELIVERED: 'delivered',
  FAILED: 'failed',
  OPENED: 'opened',
  CLICKED: 'clicked',
} as const;
export type DeliveryStatus =
  (typeof DELIVERY_STATUS)[keyof typeof DELIVERY_STATUS];

// === Table / Seating ===
export const TABLE_SHAPE = {
  ROUND: 'round',
  RECT: 'rect',
  CUSTOM: 'custom',
} as const;
export type TableShape = (typeof TABLE_SHAPE)[keyof typeof TABLE_SHAPE];

// === Schedule ===
export const SCHEDULE_TYPE = {
  CEREMONY: 'ceremony',
  RECEPTION: 'reception',
  AFTER_PARTY: 'after_party',
  REHEARSAL: 'rehearsal',
  OTHER: 'other',
} as const;
export type ScheduleType =
  (typeof SCHEDULE_TYPE)[keyof typeof SCHEDULE_TYPE];

// === Relationship ===
export const RELATIONSHIP_TYPE = {
  COMPANION: 'companion',
  FAMILY: 'family',
  CHILD: 'child',
  TABLEMATE: 'tablemate',
} as const;
export type RelationshipType =
  (typeof RELATIONSHIP_TYPE)[keyof typeof RELATIONSHIP_TYPE];

// === Order ===
export const ORDER_TYPE = {
  SUBSCRIPTION: 'subscription',
  ADD_ON: 'add_on',
  PREMIUM_TEMPLATE: 'premium_template',
  DOMAIN: 'domain',
} as const;
export type OrderType = (typeof ORDER_TYPE)[keyof typeof ORDER_TYPE];

export const ORDER_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

// === Analytics ===
export const PAGE_EVENT_NAME = {
  PAGE_VIEW: 'page_view',
  RSVP_STARTED: 'rsvp_started',
  RSVP_COMPLETED: 'rsvp_completed',
  MAP_CLICKED: 'map_clicked',
} as const;
export type PageEventName =
  (typeof PAGE_EVENT_NAME)[keyof typeof PAGE_EVENT_NAME];

// === Domain ===
export const DOMAIN_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  ACTIVE: 'active',
  FAILED: 'failed',
} as const;
export type DomainStatus =
  (typeof DOMAIN_STATUS)[keyof typeof DOMAIN_STATUS];

export const SSL_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  FAILED: 'failed',
} as const;
export type SslStatus = (typeof SSL_STATUS)[keyof typeof SSL_STATUS];
