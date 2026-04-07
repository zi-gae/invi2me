import type { SectionBlockDto } from '../types/editor.dto';

interface SectionRendererProps {
  section: SectionBlockDto;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  switch (section.sectionType) {
    case 'hero':
      return <HeroSection props={section.propsJson} />;
    case 'countdown':
      return <CountdownSection props={section.propsJson} />;
    case 'invitation_message':
      return <InvitationMessageSection props={section.propsJson} />;
    case 'couple_profile':
      return <CoupleProfileSection props={section.propsJson} />;
    case 'event_schedule':
      return <EventScheduleSection props={section.propsJson} />;
    case 'location_map':
      return <LocationMapSection props={section.propsJson} />;
    case 'gallery':
      return <GallerySection props={section.propsJson} />;
    case 'gift_account':
      return <GiftAccountSection props={section.propsJson} />;
    case 'guestbook':
      return <GuestbookSection props={section.propsJson} />;
    case 'rsvp_form':
      return <RsvpFormSection props={section.propsJson} />;
    case 'faq':
      return <FaqSection props={section.propsJson} />;
    case 'contact_panel':
      return <ContactPanelSection props={section.propsJson} />;
    case 'notice_banner':
      return <NoticeBannerSection props={section.propsJson} />;
    default:
      return <DefaultSection type={section.sectionType} props={section.propsJson} />;
  }
}

// --- Individual Section Components (placeholder implementations) ---

function HeroSection({ props }: { props: Record<string, unknown> }) {
  const title = (props.title as string) ?? '';
  const subtitle = (props.subtitle as string) ?? '';
  const imageUrl = props.imageUrl as string | undefined;

  return (
    <section className="relative flex min-h-[60vh] items-center justify-center bg-gray-100 text-center">
      {imageUrl && (
        <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${imageUrl})` }} />
      )}
      <div className="relative z-10 px-4">
        <h1 className="text-4xl font-bold">{title}</h1>
        {subtitle && <p className="mt-4 text-lg text-gray-600">{subtitle}</p>}
      </div>
    </section>
  );
}

function CountdownSection({ props }: { props: Record<string, unknown> }) {
  const targetDate = props.targetDate as string | undefined;
  return (
    <section className="py-16 text-center">
      <h2 className="text-2xl font-semibold">D-Day</h2>
      {targetDate && <p className="mt-2 text-gray-500">{targetDate}</p>}
      {/* TODO: Client-side countdown timer */}
    </section>
  );
}

function InvitationMessageSection({ props }: { props: Record<string, unknown> }) {
  const message = (props.message as string) ?? '';
  return (
    <section className="mx-auto max-w-2xl px-4 py-16 text-center">
      <p className="whitespace-pre-line text-lg leading-relaxed text-gray-700">{message}</p>
    </section>
  );
}

function CoupleProfileSection({ props }: { props: Record<string, unknown> }) {
  const groomName = (props.groomName as string) ?? '';
  const brideName = (props.brideName as string) ?? '';
  return (
    <section className="py-16 text-center">
      <div className="flex items-center justify-center gap-8">
        <div><p className="text-xl font-medium">{groomName}</p></div>
        <span className="text-2xl text-gray-300">&amp;</span>
        <div><p className="text-xl font-medium">{brideName}</p></div>
      </div>
    </section>
  );
}

function EventScheduleSection({ props: _props }: { props: Record<string, unknown> }) {
  return (
    <section className="py-16 text-center">
      <h2 className="text-2xl font-semibold">일정 안내</h2>
      {/* TODO: Render schedule items from props */}
    </section>
  );
}

function LocationMapSection({ props }: { props: Record<string, unknown> }) {
  const address = (props.address as string) ?? '';
  const name = (props.name as string) ?? '';
  return (
    <section className="py-16 text-center">
      <h2 className="text-2xl font-semibold">오시는 길</h2>
      <p className="mt-2 font-medium">{name}</p>
      <p className="mt-1 text-gray-500">{address}</p>
      {/* TODO: Embed map */}
    </section>
  );
}

function GallerySection({ props: _props }: { props: Record<string, unknown> }) {
  return (
    <section className="py-16 text-center">
      <h2 className="text-2xl font-semibold">갤러리</h2>
      {/* TODO: Photo grid from props.images */}
    </section>
  );
}

function GiftAccountSection({ props: _props }: { props: Record<string, unknown> }) {
  return (
    <section className="py-16 text-center">
      <h2 className="text-2xl font-semibold">마음 전달</h2>
      {/* TODO: Masked account numbers */}
    </section>
  );
}

function GuestbookSection({ props: _props }: { props: Record<string, unknown> }) {
  return (
    <section className="py-16 text-center">
      <h2 className="text-2xl font-semibold">방명록</h2>
      {/* TODO: Guestbook messages */}
    </section>
  );
}

function RsvpFormSection({ props: _props }: { props: Record<string, unknown> }) {
  return (
    <section className="py-16 text-center">
      <h2 className="text-2xl font-semibold">참석 여부</h2>
      {/* TODO: RSVP form component */}
    </section>
  );
}

interface FaqItem {
  question: string;
  answer: string;
}

function FaqSection({ props }: { props: Record<string, unknown> }) {
  const title = (props.title as string) ?? '자주 묻는 질문';
  const items = (props.items as FaqItem[]) ?? [];

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <h2 className="mb-8 text-center text-2xl font-semibold">{title}</h2>
      {items.length === 0 ? null : (
        <div className="divide-y divide-gray-200">
          {items.map((item, i) => (
            <details key={i} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-gray-900">
                {item.question}
                <span className="shrink-0 text-gray-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.answer}</p>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}

function ContactPanelSection({ props: _props }: { props: Record<string, unknown> }) {
  return (
    <section className="py-16 text-center">
      <h2 className="text-2xl font-semibold">연락처</h2>
      {/* TODO: Contact info */}
    </section>
  );
}

function NoticeBannerSection({ props }: { props: Record<string, unknown> }) {
  const text = (props.text as string) ?? '';
  return (
    <section className="bg-yellow-50 px-4 py-4 text-center text-sm text-yellow-800">
      {text}
    </section>
  );
}

function DefaultSection({ type, props: _props }: { type: string; props: Record<string, unknown> }) {
  return (
    <section className="py-16 text-center">
      <p className="text-gray-400">섹션: {type}</p>
    </section>
  );
}
