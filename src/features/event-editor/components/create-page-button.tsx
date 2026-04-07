'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageAction } from '../actions/editor.actions';

export function CreatePageButton({ eventId }: { eventId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleCreate() {
    startTransition(async () => {
      await createPageAction(eventId);
      router.refresh();
    });
  }

  return (
    <Button onClick={handleCreate} disabled={isPending}>
      <Plus className="size-4" />
      {isPending ? '생성 중...' : '페이지 생성'}
    </Button>
  );
}
