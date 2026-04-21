'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionActions } from './section-actions';
import { SectionEditDialog } from './section-edit-dialog';

const SECTION_TYPE_LABEL: Record<string, string> = {
  hero: '히어로',
  countdown: '카운트다운',
  invitation_message: '초대 메시지',
  couple_profile: '커플 프로필',
  event_schedule: '일정',
  location_map: '위치/지도',
  transport_guide: '교통 안내',
  parking_info: '주차 안내',
  gallery: '갤러리',
  video: '동영상',
  faq: 'FAQ',
  contact_panel: '연락처',
  gift_account: '축의금 계좌',
  guestbook: '방명록',
  rsvp_form: 'RSVP 폼',
  timeline: '타임라인',
  dress_code: '드레스 코드',
  accommodation_guide: '숙소 안내',
  notice_banner: '공지 배너',
};

interface SortableSectionItemProps {
  id: string;
  eventId: string;
  section: {
    id: string;
    sectionType: string;
    sectionKey: string;
    sortOrder: number;
    isEnabled: boolean;
    propsJson: Record<string, unknown>;
  };
  index: number;
}

export function SortableSectionItem({ id, eventId, section, index }: SortableSectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'opacity-50 shadow-lg' : ''}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground active:cursor-grabbing"
            aria-label="드래그하여 순서 변경"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4" />
          </button>
          <span className="text-sm font-medium text-muted-foreground">
            #{index}
          </span>
          <CardTitle className="text-base">{section.sectionKey}</CardTitle>
          <Badge variant="outline">
            {SECTION_TYPE_LABEL[section.sectionType] ?? section.sectionType}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={section.isEnabled ? 'default' : 'secondary'}>
            {section.isEnabled ? '활성' : '비활성'}
          </Badge>
          <SectionEditDialog
            eventId={eventId}
            section={{
              id: section.id,
              sectionType: section.sectionType,
              sectionKey: section.sectionKey,
              propsJson: section.propsJson,
            }}
          />
          <SectionActions
            eventId={eventId}
            sectionId={section.id}
            isEnabled={section.isEnabled}
          />
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground">
          타입: {section.sectionType} · 정렬: {index}
        </p>
      </CardContent>
    </Card>
  );
}

// ─── Static variant (no DnD context, used during SSR) ────────────────────────

interface StaticSectionItemProps {
  eventId: string;
  section: SortableSectionItemProps['section'];
  index: number;
}

export function StaticSectionItem({ eventId, section, index }: StaticSectionItemProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <div className="rounded p-1 text-muted-foreground">
            <GripVertical className="size-4" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            #{index}
          </span>
          <CardTitle className="text-base">{section.sectionKey}</CardTitle>
          <Badge variant="outline">
            {SECTION_TYPE_LABEL[section.sectionType] ?? section.sectionType}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={section.isEnabled ? 'default' : 'secondary'}>
            {section.isEnabled ? '활성' : '비활성'}
          </Badge>
          <SectionEditDialog
            eventId={eventId}
            section={{
              id: section.id,
              sectionType: section.sectionType,
              sectionKey: section.sectionKey,
              propsJson: section.propsJson,
            }}
          />
          <SectionActions
            eventId={eventId}
            sectionId={section.id}
            isEnabled={section.isEnabled}
          />
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground">
          타입: {section.sectionType} · 정렬: {index}
        </p>
      </CardContent>
    </Card>
  );
}
