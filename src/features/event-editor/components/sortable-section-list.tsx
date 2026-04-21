'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableSectionItem, StaticSectionItem } from './sortable-section-item';
import { reorderSectionsAction } from '../actions/editor.actions';

interface SectionData {
  id: string;
  sectionType: string;
  sectionKey: string;
  sortOrder: number;
  isEnabled: boolean;
  propsJson: Record<string, unknown>;
}

interface SortableSectionListProps {
  eventId: string;
  sections: SectionData[];
}

export function SortableSectionList({ eventId, sections: initialSections }: SortableSectionListProps) {
  const [mounted, setMounted] = useState(false);
  const [sections, setSections] = useState(initialSections);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => setMounted(true), []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);

      // Optimistic update
      const newSections = arrayMove(sections, oldIndex, newIndex);
      setSections(newSections);

      // Persist to server
      setIsPending(true);
      try {
        const orderedIds = newSections.map((s) => s.id);
        await reorderSectionsAction(eventId, orderedIds);
      } catch {
        // Rollback on failure
        setSections(sections);
      } finally {
        setIsPending(false);
      }
    },
    [sections, eventId]
  );

  // SSR時はDnDなしで静的リストのみ描画し、hydration mismatchを回避
  if (!mounted) {
    return (
      <div className="space-y-3">
        {sections.map((section, index) => (
          <StaticSectionItem
            key={section.id}
            eventId={eventId}
            section={section}
            index={index}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={isPending ? 'pointer-events-none opacity-70' : ''}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {sections.map((section, index) => (
              <SortableSectionItem
                key={section.id}
                id={section.id}
                eventId={eventId}
                section={section}
                index={index}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
