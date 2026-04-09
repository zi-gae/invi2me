'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  updateEventBasicAction,
  updateEventScheduleAction,
  updateEventVisibilityAction,
  updateEventSeoAction,
  updateEventFeaturesAction,
  archiveEventAction,
  deleteEventAction,
} from '../actions/event.actions';
import type { AdminEventDto } from '../types/event.dto';

interface EventSettingsFormProps {
  event: AdminEventDto;
}

// datetime-local input format: YYYY-MM-DDTHH:mm
function toDatetimeLocal(iso: string | null): string {
  if (!iso) return '';
  return iso.slice(0, 16);
}

function toIso(local: string): string | undefined {
  if (!local) return undefined;
  return new Date(local).toISOString();
}

// Simple toggle switch using Tailwind
function FeatureToggle({
  enabled,
  onToggle,
  label,
  description,
}: {
  enabled: boolean;
  onToggle: () => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
          enabled ? 'bg-primary' : 'bg-input'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

const VISIBILITY_OPTIONS = [
  { value: 'public', label: '공개', description: '누구나 접근 가능' },
  { value: 'private', label: '비공개', description: '링크를 아는 사람만 접근' },
  { value: 'invite_only', label: '초대 전용', description: '초대받은 게스트만 접근' },
  { value: 'password_protected', label: '비밀번호', description: '비밀번호 입력 후 접근' },
] as const;

const LOCALE_OPTIONS = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' },
] as const;

const TIMEZONE_OPTIONS = [
  { value: 'Asia/Seoul', label: '서울 (KST, UTC+9)' },
  { value: 'Asia/Tokyo', label: '도쿄 (JST, UTC+9)' },
  { value: 'America/New_York', label: '뉴욕 (EST, UTC-5)' },
  { value: 'Europe/London', label: '런던 (GMT, UTC+0)' },
  { value: 'UTC', label: 'UTC' },
] as const;

// ── Basic Info Tab ────────────────────────────────────────────────────────────

function BasicInfoTab({ event }: { event: AdminEventDto }) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(event.title);
  const [subtitle, setSubtitle] = useState(event.subtitle ?? '');
  const [slug, setSlug] = useState(event.slug);
  const [locale, setLocale] = useState(event.primaryLocale);
  const [timezone, setTimezone] = useState(event.defaultTimezone);

  function handleSave() {
    startTransition(async () => {
      const result = await updateEventBasicAction(event.id, {
        title,
        subtitle: subtitle || undefined,
        slug,
        primaryLocale: locale as 'ko' | 'en',
        defaultTimezone: timezone,
      });
      if (result.success) {
        toast.success('기본 정보가 저장되었습니다');
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">이벤트 정보</CardTitle>
          <CardDescription>이벤트의 기본 정보를 수정합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="이벤트 제목"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">부제</Label>
              <Input
                id="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="부제 (선택)"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">슬러그</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">invi2me.com/</span>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-event-2025"
                className="font-mono text-sm"
              />
            </div>
            <p className="text-xs text-muted-foreground">영문 소문자, 숫자, 하이픈(-)만 사용 가능합니다</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="locale">언어</Label>
              <select
                id="locale"
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {LOCALE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">타임존</Label>
              <select
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {TIMEZONE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? '저장 중...' : '저장'}
        </Button>
      </div>
    </div>
  );
}

// ── Schedule Tab ─────────────────────────────────────────────────────────────

function ScheduleTab({ event }: { event: AdminEventDto }) {
  const [isPending, startTransition] = useTransition();
  const [startsAt, setStartsAt] = useState(toDatetimeLocal(event.startsAt));
  const [endsAt, setEndsAt] = useState(toDatetimeLocal(event.endsAt));
  const [rsvpEnabled, setRsvpEnabled] = useState(!!(event.rsvpOpensAt || event.rsvpClosesAt));
  const [rsvpOpensAt, setRsvpOpensAt] = useState(toDatetimeLocal(event.rsvpOpensAt));
  const [rsvpClosesAt, setRsvpClosesAt] = useState(toDatetimeLocal(event.rsvpClosesAt));

  function handleSave() {
    startTransition(async () => {
      const result = await updateEventScheduleAction(event.id, {
        startsAt: toIso(startsAt),
        endsAt: toIso(endsAt),
        rsvpOpensAt: rsvpEnabled ? toIso(rsvpOpensAt) : undefined,
        rsvpClosesAt: rsvpEnabled ? toIso(rsvpClosesAt) : undefined,
      });
      if (result.success) {
        toast.success('일정이 저장되었습니다');
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">이벤트 일정</CardTitle>
          <CardDescription>이벤트가 열리는 날짜와 시간을 설정합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startsAt">시작 일시</Label>
              <Input
                id="startsAt"
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endsAt">종료 일시</Label>
              <Input
                id="endsAt"
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">RSVP 기간</CardTitle>
              <CardDescription>게스트가 RSVP를 제출할 수 있는 기간을 설정합니다</CardDescription>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={rsvpEnabled}
              onClick={() => setRsvpEnabled((v) => !v)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                rsvpEnabled ? 'bg-primary' : 'bg-input'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ${
                  rsvpEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </CardHeader>
        {rsvpEnabled && (
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rsvpOpensAt">오픈 일시</Label>
                <Input
                  id="rsvpOpensAt"
                  type="datetime-local"
                  value={rsvpOpensAt}
                  onChange={(e) => setRsvpOpensAt(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rsvpClosesAt">마감 일시</Label>
                <Input
                  id="rsvpClosesAt"
                  type="datetime-local"
                  value={rsvpClosesAt}
                  onChange={(e) => setRsvpClosesAt(e.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">기간을 설정하지 않으면 상시 접수됩니다</p>
          </CardContent>
        )}
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? '저장 중...' : '저장'}
        </Button>
      </div>
    </div>
  );
}

// ── Visibility Tab ────────────────────────────────────────────────────────────

function VisibilityTab({ event }: { event: AdminEventDto }) {
  const [isPending, startTransition] = useTransition();
  const [visibility, setVisibility] = useState(event.visibility);
  const [password, setPassword] = useState('');

  function handleSave() {
    startTransition(async () => {
      const result = await updateEventVisibilityAction(event.id, {
        visibility: visibility as 'public' | 'private' | 'invite_only' | 'password_protected',
        accessPassword: password || undefined,
      });
      if (result.success) {
        toast.success('공개 설정이 저장되었습니다');
        setPassword('');
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">공개 설정</CardTitle>
          <CardDescription>이벤트 페이지에 접근할 수 있는 대상을 설정합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {VISIBILITY_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                visibility === opt.value ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <input
                type="radio"
                name="visibility"
                value={opt.value}
                checked={visibility === opt.value}
                onChange={() => setVisibility(opt.value)}
                className="mt-0.5 accent-primary"
              />
              <div>
                <p className="text-sm font-medium">{opt.label}</p>
                <p className="text-xs text-muted-foreground">{opt.description}</p>
              </div>
            </label>
          ))}

          {visibility === 'password_protected' && (
            <div className="mt-4 space-y-2 rounded-lg bg-muted/50 p-4">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="새 비밀번호 입력 (변경 시에만 입력)"
              />
              <p className="text-xs text-muted-foreground">비밀번호를 변경하지 않으려면 비워두세요</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? '저장 중...' : '저장'}
        </Button>
      </div>
    </div>
  );
}

// ── SEO Tab ──────────────────────────────────────────────────────────────────

function SeoTab({ event }: { event: AdminEventDto }) {
  const [isPending, startTransition] = useTransition();
  const [seoTitle, setSeoTitle] = useState(event.seoTitle ?? '');
  const [seoDescription, setSeoDescription] = useState(event.seoDescription ?? '');
  const [ogImageUrl, setOgImageUrl] = useState(event.ogImageUrl ?? '');

  function handleSave() {
    startTransition(async () => {
      const result = await updateEventSeoAction(event.id, {
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
        ogImageUrl: ogImageUrl || undefined,
      });
      if (result.success) {
        toast.success('SEO 설정이 저장되었습니다');
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">검색엔진 최적화</CardTitle>
          <CardDescription>카카오톡, SNS 공유 시 표시되는 정보를 설정합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seoTitle">
              SEO 제목{' '}
              <span className="text-xs text-muted-foreground">({seoTitle.length}/100)</span>
            </Label>
            <Input
              id="seoTitle"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              maxLength={100}
              placeholder={event.title}
            />
            <p className="text-xs text-muted-foreground">비워두면 이벤트 제목이 사용됩니다</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoDescription">
              SEO 설명{' '}
              <span className="text-xs text-muted-foreground">({seoDescription.length}/300)</span>
            </Label>
            <Textarea
              id="seoDescription"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              maxLength={300}
              rows={3}
              placeholder="이벤트를 간단히 소개하는 문장을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ogImageUrl">OG 이미지 URL</Label>
            <Input
              id="ogImageUrl"
              type="url"
              value={ogImageUrl}
              onChange={(e) => setOgImageUrl(e.target.value)}
              placeholder="https://..."
            />
            <p className="text-xs text-muted-foreground">SNS 공유 시 미리보기 이미지 URL (권장 크기: 1200×630)</p>
          </div>

          {/* Preview card */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">미리보기</p>
            <div className="rounded border bg-background p-3 text-sm">
              <p className="font-medium text-blue-600">{seoTitle || event.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">invi2me.com/{event.slug}</p>
              {seoDescription && (
                <p className="mt-1 line-clamp-2 text-xs">{seoDescription}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? '저장 중...' : '저장'}
        </Button>
      </div>
    </div>
  );
}

// ── Features Tab ──────────────────────────────────────────────────────────────

function FeaturesTab({ event }: { event: AdminEventDto }) {
  const [isPending, startTransition] = useTransition();
  const [checkinEnabled, setCheckinEnabled] = useState(event.checkinEnabled);
  const [messagingEnabled, setMessagingEnabled] = useState(event.messagingEnabled);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(event.analyticsEnabled);

  function handleSave() {
    startTransition(async () => {
      const result = await updateEventFeaturesAction(event.id, {
        checkinEnabled,
        messagingEnabled,
        analyticsEnabled,
      });
      if (result.success) {
        toast.success('기능 설정이 저장되었습니다');
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">기능 활성화</CardTitle>
          <CardDescription>이 이벤트에서 사용할 기능을 선택합니다</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          <FeatureToggle
            enabled={checkinEnabled}
            onToggle={() => setCheckinEnabled((v) => !v)}
            label="현장 체크인"
            description="QR 코드를 이용한 게스트 체크인 기능을 활성화합니다"
          />
          <FeatureToggle
            enabled={messagingEnabled}
            onToggle={() => setMessagingEnabled((v) => !v)}
            label="메시지 발송"
            description="게스트에게 이메일 또는 SMS를 발송할 수 있습니다"
          />
          <FeatureToggle
            enabled={analyticsEnabled}
            onToggle={() => setAnalyticsEnabled((v) => !v)}
            label="방문 분석"
            description="페이지 방문수, 공유 성과 등 분석 데이터를 수집합니다"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? '저장 중...' : '저장'}
        </Button>
      </div>
    </div>
  );
}

// ── Danger Zone Tab ───────────────────────────────────────────────────────────

function DangerZoneTab({ event }: { event: AdminEventDto }) {
  const router = useRouter();
  const [archivePending, startArchiveTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  function handleArchive() {
    startArchiveTransition(async () => {
      const result = await archiveEventAction(event.id);
      if (result.success) {
        toast.success('이벤트가 보관되었습니다');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleDelete() {
    startDeleteTransition(async () => {
      const result = await deleteEventAction(event.id);
      if (result.success) {
        toast.success('이벤트가 삭제되었습니다');
        router.push('/app/events');
      } else {
        toast.error(result.error);
        setDeleteOpen(false);
      }
    });
  }

  const isArchived = event.status === 'archived';

  return (
    <div className="space-y-4">
      {/* Archive */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">이벤트 보관</CardTitle>
          <CardDescription>
            이벤트를 보관하면 공개 페이지에서 숨겨지고 더 이상 편집할 수 없습니다.
            보관된 이벤트는 나중에 복원할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={handleArchive}
            disabled={archivePending || isArchived}
          >
            {isArchived ? '이미 보관된 이벤트' : archivePending ? '보관 중...' : '이벤트 보관'}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Delete */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-base text-destructive">이벤트 삭제</CardTitle>
          <CardDescription>
            이벤트를 삭제하면 모든 게스트, RSVP, 메시지, 리포트 데이터가 영구적으로 삭제됩니다.
            이 작업은 되돌릴 수 없습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger render={<Button variant="destructive" />}>
              이벤트 삭제
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>정말로 삭제하시겠습니까?</DialogTitle>
                <DialogDescription>
                  이 작업은 되돌릴 수 없습니다. 이벤트와 관련된 모든 데이터가 영구 삭제됩니다.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <p className="text-sm text-muted-foreground">
                  확인을 위해 이벤트 슬러그{' '}
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs font-semibold">
                    {event.slug}
                  </code>
                  를 입력해주세요.
                </p>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={event.slug}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                  취소
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={confirmText !== event.slug || deletePending}
                >
                  {deletePending ? '삭제 중...' : '영구 삭제'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main Form ─────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<string, string> = {
  draft: '초안',
  scheduled: '예약됨',
  published: '공개됨',
  archived: '보관됨',
};

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  draft: 'secondary',
  scheduled: 'outline',
  published: 'default',
  archived: 'secondary',
};

export function EventSettingsForm({ event }: EventSettingsFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">이벤트 설정</h1>
          <p className="mt-1 text-sm text-muted-foreground">{event.title}</p>
        </div>
        <Badge variant={STATUS_VARIANT[event.status] ?? 'secondary'}>
          {STATUS_LABEL[event.status] ?? event.status}
        </Badge>
      </div>

      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
          <TabsTrigger value="basic">기본</TabsTrigger>
          <TabsTrigger value="schedule">일정</TabsTrigger>
          <TabsTrigger value="visibility">공개</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="features">기능</TabsTrigger>
          <TabsTrigger value="danger">위험</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="basic">
            <BasicInfoTab event={event} />
          </TabsContent>
          <TabsContent value="schedule">
            <ScheduleTab event={event} />
          </TabsContent>
          <TabsContent value="visibility">
            <VisibilityTab event={event} />
          </TabsContent>
          <TabsContent value="seo">
            <SeoTab event={event} />
          </TabsContent>
          <TabsContent value="features">
            <FeaturesTab event={event} />
          </TabsContent>
          <TabsContent value="danger">
            <DangerZoneTab event={event} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
