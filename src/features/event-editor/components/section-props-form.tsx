'use client';

/**
 * 각 섹션 타입별 props 편집 폼 컴포넌트.
 * SectionEditDialog 에서 sectionType에 따라 라우팅됩니다.
 */

import { TextField, TextareaField, SectionDivider, ArrayField, str, num, arr, obj } from './form-primitives';
import { ImageUploadField, ImageUploadCell } from './image-upload-field';

interface FormProps {
  props: Record<string, unknown>;
  onChange: (updated: Record<string, unknown>) => void;
  eventId: string;
}

type Setter = (patch: Record<string, unknown>) => void;

function patch(props: Record<string, unknown>, onChange: (v: Record<string, unknown>) => void): Setter {
  return (update) => onChange({ ...props, ...update });
}

// ─── Hero ────────────────────────────────────────────────────────────────────

export function HeroPropsForm({ props, onChange, eventId }: FormProps) {
  const set = patch(props, onChange);
  return (
    <div className="space-y-3">
      <SectionDivider label="이름" />
      <TextField label="신랑 이름" value={str(props, 'groomName')} onChange={(v) => set({ groomName: v })} placeholder="홍길동" />
      <TextField label="신부 이름" value={str(props, 'brideName')} onChange={(v) => set({ brideName: v })} placeholder="김영희" />
      <SectionDivider label="날짜 · 장소" />
      <TextField label="결혼식 날짜" type="date" value={str(props, 'weddingDate')} onChange={(v) => set({ weddingDate: v })} />
      <TextField label="웨딩홀 이름" value={str(props, 'venueName')} onChange={(v) => set({ venueName: v })} placeholder="그랜드볼룸" />
      <SectionDivider label="배경" />
      <ImageUploadField label="커버 이미지" value={str(props, 'imageUrl')} onChange={(v) => set({ imageUrl: v })} eventId={eventId} />
    </div>
  );
}

// ─── Countdown ───────────────────────────────────────────────────────────────

export function CountdownPropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  return (
    <div className="space-y-3">
      <TextField label="목표 날짜·시간" type="datetime-local" value={str(props, 'targetDate')} onChange={(v) => set({ targetDate: v })} />
      <TextField label="라벨" value={str(props, 'label')} onChange={(v) => set({ label: v })} placeholder="결혼식까지" />
      <TextField label="완료 메시지" value={str(props, 'completedMessage')} onChange={(v) => set({ completedMessage: v })} placeholder="행복한 결혼 생활을 시작했습니다 💕" />
    </div>
  );
}

// ─── Invitation Message ──────────────────────────────────────────────────────

export function InvitationMessagePropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  const groomParents = obj<{ father: string; mother: string }>(props, 'groomParents');
  const brideParents = obj<{ father: string; mother: string }>(props, 'brideParents');
  return (
    <div className="space-y-3">
      <TextareaField label="초대 문구" value={str(props, 'message')} onChange={(v) => set({ message: v })} rows={5} placeholder="저희 두 사람이 하나가 되는 자리에 초대합니다..." />
      <SectionDivider label="신랑측" />
      <div className="grid grid-cols-2 gap-2">
        <TextField label="신랑 아버지" value={str(groomParents, 'father')} onChange={(v) => set({ groomParents: { ...groomParents, father: v } })} placeholder="홍부친" />
        <TextField label="신랑 어머니" value={str(groomParents, 'mother')} onChange={(v) => set({ groomParents: { ...groomParents, mother: v } })} placeholder="홍모친" />
      </div>
      <TextField label="신랑 이름" value={str(props, 'groomName')} onChange={(v) => set({ groomName: v })} placeholder="홍길동" />
      <SectionDivider label="신부측" />
      <div className="grid grid-cols-2 gap-2">
        <TextField label="신부 아버지" value={str(brideParents, 'father')} onChange={(v) => set({ brideParents: { ...brideParents, father: v } })} placeholder="김부친" />
        <TextField label="신부 어머니" value={str(brideParents, 'mother')} onChange={(v) => set({ brideParents: { ...brideParents, mother: v } })} placeholder="김모친" />
      </div>
      <TextField label="신부 이름" value={str(props, 'brideName')} onChange={(v) => set({ brideName: v })} placeholder="김영희" />
    </div>
  );
}

// ─── Couple Profile ──────────────────────────────────────────────────────────

interface PersonObj { name: string; photoUrl: string; fatherName: string; motherName: string; role: string }

export function CoupleProfilePropsForm({ props, onChange, eventId }: FormProps) {
  const set = patch(props, onChange);
  const groom = obj<PersonObj>(props, 'groom');
  const bride = obj<PersonObj>(props, 'bride');
  const setGroom = (g: Partial<PersonObj>) => set({ groom: { ...groom, ...g } });
  const setBride = (b: Partial<PersonObj>) => set({ bride: { ...bride, ...b } });
  return (
    <div className="space-y-3">
      <SectionDivider label="신랑" />
      <TextField label="이름" value={str(groom, 'name')} onChange={(v) => setGroom({ name: v })} placeholder="홍길동" />
      <ImageUploadField label="사진" value={str(groom, 'photoUrl')} onChange={(v) => setGroom({ photoUrl: v })} eventId={eventId} />
      <div className="grid grid-cols-2 gap-2">
        <TextField label="아버지" value={str(groom, 'fatherName')} onChange={(v) => setGroom({ fatherName: v })} />
        <TextField label="어머니" value={str(groom, 'motherName')} onChange={(v) => setGroom({ motherName: v })} />
      </div>
      <TextField label="호칭" value={str(groom, 'role')} onChange={(v) => setGroom({ role: v })} placeholder="아들" />
      <SectionDivider label="신부" />
      <TextField label="이름" value={str(bride, 'name')} onChange={(v) => setBride({ name: v })} placeholder="김영희" />
      <ImageUploadField label="사진" value={str(bride, 'photoUrl')} onChange={(v) => setBride({ photoUrl: v })} eventId={eventId} />
      <div className="grid grid-cols-2 gap-2">
        <TextField label="아버지" value={str(bride, 'fatherName')} onChange={(v) => setBride({ fatherName: v })} />
        <TextField label="어머니" value={str(bride, 'motherName')} onChange={(v) => setBride({ motherName: v })} />
      </div>
      <TextField label="호칭" value={str(bride, 'role')} onChange={(v) => setBride({ role: v })} placeholder="딸" />
    </div>
  );
}

// ─── Event Schedule ──────────────────────────────────────────────────────────

export function EventSchedulePropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <TextField label="날짜" type="date" value={str(props, 'date')} onChange={(v) => set({ date: v })} />
        <TextField label="시각" value={str(props, 'time')} onChange={(v) => set({ time: v })} placeholder="오후 1시 30분" />
      </div>
      <SectionDivider label="장소" />
      <TextField label="웨딩홀 이름" value={str(props, 'venueName')} onChange={(v) => set({ venueName: v })} placeholder="그랜드볼룸" />
      <TextField label="홀 이름" value={str(props, 'hallName')} onChange={(v) => set({ hallName: v })} placeholder="다이아몬드홀 2층" />
      <TextField label="주소" value={str(props, 'venueAddress')} onChange={(v) => set({ venueAddress: v })} placeholder="서울특별시 강남구..." />
    </div>
  );
}

// ─── Location Map ─────────────────────────────────────────────────────────────

interface TransportRow { type: string; description: string }
const EMPTY_TRANSPORT: TransportRow = { type: '', description: '' };

export function LocationMapPropsForm({ props, onChange, eventId }: FormProps) {
  const set = patch(props, onChange);
  const transports = arr<TransportRow>(props, 'transports');
  return (
    <div className="space-y-3">
      <TextField label="웨딩홀 이름" value={str(props, 'venueName')} onChange={(v) => set({ venueName: v })} />
      <TextField label="주소" value={str(props, 'address')} onChange={(v) => set({ address: v })} />
      <TextField label="상세 주소" value={str(props, 'subAddress')} onChange={(v) => set({ subAddress: v })} />
      <ImageUploadField label="지도 이미지" value={str(props, 'mapImageUrl')} onChange={(v) => set({ mapImageUrl: v })} eventId={eventId} />
      <SectionDivider label="교통편" />
      <ArrayField
        label="교통편 목록"
        items={transports}
        onChange={(items) => set({ transports: items })}
        emptyItem={EMPTY_TRANSPORT}
        fields={{ type: { label: '종류', placeholder: 'subway / bus / car / taxi' }, description: { label: '설명', placeholder: '2호선 강남역 1번 출구...' } }}
        addLabel="교통편 추가"
      />
    </div>
  );
}

// ─── Transport Guide ──────────────────────────────────────────────────────────

interface GuideRow { label: string; detail: string }
const EMPTY_GUIDE: GuideRow = { label: '', detail: '' };

export function TransportGuidePropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  const items = arr<GuideRow>(props, 'items');
  return (
    <div className="space-y-3">
      <TextField label="제목" value={str(props, 'title')} onChange={(v) => set({ title: v })} placeholder="교통 안내" />
      <ArrayField
        label="교통 안내 항목"
        items={items}
        onChange={(newItems) => set({ items: newItems })}
        emptyItem={EMPTY_GUIDE}
        fields={{ label: { label: '라벨', placeholder: '지하철' }, detail: { label: '내용', placeholder: '2호선 강남역 1번 출구...' } }}
        addLabel="항목 추가"
      />
    </div>
  );
}

// ─── Parking Info ─────────────────────────────────────────────────────────────

export function ParkingInfoPropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  return (
    <div className="space-y-3">
      <TextareaField label="주차 안내" value={str(props, 'description')} onChange={(v) => set({ description: v })} rows={4} placeholder="지하 1~3층 주차 가능합니다..." />
      <TextField label="참고 사항" value={str(props, 'note')} onChange={(v) => set({ note: v })} placeholder="주차 공간이 협소하오니 대중교통을 이용해 주세요" />
    </div>
  );
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

interface ImageRow { url: string; alt: string }
const EMPTY_IMAGE: ImageRow = { url: '', alt: '' };

export function GalleryPropsForm({ props, onChange, eventId }: FormProps) {
  const set = patch(props, onChange);
  const images = arr<ImageRow>(props, 'images');

  function updateImage(i: number, patch: Partial<ImageRow>) {
    const updated = images.map((img, idx) => (idx === i ? { ...img, ...patch } : img));
    set({ images: updated });
  }

  function removeImage(i: number) {
    set({ images: images.filter((_, idx) => idx !== i) });
  }

  function addImage() {
    set({ images: [...images, { ...EMPTY_IMAGE }] });
  }

  return (
    <div className="space-y-3">
      <TextField label="제목" value={str(props, 'title')} onChange={(v) => set({ title: v })} placeholder="우리의 이야기" />
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-stone-600">열 수</label>
        <div className="flex gap-2">
          {[2, 3].map((col) => (
            <button
              key={col}
              type="button"
              onClick={() => set({ columns: col })}
              className={`flex h-8 flex-1 items-center justify-center rounded-lg border text-sm transition-colors ${num(props, 'columns', 2) === col ? 'border-stone-800 bg-stone-800 text-white' : 'border-stone-200 hover:border-stone-400'}`}
            >
              {col}열
            </button>
          ))}
        </div>
      </div>
      <SectionDivider label="이미지 목록" />
      <div className="space-y-2">
        {images.map((image, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg border border-stone-100 bg-stone-50 p-2.5">
            <ImageUploadCell
              value={image.url}
              onChange={(url) => updateImage(i, { url })}
              eventId={eventId}
            />
            <input
              value={image.alt}
              onChange={(e) => updateImage(i, { alt: e.target.value })}
              placeholder="설명"
              className="h-7 flex-1 rounded-md border border-input bg-transparent px-2.5 text-xs outline-none focus:border-ring"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="rounded p-1 text-stone-400 hover:bg-stone-200 hover:text-destructive"
              aria-label={`${i + 1}번 이미지 삭제`}
            >
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addImage}
          className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-stone-300 text-xs text-stone-500 hover:border-stone-400"
        >
          <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          이미지 추가
        </button>
      </div>
    </div>
  );
}

// ─── Video ───────────────────────────────────────────────────────────────────

export function VideoPropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  return (
    <div className="space-y-3">
      <TextField label="YouTube URL" value={str(props, 'videoUrl')} onChange={(v) => set({ videoUrl: v })} placeholder="https://youtube.com/watch?v=..." />
      <TextField label="제목" value={str(props, 'title')} onChange={(v) => set({ title: v })} placeholder="우리의 웨딩 영상" />
    </div>
  );
}

// ─── Gift Account ─────────────────────────────────────────────────────────────

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

// ─── Guestbook ───────────────────────────────────────────────────────────────

export function GuestbookPropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  return (
    <div className="space-y-3">
      <TextareaField label="안내 문구" value={str(props, 'description')} onChange={(v) => set({ description: v })} rows={2} placeholder="따뜻한 축하 메시지를 남겨주세요." />
    </div>
  );
}

// ─── RSVP Form ───────────────────────────────────────────────────────────────

export function RsvpFormPropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  return (
    <div className="space-y-3">
      <TextareaField label="안내 문구" value={str(props, 'description')} onChange={(v) => set({ description: v })} rows={2} placeholder="참석 여부를 알려주시면 준비에 큰 도움이 됩니다." />
      <TextField label="회신 기한" type="date" value={str(props, 'deadline')} onChange={(v) => set({ deadline: v })} />
    </div>
  );
}

// ─── Timeline ────────────────────────────────────────────────────────────────

interface TimelineRow { time: string; event: string; description: string }
const EMPTY_TIMELINE: TimelineRow = { time: '', event: '', description: '' };

export function TimelinePropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  const items = arr<TimelineRow>(props, 'items');
  return (
    <div className="space-y-3">
      <ArrayField
        label="식순"
        items={items}
        onChange={(newItems) => set({ items: newItems })}
        emptyItem={EMPTY_TIMELINE}
        fields={{
          time: { label: '시간', placeholder: '오후 1:30' },
          event: { label: '행사명', placeholder: '신랑 입장' },
          description: { label: '설명', placeholder: '(선택)' },
        }}
        addLabel="식순 추가"
      />
    </div>
  );
}

// ─── Dress Code ───────────────────────────────────────────────────────────────

interface ColorRow { hex: string; label: string }
const EMPTY_COLOR: ColorRow = { hex: '#f5f5f4', label: '' };

export function DressCodePropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  const colors = arr<ColorRow>(props, 'colors');
  return (
    <div className="space-y-3">
      <TextareaField label="드레스 코드 안내" value={str(props, 'description')} onChange={(v) => set({ description: v })} rows={2} />
      <SectionDivider label="색상 팔레트" />
      <div className="flex flex-wrap gap-2">
        {colors.map((color, i) => (
          <div key={i} className="flex items-center gap-1.5 rounded-lg border border-stone-100 bg-stone-50 px-2 py-1.5">
            <input
              type="color"
              value={color.hex}
              onChange={(e) => { const c = [...colors]; c[i] = { ...c[i], hex: e.target.value }; set({ colors: c }); }}
              className="size-6 cursor-pointer rounded border-0 bg-transparent p-0"
            />
            <input
              value={color.label}
              onChange={(e) => { const c = [...colors]; c[i] = { ...c[i], label: e.target.value }; set({ colors: c }); }}
              placeholder="라벨"
              className="h-6 w-16 rounded border border-input bg-transparent px-1.5 text-xs outline-none"
            />
            <button type="button" onClick={() => set({ colors: colors.filter((_, idx) => idx !== i) })} className="text-stone-400 hover:text-destructive">
              <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => set({ colors: [...colors, { ...EMPTY_COLOR }] })}
          className="flex h-8 items-center gap-1 rounded-lg border border-dashed border-stone-300 px-3 text-xs text-stone-500 hover:border-stone-400"
        >
          색상 추가
        </button>
      </div>
      <TextField label="비고" value={str(props, 'note')} onChange={(v) => set({ note: v })} placeholder="화려한 색상 자제를 부탁드립니다" />
    </div>
  );
}

// ─── Accommodation Guide ─────────────────────────────────────────────────────

interface HotelRow { name: string; address: string; phone: string; discount: string }
const EMPTY_HOTEL: HotelRow = { name: '', address: '', phone: '', discount: '' };

export function AccommodationGuidePropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  const hotels = arr<HotelRow>(props, 'hotels');
  return (
    <div className="space-y-3">
      <TextareaField label="안내 문구" value={str(props, 'description')} onChange={(v) => set({ description: v })} rows={2} />
      <SectionDivider label="숙소 목록" />
      <ArrayField
        label="숙소"
        items={hotels}
        onChange={(newHotels) => set({ hotels: newHotels })}
        emptyItem={EMPTY_HOTEL}
        fields={{
          name: { label: '숙소명', placeholder: '그랜드 호텔' },
          address: { label: '주소', placeholder: '서울시 강남구...' },
          phone: { label: '전화', placeholder: '02-1234-5678' },
          discount: { label: '할인', placeholder: '10% 할인 (코드: WEDDING)' },
        }}
        addLabel="숙소 추가"
      />
    </div>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

interface FaqRow { question: string; answer: string }
const EMPTY_FAQ: FaqRow = { question: '', answer: '' };

export function FaqPropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  const items = arr<FaqRow>(props, 'items');
  return (
    <div className="space-y-3">
      <TextField label="섹션 제목" value={str(props, 'title')} onChange={(v) => set({ title: v })} placeholder="자주 묻는 질문" />
      <ArrayField
        label="Q&A 항목"
        items={items}
        onChange={(newItems) => set({ items: newItems })}
        emptyItem={EMPTY_FAQ}
        fields={{
          question: { label: '질문', placeholder: '주차는 어떻게 하나요?' },
          answer: { label: '답변', placeholder: '지하 1층 주차장을 이용해 주세요.' },
        }}
        addLabel="Q&A 추가"
      />
    </div>
  );
}

// ─── Contact Panel ────────────────────────────────────────────────────────────

interface ContactRow { relation: string; name: string; phone: string }
const EMPTY_CONTACT: ContactRow = { relation: '', name: '', phone: '' };

export function ContactPanelPropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  const groomContacts = arr<ContactRow>(props, 'groomContacts');
  const brideContacts = arr<ContactRow>(props, 'brideContacts');
  return (
    <div className="space-y-3">
      <SectionDivider label="신랑측" />
      <ArrayField
        label="신랑측 연락처"
        items={groomContacts}
        onChange={(items) => set({ groomContacts: items })}
        emptyItem={EMPTY_CONTACT}
        fields={{
          relation: { label: '관계', placeholder: '신랑 / 아버지' },
          name: { label: '이름', placeholder: '홍길동' },
          phone: { label: '전화번호', placeholder: '010-1234-5678' },
        }}
        addLabel="연락처 추가"
      />
      <SectionDivider label="신부측" />
      <ArrayField
        label="신부측 연락처"
        items={brideContacts}
        onChange={(items) => set({ brideContacts: items })}
        emptyItem={EMPTY_CONTACT}
        fields={{
          relation: { label: '관계', placeholder: '신부 / 아버지' },
          name: { label: '이름', placeholder: '김영희' },
          phone: { label: '전화번호', placeholder: '010-9876-5432' },
        }}
        addLabel="연락처 추가"
      />
    </div>
  );
}

// ─── Notice Banner ────────────────────────────────────────────────────────────

export function NoticeBannerPropsForm({ props, onChange }: FormProps) {
  const set = patch(props, onChange);
  return (
    <div className="space-y-3">
      <TextareaField label="공지 내용" value={str(props, 'text')} onChange={(v) => set({ text: v })} rows={3} placeholder="주차 공간이 협소하오니 가급적 대중교통을 이용해 주세요." />
    </div>
  );
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

interface SectionPropsFormProps {
  sectionType: string;
  props: Record<string, unknown>;
  onChange: (updated: Record<string, unknown>) => void;
  eventId: string;
}

export function SectionPropsForm({ sectionType, props, onChange, eventId }: SectionPropsFormProps) {
  const formProps = { props, onChange, eventId };
  switch (sectionType) {
    case 'hero':               return <HeroPropsForm {...formProps} />;
    case 'countdown':          return <CountdownPropsForm {...formProps} />;
    case 'invitation_message': return <InvitationMessagePropsForm {...formProps} />;
    case 'couple_profile':     return <CoupleProfilePropsForm {...formProps} />;
    case 'event_schedule':     return <EventSchedulePropsForm {...formProps} />;
    case 'location_map':       return <LocationMapPropsForm {...formProps} />;
    case 'transport_guide':    return <TransportGuidePropsForm {...formProps} />;
    case 'parking_info':       return <ParkingInfoPropsForm {...formProps} />;
    case 'gallery':            return <GalleryPropsForm {...formProps} />;
    case 'video':              return <VideoPropsForm {...formProps} />;
    case 'gift_account':       return <GiftAccountPropsForm {...formProps} />;
    case 'guestbook':          return <GuestbookPropsForm {...formProps} />;
    case 'rsvp_form':          return <RsvpFormPropsForm {...formProps} />;
    case 'timeline':           return <TimelinePropsForm {...formProps} />;
    case 'dress_code':         return <DressCodePropsForm {...formProps} />;
    case 'accommodation_guide':return <AccommodationGuidePropsForm {...formProps} />;
    case 'faq':                return <FaqPropsForm {...formProps} />;
    case 'contact_panel':      return <ContactPanelPropsForm {...formProps} />;
    case 'notice_banner':      return <NoticeBannerPropsForm {...formProps} />;
    default:                   return <p className="py-4 text-center text-sm text-stone-400">이 섹션 타입은 아직 편집 폼이 없습니다.</p>;
  }
}
