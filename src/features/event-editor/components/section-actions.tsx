'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  toggleSectionAction,
  deleteSectionAction,
} from '../actions/editor.actions';
import { useEditorSections } from './editor-sections-context';

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
  const [optimisticEnabled, setOptimisticEnabled] = useState(isEnabled);
  const { setSections } = useEditorSections();
  const router = useRouter();

  function handleToggle() {
    const next = !optimisticEnabled;
    setOptimisticEnabled(next);
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, isEnabled: next } : s))
    );
    startTransition(async () => {
      await toggleSectionAction(eventId, sectionId, next);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirm('이 섹션을 삭제하시겠습니까?')) return;
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
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
        title={optimisticEnabled ? '비활성화' : '활성화'}
      >
        {optimisticEnabled ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
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
