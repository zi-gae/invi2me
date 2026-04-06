// Event Editor DTOs

export interface EventPageDto {
  id: string;
  eventId: string;
  locale: string;
  title: string | null;
  slug: string;
  pageType: string;
  status: string;
  isHome: boolean;
  publishedVersionId: string | null;
  currentVersionNo: number;
}

export interface EventPageVersionDto {
  id: string;
  eventPageId: string;
  versionNo: number;
  schemaVersion: number;
  contentJson: Record<string, unknown>;
  themeTokens: Record<string, unknown>;
  publishedAt: string | null;
  createdBy: string | null;
  createdAt: string;
}

export interface SectionBlockDto {
  id: string;
  sectionType: string;
  sectionKey: string;
  sortOrder: number;
  isEnabled: boolean;
  propsJson: Record<string, unknown>;
  visibilityRules: Record<string, unknown>;
}

export interface PublishedPageDto {
  eventSlug: string;
  locale: string;
  title: string | null;
  sections: SectionBlockDto[];
  themeTokens: Record<string, unknown>;
}
