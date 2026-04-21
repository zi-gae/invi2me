import { TextareaField, SectionDivider, str, arr } from '../form-primitives';
import { patch, type FormProps } from './form-types';

interface AccountRow { relation: string; name: string; bank: string; accountNumber: string; kakaoPayUrl: string }
const EMPTY_ACCOUNT: AccountRow = { relation: '', name: '', bank: '', accountNumber: '', kakaoPayUrl: '' };

export function GiftAccountPropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  const accounts = arr<AccountRow>(props, 'accounts');
  return (
    <div className="space-y-3">
      <TextareaField label="안내 문구" value={str(props, 'description')} onChange={(v) => set({ description: v })} rows={2} placeholder="감사한 마음을 전달드립니다." />
      <SectionDivider label="계좌 목록" />
      {accounts.map((account, i) => (
        <div key={i} className="space-y-2 rounded-lg border border-stone-100 bg-stone-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">계좌 {i + 1}</span>
            <button
              type="button"
              onClick={() => set({ accounts: accounts.filter((_, idx) => idx !== i) })}
              className="rounded p-1 text-stone-400 hover:bg-stone-200 hover:text-destructive"
            >
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className="h-7 rounded-md border border-input bg-transparent px-2.5 py-1 text-xs outline-none focus:border-ring" placeholder="관계 (신랑 / 신부측)" value={account.relation} onChange={(e) => { const a = [...accounts]; a[i] = { ...a[i], relation: e.target.value }; set({ accounts: a }); }} />
            <input className="h-7 rounded-md border border-input bg-transparent px-2.5 py-1 text-xs outline-none focus:border-ring" placeholder="이름" value={account.name} onChange={(e) => { const a = [...accounts]; a[i] = { ...a[i], name: e.target.value }; set({ accounts: a }); }} />
            <input className="h-7 rounded-md border border-input bg-transparent px-2.5 py-1 text-xs outline-none focus:border-ring" placeholder="은행명" value={account.bank} onChange={(e) => { const a = [...accounts]; a[i] = { ...a[i], bank: e.target.value }; set({ accounts: a }); }} />
            <input className="h-7 rounded-md border border-input bg-transparent px-2.5 py-1 text-xs outline-none focus:border-ring" placeholder="계좌번호" value={account.accountNumber} onChange={(e) => { const a = [...accounts]; a[i] = { ...a[i], accountNumber: e.target.value }; set({ accounts: a }); }} />
          </div>
          <input className="h-7 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-xs outline-none focus:border-ring" placeholder="카카오페이 링크 (선택)" value={account.kakaoPayUrl ?? ''} onChange={(e) => { const a = [...accounts]; a[i] = { ...a[i], kakaoPayUrl: e.target.value }; set({ accounts: a }); }} />
        </div>
      ))}
      <button
        type="button"
        onClick={() => set({ accounts: [...accounts, { ...EMPTY_ACCOUNT }] })}
        className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-stone-300 text-xs text-stone-500 hover:border-stone-400"
      >
        <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
        계좌 추가
      </button>
    </div>
  );
}
