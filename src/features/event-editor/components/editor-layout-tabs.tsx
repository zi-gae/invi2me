'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Eye, List } from 'lucide-react';

interface EditorLayoutTabsProps {
  previewPanel: React.ReactNode;
  sectionListPanel: React.ReactNode;
}

export function EditorLayoutTabs({ previewPanel, sectionListPanel }: EditorLayoutTabsProps) {
  return (
    <Tabs defaultValue="sections">
      <TabsList className="mx-4 mt-2">
        <TabsTrigger value="sections">
          <List className="size-4" />
          섹션 목록
        </TabsTrigger>
        <TabsTrigger value="preview">
          <Eye className="size-4" />
          미리보기
        </TabsTrigger>
      </TabsList>

      <TabsContent value="sections">
        <div className="p-4">
          {sectionListPanel}
        </div>
      </TabsContent>

      <TabsContent value="preview">
        <div className="h-[calc(100dvh-7rem)]">
          {previewPanel}
        </div>
      </TabsContent>
    </Tabs>
  );
}
