'use client';

import { useState } from 'react';
import { ChevronDown, Copy, Check } from 'lucide-react';
import { SectionHeader } from './section-shared';

interface GiftAccount {
  relation: string;
  name: string;
  bank: string;
  accountNumber: string;
  kakaoPayUrl?: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-1.5 inline-flex items-center rounded p-0.5 text-stone-400 transition-colors hover:text-stone-600"
      aria-label="계좌번호 복사"
    >
      {copied ? (
        <Check className="size-3.5 text-emerald-500" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </button>
  );
}

export function GiftAccountSection({ props }: { props: Record<string, unknown> }) {
  const accounts = (props.accounts as GiftAccount[]) ?? [];
  const description =
    (props.description as string) ?? '감사한 마음을 전달드립니다.';

  const groupColor = (relation: string) =>
    relation === '신랑측'
      ? { header: 'text-blue-500', name: 'text-blue-400' }
      : relation === '신부측'
        ? { header: 'text-rose-500', name: 'text-rose-400' }
        : { header: 'text-stone-700', name: 'text-stone-500' };

  // relation 기준으로 그룹핑 (순서 유지)
  const groups: { relation: string; accounts: GiftAccount[] }[] = [];
  const seen = new Set<string>();
  for (const account of accounts) {
    const key = account.relation || '기타';
    if (!seen.has(key)) {
      seen.add(key);
      groups.push({ relation: key, accounts: [] });
    }
    groups.find((g) => g.relation === key)!.accounts.push(account);
  }

  return (
    <section className="bg-stone-50 px-6 py-20 sm:py-24">
      <SectionHeader label="GIFT" title="마음 전하기" />
      {description && (
        <p className="mx-auto mb-10 max-w-xs text-center text-sm leading-relaxed text-stone-500">
          {description}
        </p>
      )}
      {groups.length > 0 ? (
        <div className="mx-auto max-w-sm space-y-3">
          {groups.map((group) => (
            <details
              key={group.relation}
              className="group overflow-hidden rounded-xl border border-stone-200 bg-white"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-4">
                <span className={`text-sm font-semibold ${groupColor(group.relation).header}`}>
                  {group.relation}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400">{group.accounts.length}명</span>
                  <ChevronDown
                    className="size-4 text-stone-400 transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </div>
              </summary>
              <div className="divide-y divide-stone-100 border-t border-stone-100">
                {group.accounts.map((account, i) => (
                  <div key={i} className="px-4 py-3.5">
                    <p className={`text-xs font-medium ${groupColor(group.relation).name}`}>{account.name}</p>
                    <p className="mt-1 text-xs text-stone-400">{account.bank}</p>
                    <div className="mt-0.5 flex items-center">
                      <p className="font-mono text-sm text-stone-700">{account.accountNumber}</p>
                      <CopyButton text={account.accountNumber} />
                    </div>
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
                ))}
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
