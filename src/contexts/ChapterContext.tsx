import React, { createContext, useContext, useState } from 'react';

interface Chapter {
  id: string;
  title: string;
  type: 'chapter' | 'page';
}

interface ChapterContextType {
  chapters: Chapter[];
  updateChapterTitle: (chapterId: string, newTitle: string) => void;
  setChapters: (chapters: Chapter[]) => void;
}

const ChapterContext = createContext<ChapterContextType | undefined>(undefined);

export function ChapterProvider({ children }: { children: React.ReactNode }) {
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const updateChapterTitle = (chapterId: string, newTitle: string) => {
    setChapters(prevChapters =>
      prevChapters.map(chapter =>
        chapter.id === chapterId
          ? { ...chapter, title: newTitle }
          : chapter
      )
    );
  };

  return (
    <ChapterContext.Provider value={{ chapters, updateChapterTitle, setChapters }}>
      {children}
    </ChapterContext.Provider>
  );
}

export function useChapters() {
  const context = useContext(ChapterContext);
  if (context === undefined) {
    throw new Error('useChapters must be used within a ChapterProvider');
  }
  return context;
}