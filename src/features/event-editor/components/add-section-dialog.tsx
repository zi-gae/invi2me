'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { addSectionAction } from '../actions/editor.actions';

const SECTION_TYPES = [
  { value: 'hero', label: '히어로' },
  { value: 'countdown', label: '카운트다운' },
  { value: 'invitation_message', label: '초대 메시지' },
  { value: 'couple_profile', label: '커플 프로필' },
  { value: 'event_schedule', label: '일정' },
  { value: 'location_map', label: '위치/지도' },
  { value: 'transport_guide', label: '교통 안내' },
  { value: 'parking_info', label: '주차 안내' },
  { value: 'gallery', label: '갤러리' },
  { value: 'video', label: '동영상' },
  { value: 'faq', label: 'FAQ' },
  { value: 'contact_panel', label: '연락처' },
  { value: 'gift_account', label: '축의금 계좌' },
  { value: 'guestbook', label: '방명록' },
  { value: 'rsvp_form', label: 'RSVP 폼' },
  { value: 'timeline', label: '타임라인' },
  { value: 'dress_code', label: '드레스 코드' },
  { value: 'accommodation_guide', label: '숙소 안내' },
  { value: 'notice_banner', label: '공지 배너' },
] as const;

export function AddSectionDialog({
  eventId,
  pageId,
  nextSortOrder,
}: {
  eventId: string;
  pageId: string;
  nextSortOrder: number;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleAdd(sectionType: string) {
    startTransition(async () => {
      await addSectionAction(eventId, pageId, sectionType, nextSortOrder);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline">
            <Plus className="size-4" />
            섹션 추가
          </Button>
        }
      />
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>섹션 추가</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2 pt-2">
          {SECTION_TYPES.map((type) => (
            <Button
              key={type.value}
              variant="outline"
              className="h-auto justify-start px-3 py-2.5 text-left"
              onClick={() => handleAdd(type.value)}
              disabled={isPending}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
