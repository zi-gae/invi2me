import type { SectionBlockDto } from '../types/editor.dto';
import { HeroSection } from './sections/hero-section';
import { CountdownSection } from './sections/countdown-section';
import { InvitationMessageSection } from './sections/invitation-message-section';
import { CoupleProfileSection } from './sections/couple-profile-section';
import { EventScheduleSection } from './sections/event-schedule-section';
import { LocationMapSection } from './sections/location-map-section';
import { TransportGuideSection } from './sections/transport-guide-section';
import { ParkingInfoSection } from './sections/parking-info-section';
import { GallerySection } from './sections/gallery-section';
import { VideoSection } from './sections/video-section';
import { GiftAccountSection } from './sections/gift-account-section';
import { GuestbookSection } from './sections/guestbook-section';
import { RsvpFormSection } from './sections/rsvp-form-section';
import { TimelineSection } from './sections/timeline-section';
import { DressCodeSection } from './sections/dress-code-section';
import { AccommodationGuideSection } from './sections/accommodation-guide-section';
import { FaqSection } from './sections/faq-section';
import { ContactPanelSection } from './sections/contact-panel-section';
import { NoticeBannerSection } from './sections/notice-banner-section';

interface SectionRendererProps {
  section: SectionBlockDto;
  eventSlug: string;
}

export function SectionRenderer({ section, eventSlug }: SectionRendererProps) {
  if (!section.isEnabled) return null;

  const p = section.propsJson;

  switch (section.sectionType) {
    case 'hero':
      return <HeroSection props={p} />;
    case 'countdown':
      return <CountdownSection props={p} />;
    case 'invitation_message':
      return <InvitationMessageSection props={p} />;
    case 'couple_profile':
      return <CoupleProfileSection props={p} />;
    case 'event_schedule':
      return <EventScheduleSection props={p} />;
    case 'location_map':
      return <LocationMapSection props={p} />;
    case 'transport_guide':
      return <TransportGuideSection props={p} />;
    case 'parking_info':
      return <ParkingInfoSection props={p} />;
    case 'gallery':
      return <GallerySection props={p} />;
    case 'video':
      return <VideoSection props={p} />;
    case 'gift_account':
      return <GiftAccountSection props={p} />;
    case 'guestbook':
      return <GuestbookSection props={p} eventSlug={eventSlug} />;
    case 'rsvp_form':
      return <RsvpFormSection props={p} eventSlug={eventSlug} />;
    case 'timeline':
      return <TimelineSection props={p} />;
    case 'dress_code':
      return <DressCodeSection props={p} />;
    case 'accommodation_guide':
      return <AccommodationGuideSection props={p} />;
    case 'faq':
      return <FaqSection props={p} />;
    case 'contact_panel':
      return <ContactPanelSection props={p} />;
    case 'notice_banner':
      return <NoticeBannerSection props={p} />;
    default:
      return null;
  }
}
