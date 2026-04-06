import { Layout, Plus, Eye, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { db } from '@/db';
import { eventPages, eventSections } from '@/db/schema/content';
import { eq } from 'drizzle-orm';

interface EditorPageProps {
  params: Promise<{ eventId: string }>;
}

const SECTION_TYPE_LABEL: Record<string, string> = {
  hero: '히어로',
  countdown: '카운트다운',
  invitation_message: '초대 메시지',
  couple_profile: '커플 프로필',
  event_schedule: '일정',
  location_map: '위치/지도',
  transport_guide: '교통 안내',
  parking_info: '주차 안내',
  gallery: '갤러리',
  video: '동영상',
  faq: 'FAQ',
  contact_panel: '연락처',
  gift_account: '축의금 계좌',
  guestbook: '방명록',
  rsvp_form: 'RSVP 폼',
  timeline: '타임라인',
  dress_code: '드레스 코드',
  accommodation_guide: '숙소 안내',
  notice_banner: '공지 배너',
};

export default async function EditorPage({ params }: EditorPageProps) {
  const { eventId } = await params;

  const pages = await db
    .select()
    .from(eventPages)
    .where(eq(eventPages.eventId, eventId))
    .orderBy(eventPages.createdAt);

  if (pages.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">페이지 편집기</h1>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Layout className="size-10 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            아직 생성된 페이지가 없습니다
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            페이지를 생성하여 이벤트를 꾸며보세요.
          </p>
          <Button className="mt-4" disabled>
            <Plus className="size-4" />
            페이지 생성
          </Button>
        </div>
      </div>
    );
  }

  const firstPage = pages[0];
  const sections = await db
    .select()
    .from(eventSections)
    .where(eq(eventSections.eventPageId, firstPage.id))
    .orderBy(eventSections.sortOrder);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">페이지 편집기</h1>
          <Badge variant="secondary">{firstPage.title ?? firstPage.slug}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            <Plus className="size-4" />
            섹션 추가
          </Button>
          <Button variant="outline" disabled>
            <Eye className="size-4" />
            미리보기
          </Button>
          <Button disabled>
            <Send className="size-4" />
            퍼블리시
          </Button>
        </div>
      </div>

      {/* Section List */}
      {sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Layout className="size-10 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            아직 섹션이 없습니다
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            섹션을 추가하여 페이지를 구성하세요.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section) => (
            <Card key={section.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    #{section.sortOrder}
                  </span>
                  <CardTitle className="text-base">{section.sectionKey}</CardTitle>
                  <Badge variant="outline">
                    {SECTION_TYPE_LABEL[section.sectionType] ?? section.sectionType}
                  </Badge>
                </div>
                <Badge variant={section.isEnabled ? 'default' : 'secondary'}>
                  {section.isEnabled ? '활성' : '비활성'}
                </Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground">
                  타입: {section.sectionType} · 정렬: {section.sortOrder}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
