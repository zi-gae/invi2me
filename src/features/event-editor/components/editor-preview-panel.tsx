'use client';

import { SectionRenderer } from './section-renderer';
import { useEditorSections } from './editor-sections-context';

interface EditorPreviewPanelProps {
  eventSlug: string;
}

export function EditorPreviewPanel({ eventSlug }: EditorPreviewPanelProps) {
  const { sections } = useEditorSections();
  const enabledSections = sections.filter((s) => s.isEnabled);

  if (enabledSections.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        활성화된 섹션이 없습니다
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center bg-stone-100">
      {/* 모바일 프레임 — iPhone 비율 375×812 */}
      <div className="h-203 w-93.75 overflow-hidden rounded-[2rem] border-4 border-stone-800 bg-white shadow-2xl">
        {/* 노치 */}
        <div className="flex h-7 items-center justify-center bg-stone-800">
          <div className="h-3 w-20 rounded-full bg-stone-700" />
        </div>
        {/* 콘텐츠 */}
        <div className="h-[calc(100%-1.75rem)] overflow-y-auto">
          {enabledSections.map((section) => (
            <SectionRenderer key={section.id} section={section} eventSlug={eventSlug} />
          ))}
        </div>
      </div>
    </div>
  );
}
