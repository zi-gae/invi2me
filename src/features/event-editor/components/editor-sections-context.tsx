'use client';

import { createContext, useContext, useState } from 'react';
import type { SectionBlockDto } from '../types/editor.dto';

type EditorSectionsContextType = {
  sections: SectionBlockDto[];
  setSections: React.Dispatch<React.SetStateAction<SectionBlockDto[]>>;
};

const EditorSectionsContext = createContext<EditorSectionsContextType | null>(null);

export function EditorSectionsProvider({
  initialSections,
  children,
}: {
  initialSections: SectionBlockDto[];
  children: React.ReactNode;
}) {
  const [sections, setSections] = useState(initialSections);
  return (
    <EditorSectionsContext.Provider value={{ sections, setSections }}>
      {children}
    </EditorSectionsContext.Provider>
  );
}

export function useEditorSections() {
  const ctx = useContext(EditorSectionsContext);
  if (!ctx) throw new Error('useEditorSections must be used within EditorSectionsProvider');
  return ctx;
}
