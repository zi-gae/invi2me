'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  toggleSectionAction,
  deleteSectionAction,
} from '../actions/editor.actions';

export function SectionActions({
  eventId,
  sectionId,
  isEnabled,
}: {
  eventId: string;
  sectionId: string;
  isEnabled: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleToggle() {
    startTransition(async () => {
      await toggleSectionAction(eventId, sectionId, !isEnabled);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirm('이 섹션을 삭제하시겠습니까?')) return;
    startTransition(async () => {
      await deleteSectionAction(eventId, sectionId);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        disabled={isPending}
        title={isEnabled ? '비활성화' : '활성화'}
      >
        {isEnabled ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
        className="text-destructive hover:text-destructive"
        title="삭제"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
