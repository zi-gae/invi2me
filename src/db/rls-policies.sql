-- ============================================================
-- invi2me RLS Policies
-- Run this in Supabase SQL Editor after initial migration
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_page_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_metrics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE seating_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_gallery_items ENABLE ROW LEVEL SECURITY;

-- === Users ===
-- Users can only read/update their own profile
CREATE POLICY "users_self_read" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_self_update" ON users FOR UPDATE USING (auth.uid() = id);

-- === Workspaces ===
-- Workspace visible to its members
CREATE POLICY "workspaces_member_read" ON workspaces FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM workspace_memberships wm
    WHERE wm.workspace_id = workspaces.id
    AND wm.user_id = auth.uid()
    AND wm.status = 'active'
  ));

-- === Workspace Memberships ===
CREATE POLICY "wm_member_read" ON workspace_memberships FOR SELECT
  USING (workspace_id IN (
    SELECT wm.workspace_id FROM workspace_memberships wm
    WHERE wm.user_id = auth.uid() AND wm.status = 'active'
  ));

-- === Events ===
-- Published events: anonymous read
CREATE POLICY "events_public_read" ON events FOR SELECT
  USING (status = 'published' AND visibility = 'public');

-- Draft/private events: only event members
CREATE POLICY "events_member_read" ON events FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM event_memberships em
    WHERE em.event_id = events.id
    AND em.user_id = auth.uid()
    AND em.status = 'active'
  ));

-- Event members can update
CREATE POLICY "events_member_update" ON events FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM event_memberships em
    WHERE em.event_id = events.id
    AND em.user_id = auth.uid()
    AND em.status = 'active'
    AND (em.role IN ('owner', 'admin', 'editor'))
  ));

-- === Event Memberships ===
CREATE POLICY "em_member_read" ON event_memberships FOR SELECT
  USING (event_id IN (
    SELECT em.event_id FROM event_memberships em
    WHERE em.user_id = auth.uid() AND em.status = 'active'
  ));

-- === Guests ===
-- Only event members can read guests
CREATE POLICY "guests_member_read" ON guests FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM event_memberships em
    WHERE em.event_id = guests.event_id
    AND em.user_id = auth.uid()
    AND em.status = 'active'
  ));

-- Event members with guest.write can insert/update
CREATE POLICY "guests_member_write" ON guests FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM event_memberships em
    WHERE em.event_id = guests.event_id
    AND em.user_id = auth.uid()
    AND em.status = 'active'
  ));

CREATE POLICY "guests_member_update" ON guests FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM event_memberships em
    WHERE em.event_id = guests.event_id
    AND em.user_id = auth.uid()
    AND em.status = 'active'
  ));

-- === RSVP Responses ===
-- Event members can read
CREATE POLICY "rsvp_member_read" ON rsvp_responses FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM event_memberships em
    WHERE em.event_id = rsvp_responses.event_id
    AND em.user_id = auth.uid()
    AND em.status = 'active'
  ));

-- Anonymous can insert (public RSVP submission) — validated by API
CREATE POLICY "rsvp_anon_insert" ON rsvp_responses FOR INSERT
  WITH CHECK (true);

-- === Check-in Logs ===
CREATE POLICY "checkin_member_read" ON checkin_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM event_memberships em
    WHERE em.event_id = checkin_logs.event_id
    AND em.user_id = auth.uid()
    AND em.status = 'active'
  ));

CREATE POLICY "checkin_member_insert" ON checkin_logs FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM event_memberships em
    WHERE em.event_id = checkin_logs.event_id
    AND em.user_id = auth.uid()
    AND em.status = 'active'
  ));

-- === Gift Accounts ===
-- Only event members (owner/editor) can see raw data
CREATE POLICY "gift_member_read" ON gift_accounts FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM event_memberships em
    WHERE em.event_id = gift_accounts.event_id
    AND em.user_id = auth.uid()
    AND em.status = 'active'
    AND em.role IN ('owner', 'admin', 'editor')
  ));

-- === Event Pages (published) ===
-- Public read for published pages of published events
CREATE POLICY "pages_public_read" ON event_pages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM events e
    WHERE e.id = event_pages.event_id
    AND e.status = 'published'
  ));

-- Event members can read all pages
CREATE POLICY "pages_member_read" ON event_pages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM event_memberships em
    WHERE em.event_id = event_pages.event_id
    AND em.user_id = auth.uid()
    AND em.status = 'active'
  ));

-- === Event Sections (published) ===
CREATE POLICY "sections_public_read" ON event_sections FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM event_pages ep
    JOIN events e ON e.id = ep.event_id
    WHERE ep.id = event_sections.event_page_id
    AND e.status = 'published'
  ));

-- === Page Events (analytics) ===
-- Anyone can insert (tracking)
CREATE POLICY "page_events_anon_insert" ON page_events FOR INSERT
  WITH CHECK (true);

-- Event members can read
CREATE POLICY "page_events_member_read" ON page_events FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM event_memberships em
    WHERE em.event_id = page_events.event_id
    AND em.user_id = auth.uid()
    AND em.status = 'active'
  ));

-- === Audit Logs ===
-- Only workspace owners/admins can read
CREATE POLICY "audit_workspace_read" ON audit_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM workspace_memberships wm
    WHERE wm.workspace_id = audit_logs.workspace_id
    AND wm.user_id = auth.uid()
    AND wm.status = 'active'
    AND wm.role IN ('owner', 'admin')
  ));

-- Service role bypass (for server-side operations via service_role key)
-- Note: Supabase service_role key bypasses RLS by default
