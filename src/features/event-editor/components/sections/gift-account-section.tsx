import { ChevronDown } from 'lucide-react';
import { SectionHeader } from './section-shared';

interface GiftAccount {
  relation: string;
  name: string;
  bank: string;
  accountNumber: string;
  kakaoPayUrl?: string;
}

export function GiftAccountSection({ props }: { props: Record<string, unknown> }) {
  const accounts = (props.accounts as GiftAccount[]) ?? [];
  const description =
    (props.description as string) ?? '감사한 마음을 전달드립니다.';

  return (
    <section className="bg-stone-50 px-6 py-20 sm:py-24">
      <SectionHeader label="GIFT" title="마음 전하기" />
      {description && (
        <p className="mx-auto mb-10 max-w-xs text-center text-sm leading-relaxed text-stone-500">
          {description}
        </p>
      )}
      {accounts.length > 0 ? (
        <div className="mx-auto max-w-sm space-y-2">
          {accounts.map((account, i) => (
            <details key={i} className="group overflow-hidden rounded-xl border border-stone-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5">
                <div>
                  <span className="text-xs tracking-wide text-rose-400">
                    {account.relation}
                  </span>
                  <p className="mt-0.5 text-sm font-medium text-stone-700">{account.name}</p>
                </div>
                <ChevronDown
                  className="size-4 text-stone-400 transition-transform duration-200 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <div className="border-t border-stone-100 px-4 py-3">
                <p className="text-xs text-stone-400">{account.bank}</p>
                <p className="mt-0.5 font-mono text-sm text-stone-700">
                  {account.accountNumber}
                </p>
                {account.kakaoPayUrl && (
                  <a
                    href={account.kakaoPayUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block rounded-md bg-yellow-400 px-3 py-1.5 text-xs font-medium text-yellow-900"
                  >
                    카카오페이로 보내기
                  </a>
                )}
              </div>
            </details>
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-sm rounded-xl border border-dashed border-stone-200 py-10 text-center">
          <p className="text-sm text-stone-400">계좌 정보가 등록되지 않았습니다.</p>
        </div>
      )}
    </section>
  );
}
