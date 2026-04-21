'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Eye, List } from 'lucide-react';

interface EditorLayoutTabsProps {
  previewPanel: React.ReactNode;
  sectionListPanel: React.ReactNode;
}

export function EditorLayoutTabs({ previewPanel, sectionListPanel }: EditorLayoutTabsProps) {
  return (
    <Tabs defaultValue="sections" className="h-full">
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

      <TabsContent value="sections" className="min-h-0 overflow-y-auto">
        <div className="p-4">
          {sectionListPanel}
        </div>
      </TabsContent>

      <TabsContent value="preview" className="min-h-0">
        <div className="h-full">
          {previewPanel}
        </div>
      </TabsContent>
    </Tabs>
  );
}
