'use client';

/**
 * 각 섹션 타입별 props 편집 폼 dispatcher.
 * SectionEditDialog 에서 sectionType에 따라 라우팅됩니다.
 */

import { HeroPropsForm } from './forms/hero-props-form';
import { CountdownPropsForm } from './forms/countdown-props-form';
import { InvitationMessagePropsForm } from './forms/invitation-message-props-form';
import { CoupleProfilePropsForm } from './forms/couple-profile-props-form';
import { EventSchedulePropsForm } from './forms/event-schedule-props-form';
import { LocationMapPropsForm } from './forms/location-map-props-form';
import { TransportGuidePropsForm } from './forms/transport-guide-props-form';
import { ParkingInfoPropsForm } from './forms/parking-info-props-form';
import { GalleryPropsForm } from './forms/gallery-props-form';
import { VideoPropsForm } from './forms/video-props-form';
import { GiftAccountPropsForm } from './forms/gift-account-props-form';
import { GuestbookPropsForm } from './forms/guestbook-props-form';
import { RsvpFormPropsForm } from './forms/rsvp-form-props-form';
import { TimelinePropsForm } from './forms/timeline-props-form';
import { DressCodePropsForm } from './forms/dress-code-props-form';
import { AccommodationGuidePropsForm } from './forms/accommodation-guide-props-form';
import { FaqPropsForm } from './forms/faq-props-form';
import { ContactPanelPropsForm } from './forms/contact-panel-props-form';
import { NoticeBannerPropsForm } from './forms/notice-banner-props-form';

interface SectionPropsFormProps {
  sectionType: string;
  props: Record<string, unknown>;
  onChange: (updated: Record<string, unknown>) => void;
  eventId: string;
}

export function SectionPropsForm({ sectionType, props, onChange, eventId }: SectionPropsFormProps) {
  const formProps = { props, onChange, eventId };
  switch (sectionType) {
    case 'hero':               return <HeroPropsForm {...formProps} />;
    case 'countdown':          return <CountdownPropsForm {...formProps} />;
    case 'invitation_message': return <InvitationMessagePropsForm {...formProps} />;
    case 'couple_profile':     return <CoupleProfilePropsForm {...formProps} />;
    case 'event_schedule':     return <EventSchedulePropsForm {...formProps} />;
    case 'location_map':       return <LocationMapPropsForm {...formProps} />;
    case 'transport_guide':    return <TransportGuidePropsForm {...formProps} />;
    case 'parking_info':       return <ParkingInfoPropsForm {...formProps} />;
    case 'gallery':            return <GalleryPropsForm {...formProps} />;
    case 'video':              return <VideoPropsForm {...formProps} />;
    case 'gift_account':       return <GiftAccountPropsForm {...formProps} />;
    case 'guestbook':          return <GuestbookPropsForm {...formProps} />;
    case 'rsvp_form':          return <RsvpFormPropsForm {...formProps} />;
    case 'timeline':           return <TimelinePropsForm {...formProps} />;
    case 'dress_code':         return <DressCodePropsForm {...formProps} />;
    case 'accommodation_guide':return <AccommodationGuidePropsForm {...formProps} />;
    case 'faq':                return <FaqPropsForm {...formProps} />;
    case 'contact_panel':      return <ContactPanelPropsForm {...formProps} />;
    case 'notice_banner':      return <NoticeBannerPropsForm {...formProps} />;
    default:                   return <p className="py-4 text-center text-sm text-stone-400">이 섹션 타입은 아직 편집 폼이 없습니다.</p>;
  }
}
