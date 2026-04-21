'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Pencil, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { updateSectionPropsAction } from '../actions/editor.actions';
import { SectionPropsForm } from './section-props-form';

const SECTION_TYPE_LABEL: Record<string, string> = {
  hero: '히어로',
  countdown: '카운트다운',
  invitation_message: '초대 메시지',
  couple_profile: '커플 프로필',
  event_schedule: '일정',
  location_map: '위치·지도',
  transport_guide: '교통 안내',
  parking_info: '주차 안내',
  gallery: '갤러리',
  video: '동영상',
  faq: 'FAQ',
  contact_panel: '연락처',
  gift_account: '축의금 계좌',
  guestbook: '방명록',
  rsvp_form: 'RSVP',
  timeline: '타임라인',
  dress_code: '드레스 코드',
  accommodation_guide: '숙소 안내',
  notice_banner: '공지 배너',
};

interface SectionEditDialogProps {
  eventId: string;
  section: {
    id: string;
    sectionType: string;
    sectionKey: string;
    propsJson: Record<string, unknown>;
  };
}

export function SectionEditDialog({ eventId, section }: SectionEditDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [props, setProps] = useState<Record<string, unknown>>(section.propsJson);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(nextOpen: boolean) {
    if (!isPending) {
      if (nextOpen) {
        // 열릴 때 최신 props로 초기화
        setProps(section.propsJson);
      }
      setOpen(nextOpen);
    }
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await updateSectionPropsAction(eventId, section.id, props);
        toast.success('섹션이 저장되었습니다.');
        setOpen(false);
        router.refresh();
      } catch {
        toast.error('저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    });
  }

  const title = SECTION_TYPE_LABEL[section.sectionType] ?? section.sectionType;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" aria-label={`${title} 섹션 편집`}>
            <Pencil className="size-4" />
          </Button>
        }
      />

      <DialogContent
        className="flex max-h-[90dvh] max-w-md flex-col gap-0 p-0 sm:max-w-md"
        showCloseButton={false}
      >
        <DialogHeader className="shrink-0 px-5 pt-5 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle>{title} 편집</DialogTitle>
            <span className="font-mono text-[11px] text-muted-foreground">{section.sectionKey}</span>
          </div>
        </DialogHeader>

        {/* 스크롤 가능한 폼 영역 */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-2">
          <SectionPropsForm
            sectionType={section.sectionType}
            props={props}
            onChange={setProps}
            eventId={eventId}
          />
        </div>

        <DialogFooter className="mx-0 mb-0 shrink-0 px-5 py-4" showCloseButton>
          <Button onClick={handleSave} disabled={isPending} size="sm">
            {isPending && <Loader2 className="mr-2 size-3.5 animate-spin" />}
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
