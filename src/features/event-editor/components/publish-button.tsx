'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { publishPageAction } from '../actions/editor.actions';

export function PublishButton({
  eventId,
  pageId,
}: {
  eventId: string;
  pageId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handlePublish() {
    if (!confirm('이 페이지를 퍼블리시 하시겠습니까?\n이벤트가 공개 상태로 변경됩니다.')) return;

    startTransition(async () => {
      const result = await publishPageAction(eventId, pageId);
      if (result.success) {
        alert(`v${result.versionNo}로 퍼블리시 되었습니다!`);
        router.refresh();
      }
    });
  }

  return (
    <Button onClick={handlePublish} disabled={isPending}>
      <Send className="size-4" />
      {isPending ? '퍼블리시 중...' : '퍼블리시'}
    </Button>
  );
}
