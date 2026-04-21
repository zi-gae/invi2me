import { SectionHeader } from './section-shared';

interface GuestMessage {
  author: string;
  content: string;
  createdAt?: string;
}

export function GuestbookSection({ props }: { props: Record<string, unknown> }) {
  const messages = (props.messages as GuestMessage[]) ?? [];
  const description = (props.description as string) ?? '따뜻한 축하 메시지를 남겨주세요.';

  return (
    <section className="bg-white px-6 py-20 sm:py-24">
      <SectionHeader label="GUESTBOOK" title="방명록" />
      {description && (
        <p className="mx-auto mb-10 max-w-xs text-center text-sm text-stone-400">
          {description}
        </p>
      )}
      {messages.length > 0 ? (
        <div className="mx-auto max-w-sm space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className="rounded-xl bg-stone-50 px-4 py-3.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-700">{msg.author}</span>
                {msg.createdAt && (
                  <time dateTime={msg.createdAt} className="text-xs text-stone-400">
                    {new Date(msg.createdAt).toLocaleDateString('ko-KR')}
                  </time>
                )}
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-500">{msg.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-sm rounded-xl border border-dashed border-stone-200 py-12 text-center">
          <p className="text-sm text-stone-400">아직 남겨진 메시지가 없습니다.</p>
        </div>
      )}
    </section>
  );
}
